const toggleNavButton = document.getElementById('toggle-nav');
const navContainer = document.querySelector('.nav-container');

toggleNavButton.addEventListener('click', () => {
    navContainer.classList.toggle('hidden');
});

const navButtons = document.querySelectorAll('.nav-buttons button');

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const contentSections = document.querySelectorAll('.content-section');
        contentSections.forEach(section => section.classList.remove('active'));

        const target = button.dataset.target.toLowerCase();
        const targetSection = document.getElementById(target);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    });
});

function simpanData(orderNumber, customerName, itemName, quantity, orderDate, deliveryAddress) {
    const db = localStorage;
    const data = {
        orderNumber: orderNumber,
        customerName: customerName,
        itemName: itemName,
        quantity: quantity,
        orderDate: orderDate,
        deliveryAddress: deliveryAddress,
        status: 'Belum Lunas',
    };
    db.setItem('data-' + orderNumber, JSON.stringify(data));
}

function tampilkanSemuaData() {
    const db = localStorage;
    const data = [];
    for (let i = 0; i < db.length; i++) {
        const key = db.key(i);
        if (key.startsWith('data-')) {
            const value = db.getItem(key);
            data.push(JSON.parse(value));
        }
    }
    return data;
}

const orderForm = document.getElementById('order-form');
const orderOutput = document.getElementById('order-output');
const printInvoice = document.getElementById('print-invoice');
const batalPrintInvoice = document.getElementById('batal-print-invoice');

orderForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const orderNumber = document.getElementById('order-number').value;
    const customerName = document.getElementById('customer-name').value;
    const itemName = document.getElementById('item-name').value;
    const quantity = document.getElementById('quantity').value;
    const orderDate = document.getElementById('order-date').value;
    const deliveryAddress = document.getElementById('delivery-address').value;

    if (!orderNumber || !customerName || !itemName || !quantity || !orderDate || !deliveryAddress) {
        alert('Harap isi semua field sebelum mencetak faktur!');
        return;
    }

    simpanData(orderNumber, customerName, itemName, quantity, orderDate, deliveryAddress);

    document.getElementById('order-number-pdf').innerHTML = orderNumber;
    document.getElementById('customer-name-pdf').innerHTML = customerName;
    document.getElementById('item-name-pdf').innerHTML = itemName;
    document.getElementById('quantity-pdf').innerHTML = quantity;
    document.getElementById('order-date-pdf').innerHTML = orderDate;

    printInvoice.style.display = 'block';

    orderForm.reset();
});

batalPrintInvoice.addEventListener('click', () => {
    printInvoice.style.display = 'none';
});

const receiptForm = document.getElementById('receipt-form');
const receiptOutput = document.getElementById('receipt-output');
const printDeliveryNote = document.getElementById('print-delivery-note');
const batalPrintDeliveryNote = document.getElementById('batal-print-delivery-note');

receiptForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const invoiceNumber = document.getElementById('invoice-number').value;
    const paymentDate = document.getElementById('payment-date').value;
    const paymentMethod = document.getElementById('payment-method').value;

    if (!invoiceNumber || !paymentDate || !paymentMethod) {
        alert('Harap isi semua field sebelum mencetak surat jalan!');
        return;
    }

    simpanDataKwitansi(invoiceNumber, paymentDate, paymentMethod);

    document.getElementById('invoice-number-pdf').innerHTML = invoiceNumber;
    document.getElementById('payment-date-pdf').innerHTML = paymentDate;
    document.getElementById('payment-method-pdf').innerHTML = paymentMethod;

    printDeliveryNote.style.display = 'block';

    receiptForm.reset();
});

batalPrintDeliveryNote.addEventListener('click', () => {
    printDeliveryNote.style.display = 'none';
});

const generateReportButton = document.getElementById('generate-report');

generateReportButton.addEventListener('click', function (e) {
    e.preventDefault();

    const month = document.getElementById('report-month').value;
    const year = document.getElementById('report-year').value;

    if (!month || !year) {
        alert('Harap pilih bulan dan tahun untuk laporan!');
        return;
    }

    const data = tampilkanSemuaData();
    const reportTbody = document.getElementById('report-tbody');
    reportTbody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.orderNumber}</td>
            <td>${item.customerName}</td>
            <td>${item.itemName}</td>
            <td>${item.quantity}</td>
            <td>${item.orderDate}</td>
            <td>${item.deliveryAddress}</td>
            <td>${item.status}</td>
        `;
        reportTbody.appendChild(row);
    });

    const reportOutput = document.getElementById('report-output');
    reportOutput.style.display = 'block';
});

const downloadCsvButton = document.getElementById('download-csv');

downloadCsvButton.addEventListener('click', function () {
    const data = tampilkanSemuaData();
    const csvData = [];
    csvData.push("ID,Nama Pelanggan,Nama Barang,Jumlah,Tanggal,Alamat,Status");
    data.forEach(item => {
        csvData.push(`${item.orderNumber},${item.customerName},${item.itemName},${item.quantity},${item.orderDate},${item.deliveryAddress},${item.status}`);
    });
    const csvString = csvData.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'laporan_bulanan.csv';
    a.click();
});

function hapusDataLama() {
    const dataku = localStorage;
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    for (let i = 0; i < dataku.length; i++) {
        const key = dataku.key(i);
        if (key.startsWith('data-')) {
            const value = dataku.getItem(key);
            const data = JSON.parse(value);
            const orderDate = new Date(data.orderDate);
            if (orderDate < threeMonthsAgo) {
                dataku.removeItem(key);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', hapusDataLama);

function simpanDataKwitansi(invoiceNumber, paymentDate, paymentMethod) {
    const db = localStorage;
    const kwitansiData = {
        invoiceNumber: invoiceNumber,
        paymentDate: paymentDate,
        paymentMethod: paymentMethod
    };
    db.setItem('kwitansi-' + invoiceNumber, JSON.stringify(kwitansiData));

    const data = tampilkanSemuaData();
    data.forEach(item => {
        if (item.orderNumber === invoiceNumber) {
            const status = 'Lunas';
            db.setItem('data-' + invoiceNumber, JSON.stringify({ ...item, status }));
        }
    });
}

function tampilkanSemuaKwitansi() {
    const kwitansiData = [];
    for (let i = 0; i < db.length; i++) {
        const key = db.key(i);
        if (key.startsWith('kwitansi-')) {
            const value = db.getItem(key);
            kwitansiData.push(JSON.parse(value));
        }
    }
    return kwitansiData;
}
function isUserLoggedIn() {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (username && password) {
        return true;
    } else {
        return false;
    }
}

function login(username, password) {
    if (username === 'admin' && password === 'admin') {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        return true;
    } else {
        return false;
    }
}

function logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
}

const loginForm = document.getElementById('login-form');
const loginSection = document.querySelector('.login-section');
const dataSection = document.querySelector('.data-section');

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (login(username, password)) {
        loginSection.style.display = 'none';
        dataSection.style.display = 'block';
    } else {
        alert('Username atau password salah!');
    }
});

if (isUserLoggedIn()) {
    loginSection.style.display = 'none';
    dataSection.style.display = 'block';
}

const logoutButton = document.createElement('button');
logoutButton.textContent = 'Log Out';
logoutButton.style.marginTop = '20px';
logoutButton.addEventListener('click', function () {
    logout();
    loginSection.style.display = 'block';
    dataSection.style.display = 'none';
});

dataSection.appendChild(logoutButton);

dataSection.appendChild(logoutButton);

function tampilkanSemuaData() {
    const dataku = localStorage;
    const data = [];
    for (let i = 0; i < dataku.length; i++) {
        const key = dataku.key(i);
        if (key.startsWith('data-')) {
            const value = dataku.getItem(key);
            data.push(JSON.parse(value));
        }
    }
    return data;
}

function hapusData(orderNumber) {
    localStorage.removeItem('data-' + orderNumber);
    tampilkanData();
}

function tampilkanData() {
    const tanggalAwal = document.getElementById('tanggal-awal').value;
    const tanggalAkhir = document.getElementById('tanggal-akhir').value;

    if (!tanggalAwal || !tanggalAkhir) {
        alert('Harap isi tanggal awal dan tanggal akhir!');
        return;
    }

    const data = tampilkanSemuaData();
    const dataTbody = document.getElementById('data-tbody');
    dataTbody.innerHTML = '';

    data.forEach(item => {
        const orderDate = new Date(item.orderDate);
        const startDate = new Date(tanggalAwal);
        const endDate = new Date(tanggalAkhir);

        if (orderDate >= startDate && orderDate <= endDate) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.orderNumber}</td>
                <td>
                    <div class="tooltip-bubble truncate-text">
                        ${item.customerName}
                        <span class="tooltiptext">${item.customerName}</span>
                    </div>
                </td>
                <td>
                    <div class="tooltip-bubble truncate-text">
                        ${item.itemName}
                        <span class="tooltiptext">${item.itemName}</span>
                    </div>
                </td>
                <td>${item.quantity}</td>
                <td>${item.orderDate}</td>
                <td>
                    <div class="tooltip-bubble truncate-text">
                        ${item.deliveryAddress}
                        <span class="tooltiptext">${item.deliveryAddress}</span>
                    </div>
                </td>
                <td>${item.status}</td>
                <td class="action-buttons">
                    <button onclick="hapusData('${item.orderNumber}')">Hapus</button>
                    <button class="edit-button" data-order-number="${item.orderNumber}">Edit</button>
                </td>
            `;
            dataTbody.appendChild(row);
        }
    });

    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(editButton => {
        editButton.addEventListener('click', function () {
            const orderNumber = this.getAttribute('data-order-number');
            const data = JSON.parse(localStorage.getItem('data-' + orderNumber));
            const editForm = document.getElementById('edit-form');
            editForm.innerHTML = `
                <h2>Edit Data</h2>
                <form>
                    <label for="customer-name">Nama Pelanggan:</label>
                    <input type="text" id="customer-name" value="${data.customerName}">

                    <label for="item-name">Nama Barang:</label>
                    <input type="text" id="item-name" value="${data.itemName}">

                    <label for="quantity">Jumlah:</label>
                    <input type="number" id="quantity" value="${data.quantity}">

                    <label for="delivery-address">Alamat Pengiriman:</label>
                    <input type="text" id="delivery-address" value="${data.deliveryAddress}">

                    <label for="status">Status:</label>
                    <select id="status">
                        <option value="Belum Lunas" ${data.status === 'Belum Lunas' ? 'selected' : ''}>Belum Lunas</option>
                        <option value="Lunas" ${data.status === 'Lunas' ? 'selected' : ''}>Lunas</option>
                    </select>

                    <button id="save-edit-button">Simpan</button>
                </form>
            `;
            editForm.style.display = 'block';
        });
    });
}

document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'save-edit-button') {
        e.preventDefault();
        const orderNumber = document.querySelector('.edit-button').getAttribute('data-order-number');
        const customerName = document.getElementById('customer-name').value;
        const itemName = document.getElementById('item-name').value;
        const quantity = document.getElementById('quantity').value;
        const deliveryAddress = document.getElementById('delivery-address').value;
        const status = document.getElementById('status').value;

        const updatedData = {
            orderNumber,
            customerName,
            itemName,
            quantity,
            deliveryAddress,
            status,
            orderDate: new Date().toISOString()
        };

        localStorage.setItem('data-' + orderNumber, JSON.stringify(updatedData));
        tampilkanData();
        document.getElementById('edit-form').style.display = 'none';
    }
});

const editFormDiv = document.createElement('div');
editFormDiv.id = 'edit-form';
editFormDiv.style.display = 'none';
document.body.appendChild(editFormDiv);

document.querySelector('#filter-form button').addEventListener('click', function (e) {
    e.preventDefault();
    tampilkanData();
});

document.addEventListener('DOMContentLoaded', function () {
    const tooltipBubbles = document.querySelectorAll('.tooltip-bubble');

    tooltipBubbles.forEach(tooltipBubble => {
        tooltipBubble.addEventListener('click', function (e) {
            e.stopPropagation();
            const tooltipText = this.querySelector('.tooltiptext');
            tooltipText.classList.toggle('visible');
        });
    });

    document.addEventListener('click', function () {
        tooltipBubbles.forEach(tooltipBubble => {
            const tooltipText = tooltipBubble.querySelector('.tooltiptext');
            tooltipText.classList.remove('visible');
        });
    });

});

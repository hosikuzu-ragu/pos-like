document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const totalDisplay = document.getElementById("totalDisplay");
    const givenDisplay = document.getElementById("givenDisplay");
    const changeDisplay = document.getElementById("changeDisplay");
    const productsContainer = document.getElementById('products-container');
    const settingsContainer = document.getElementById('price-settings-container');
    const addProductBtn = document.getElementById('add-product-btn');
    const newProductNameInput = document.getElementById('new-product-name');
    const newProductPriceInput = document.getElementById('new-product-price');
    const cashButtons = document.querySelectorAll('.check button[data-value]');
    const givenResetBtn = document.getElementById('given-reset-btn');
    const shareBtn = document.getElementById('share-btn');
    const shareConfirmation = document.getElementById('share-confirmation');
    const shareURLDisplay = document.getElementById('share-url-display');
    const priceSettingsDetails = document.querySelector('.price-settings');

    // --- STATE ---
    const state = {
        products: [],
        givenAmount: 0
    };

    // --- URL STATE MANAGEMENT ---
    const utf8_to_b64 = (str) => btoa(unescape(encodeURIComponent(str)));
    const b64_to_utf8 = (str) => decodeURIComponent(escape(atob(str)));

    const loadStateFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        const config = params.get('config');
        if (!config) return false;

        try {
            const productsFromURL = JSON.parse(b64_to_utf8(config));
            if (Array.isArray(productsFromURL)) {
                state.products = productsFromURL.map((p, index) => ({
                    id: `${p.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
                    ...p,
                    quantity: 0
                }));
                return true;
            }
        } catch (e) {
            console.error("URLから設定の解析に失敗しました", e);
        }
        return false;
    };

    const saveStateToURL = () => {
        const productsToSave = state.products.map(({ name, price }) => ({ name, price }));
        const config = utf8_to_b64(JSON.stringify(productsToSave));
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('config', config);
        history.replaceState(null, '', newUrl);
        updateShareableURLView();
    };

    const updateShareableURLView = () => {
        shareURLDisplay.value = window.location.href;
    };

    // --- RENDER FUNCTIONS ---
    const renderProducts = () => {
        productsContainer.innerHTML = '';
        state.products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'card';
            productCard.innerHTML = `
                <button class="add-btn" data-id="${product.id}" data-action="add">+</button>
                <p>${product.name} <span class="item-count" data-id="${product.id}">${product.quantity}</span></p>
                <button class="remove-btn" data-id="${product.id}" data-action="remove">-</button>
            `;
            productsContainer.appendChild(productCard);
        });
        const resetCard = document.createElement('div');
        resetCard.className = 'card';
        resetCard.innerHTML = `<button id="total-reset-btn" class="total-reset-btn">all reset</button>`;
        productsContainer.appendChild(resetCard);
        document.getElementById('total-reset-btn').addEventListener('click', totalReset);
    };

    const renderSettings = () => {
        settingsContainer.innerHTML = '';
        state.products.forEach(product => {
            const settingItem = document.createElement('div');
            settingItem.className = 'setting-item';
            settingItem.innerHTML = `
                <input type="text" class="product-name-input" data-id="${product.id}" value="${product.name}">
                <input type="number" class="product-price-input" data-id="${product.id}" value="${product.price}">
                <button class="remove-product-btn" data-id="${product.id}">削除</button>
            `;
            settingsContainer.appendChild(settingItem);
        });
    };

    const render = () => {
        renderProducts();
        renderSettings();
        calculateTotal();
        if (state.products.length === 0) {
            priceSettingsDetails.open = true;
        }
    };

    // --- LOGIC & EVENT HANDLERS ---
    const calculateTotal = () => {
        const total = state.products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
        totalDisplay.value = total;
        updateChange();
    };

    const updateChange = () => {
        const totalValue = parseInt(totalDisplay.value, 10) || 0;
        const { givenAmount } = state;
        givenDisplay.value = givenAmount;
        const changeValue = givenAmount - totalValue;

        changeDisplay.value = Math.abs(changeValue);
        changeDisplay.style.color = changeValue < 0 ? '#dc3545' : '#28a745';
    };

    const updateItemQuantity = (productId, action) => {
        const product = state.products.find(p => p.id === productId);
        if (!product) return;

        if (action === 'add') {
            product.quantity++;
        } else if (action === 'remove') {
            product.quantity = Math.max(0, product.quantity - 1);
        }
        
        document.querySelector(`.item-count[data-id="${productId}"]`).textContent = product.quantity;
        calculateTotal();
    };
    
    const addProduct = () => {
        const name = newProductNameInput.value.trim();
        const price = parseInt(newProductPriceInput.value, 10);

        if (name && !isNaN(price) && price >= 0) {
            const newId = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
            state.products.push({ id: newId, name, price, quantity: 0 });
            newProductNameInput.value = '';
            newProductPriceInput.value = '';
            saveStateToURL();
            render();
        } else {
            alert('有効な商品名と価格を入力してください。');
        }
    };

    const updateProduct = (productId, key, value) => {
        const product = state.products.find(p => p.id === productId);
        if (!product) return;

        let processedValue = value;
        if (key === 'price') {
            processedValue = parseInt(value, 10);
            if (isNaN(processedValue) || processedValue < 0) return;
        }

        product[key] = processedValue;
        saveStateToURL();
        renderProducts();
        calculateTotal();
    };

    const removeProduct = (productId) => {
        state.products = state.products.filter(p => p.id !== productId);
        saveStateToURL();
        render();
    };
    
    const totalReset = () => {
        state.products.forEach(p => p.quantity = 0);
        state.givenAmount = 0;
        render();
    };

    const givenReset = () => {
        state.givenAmount = 0;
        updateChange();
    };

    const addGiven = (num) => {
        state.givenAmount += parseInt(num, 10);
        updateChange();
    };

    // --- EVENT LISTENERS ---
    productsContainer.addEventListener('click', (e) => {
        const { id, action } = e.target.dataset;
        if (e.target.tagName === 'BUTTON' && id && action) {
            updateItemQuantity(id, action);
        }
    });

    settingsContainer.addEventListener('change', (e) => {
        const { id } = e.target.dataset;
        const { classList, value } = e.target;
        if (classList.contains('product-name-input')) {
            updateProduct(id, 'name', value);
        } else if (classList.contains('product-price-input')) {
            updateProduct(id, 'price', value);
        }
    });
    
    settingsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-product-btn')) {
            if(confirm('この商品を削除しますか？')) {
                removeProduct(e.target.dataset.id);
            }
        }
    });

    addProductBtn.addEventListener('click', addProduct);
    givenResetBtn.addEventListener('click', givenReset);
    cashButtons.forEach(button => {
        button.addEventListener('click', () => addGiven(button.dataset.value));
    });

    shareBtn.addEventListener('click', async () => {
        const urlToCopy = shareURLDisplay.value;
        try {
            await navigator.clipboard.writeText(urlToCopy);
            shareConfirmation.style.display = 'block';
            setTimeout(() => {
                shareConfirmation.style.display = 'none';
            }, 2000);
        } catch (err) {
            console.error('クリップボードへのコピーに失敗しました: ', err);
            prompt("このURLをコピーしてください:", urlToCopy);
        }
    });

    // --- INITIALIZATION ---
    const initialize = () => {
        document.getElementById("lastModified").textContent = document.lastModified;
        if (!loadStateFromURL()) {
            // No default products
            saveStateToURL();
        }
        updateShareableURLView();
        render();
    };

    initialize();
});
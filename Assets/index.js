document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const totalDisplay = document.getElementById("totalDisplay");
    const givenDisplay = document.getElementById("givenDisplay");
    const changeDisplay = document.getElementById("changeDisplay");

    const priceInputs = {
        warabimoti: document.getElementById('warabimochi-price'),
        yakitori: document.getElementById('yakitori-price'),
        karubo: document.getElementById('karubo-price')
    };

    const countDisplays = {
        warabimoti: document.getElementById('warabimoti-count'),
        yakitori: document.getElementById('yakitori-count'),
        karubo: document.getElementById('karubo-count')
    };

    const productButtons = document.querySelectorAll('.products button[data-item]');
    const cashButtons = document.querySelectorAll('.check button[data-value]');
    const totalResetBtn = document.getElementById('total-reset-btn');
    const givenResetBtn = document.getElementById('given-reset-btn');

    // --- STATE ---
    const prices = { warabimoti: 100, yakitori: 200, karubo: 300 };
    const quantities = { warabimoti: 0, yakitori: 0, karubo: 0 };

    // --- INITIALIZATION ---
    Object.keys(prices).forEach(item => {
        if (priceInputs[item]) {
            priceInputs[item].value = prices[item];
        }
    });

    // --- UTILITY FUNCTIONS ---
    const getCurrentGiven = () => parseInt(givenDisplay.value) || 0;

    const calculateTotal = () => {
        let total = 0;
        for (const item in quantities) {
            total += quantities[item] * prices[item];
        }
        totalDisplay.value = total;
        updateChange();
    };

    const updateChange = () => {
        const totalValue = parseInt(totalDisplay.value) || 0;
        const givenValue = getCurrentGiven();
        const changeValue = givenValue - totalValue;

        if (changeValue < 0) {
            changeDisplay.value = Math.abs(changeValue);
            changeDisplay.style.color = '#dc3545'; // Red
        } else {
            changeDisplay.value = changeValue;
            changeDisplay.style.color = '#28a745'; // Green
        }
    };

    // --- EVENT HANDLER FUNCTIONS ---
    const updateItem = (item, action) => {
        if (action === 'add') {
            quantities[item]++;
        } else if (action === 'remove') {
            quantities[item] = Math.max(0, quantities[item] - 1);
        }
        countDisplays[item].textContent = quantities[item];
        calculateTotal();
    };

    const addGiven = (num) => {
        givenDisplay.value = getCurrentGiven() + parseInt(num, 10);
        updateChange();
    };

    const totalReset = () => {
        for (const item in quantities) {
            quantities[item] = 0;
            countDisplays[item].textContent = 0;
        }
        givenDisplay.value = 0;
        calculateTotal(); // This will set total to 0 and update change
    };

    const givenReset = () => {
        givenDisplay.value = 0;
        updateChange();
    };

    // --- EVENT LISTENERS ---
    productButtons.forEach(button => {
        button.addEventListener('click', () => {
            const { item, action } = button.dataset;
            updateItem(item, action);
        });
    });

    cashButtons.forEach(button => {
        button.addEventListener('click', () => addGiven(button.dataset.value));
    });

    totalResetBtn.addEventListener('click', totalReset);
    givenResetBtn.addEventListener('click', givenReset);

    Object.keys(priceInputs).forEach(item => {
        priceInputs[item].addEventListener('change', (e) => {
            prices[item] = parseInt(e.target.value, 10) || 0;
            calculateTotal();
        });
    });

    // --- INITIAL STATE ---
    calculateTotal();
});
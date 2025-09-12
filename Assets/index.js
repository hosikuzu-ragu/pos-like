document.addEventListener('DOMContentLoaded', () => {
    const totalDisplay = document.getElementById("totalDisplay");
    const givenDisplay = document.getElementById("givenDisplay");
    const changeDisplay = document.getElementById("changeDisplay");

    const prices = {
        warabimoti: 100,
        yakitori: 200,
        karubo: 300
    };

    const warabimochiPriceInput = document.getElementById('warabimochi-price');
    const yakitoriPriceInput = document.getElementById('yakitori-price');
    const karuboPriceInput = document.getElementById('karubo-price');

    warabimochiPriceInput.value = prices.warabimoti;
    yakitoriPriceInput.value = prices.yakitori;
    karuboPriceInput.value = prices.karubo;

    warabimochiPriceInput.addEventListener('change', () => prices.warabimoti = parseInt(warabimochiPriceInput.value) || 0);
    yakitoriPriceInput.addEventListener('change', () => prices.yakitori = parseInt(yakitoriPriceInput.value) || 0);
    karuboPriceInput.addEventListener('change', () => prices.karubo = parseInt(karuboPriceInput.value) || 0);

    const getCurrentTotal = () => parseInt(totalDisplay.value) || 0;
    const getCurrentGiven = () => parseInt(givenDisplay.value) || 0;

    window.addTotal = (item) => {
        const amount = item.startsWith('-') ? -prices[item.substring(1)] : prices[item];
        totalDisplay.value = getCurrentTotal() + amount;
        updateChange();
    }

    const addGiven = (num) => {
        givenDisplay.value = getCurrentGiven() + parseInt(num) || 0;
        updateChange();
    }

    window.totalReset = () => {
        totalDisplay.value = 0;
        givenDisplay.value = 0;
        changeDisplay.value = 0;
    }

    window.givenReset = () => {
        givenDisplay.value = 0;
        changeDisplay.value = 0;
    }

    const updateChange = () => {
        const totalValue = getCurrentTotal();
        const givenValue = getCurrentGiven();
        const changeValue = givenValue - totalValue;
        changeDisplay.value = changeValue >= 0 ? changeValue : 0;
    }

    document.querySelectorAll('.cash button').forEach(button => {
        const value = parseInt(button.textContent.replace('円', ''));
        if (!isNaN(value)) {
            button.addEventListener('click', () => addGiven(value));
        }
    });

    updateChange();
});
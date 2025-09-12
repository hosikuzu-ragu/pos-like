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

    const calculator = document.getElementById('calculator');
    const toggleButton = document.getElementById('toggle-calculator-btn');
    const closeButton = document.getElementById('close-calculator');

    toggleButton.addEventListener('click', () => calculator.classList.toggle('hidden'));
    closeButton.addEventListener('click', () => calculator.classList.add('hidden'));

    window.get_calc = (btn) => {
        const display = document.dentaku.display;
        const value = btn.value;

        if (value === '=') {
            try {
                // A slightly safer way to calculate
                const result = new Function('return ' + display.value)();
                display.value = result;
            } catch (e) {
                display.value = 'Error';
            }
        } else if (value === 'C') {
            display.value = '';
        } else {
            display.value += value;
        }
    }

    const calculatorHeader = calculator.querySelector('.calculator-header');
    let isDragging = false;
    let offsetX, offsetY;

    calculatorHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = calculator.getBoundingClientRect();
        const parentRect = calculator.parentElement.getBoundingClientRect();
        offsetX = e.clientX - (rect.left - parentRect.left);
        offsetY = e.clientY - (rect.top - parentRect.top);
        calculator.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const parentRect = calculator.parentElement.getBoundingClientRect();
            let x = e.clientX - parentRect.left - offsetX;
            let y = e.clientY - parentRect.top - offsetY;

            // Prevent dragging outside the parent
            x = Math.max(0, Math.min(x, parentRect.width - calculator.offsetWidth));
            y = Math.max(0, Math.min(y, parentRect.height - calculator.offsetHeight));

            calculator.style.left = `${x}px`;
            calculator.style.top = `${y}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        calculator.style.cursor = 'grab';
    });
});
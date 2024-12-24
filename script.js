const display = document.querySelector('.display');
const buttons = document.querySelectorAll('button');
let currentInput = '';
let previousInput = '';
let operation = null;
let shouldResetScreen = false;

// Button click handlers
buttons.forEach(button => {
    button.addEventListener('click', () => {
        handleInput(button.textContent);
    });
});

// Keyboard input handler
document.addEventListener('keydown', (event) => {
    event.preventDefault();

    // Numbers and decimal
    if (/^[0-9.]$/.test(event.key)) {
        handleInput(event.key);
    }
    // Operators
    else if (['+', '-', '*', '/', '%'].includes(event.key)) {
        let operator = event.key;
        // Convert * to × and / to ÷
        if (operator === '*') operator = '×';
        if (operator === '/') operator = '÷';
        handleInput(operator);
    }
    // Enter/Equal
    else if (event.key === 'Enter' || event.key === '=') {
        handleInput('=');
    }
    // Backspace
    else if (event.key === 'Backspace') {
        handleInput('⌫');
    }
    // Clear (Escape)
    else if (event.key === 'Escape') {
        handleInput('C');
    }
});

function handleInput(value) {
    if (value === 'C') {
        clear();
    } else if (value === '⌫') {
        backspace();
    } else if (['÷', '×', '-', '+', '%', '±'].includes(value)) {
        handleOperator(value);
    } else if (value === '=') {
        calculate();
    } else {
        appendNumber(value);
    }
    updateDisplay();
}

function clear() {
    currentInput = '';
    previousInput = '';
    operation = null;
}

function backspace() {
    currentInput = currentInput.toString().slice(0, -1);
}

function appendNumber(number) {
    if (number === '.' && currentInput.includes('.')) return;
    if (shouldResetScreen) {
        currentInput = '';
        shouldResetScreen = false;
    }
    currentInput = currentInput.toString() + number;
}

function handleOperator(op) {
    if (currentInput === '') return;
    if (previousInput !== '') {
        calculate();
    }
    operation = op;
    previousInput = currentInput;
    shouldResetScreen = true;
}

function calculate() {
    if (shouldResetScreen || currentInput === '') return;
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+':
            computation = roundResult(prev + current);
            break;
        case '-':
            computation = roundResult(prev - current);
            break;
        case '×':
            computation = roundResult(prev * current);
            break;
        case '÷':
            if (current === 0) {
                alert('Cannot divide by zero!');
                return;
            }
            computation = roundResult(prev / current);
            break;
        case '%':
            computation = roundResult(prev % current);
            break;
        case '±':
            computation = roundResult(-current);
            break;
        default:
            return;
    }

    currentInput = computation;
    operation = null;
    previousInput = '';
    shouldResetScreen = true;
}

function roundResult(number) {
    // Handle decimal precision
    const precision = 10;
    return Number(Math.round(number + 'e' + precision) + 'e-' + precision);
}

function updateDisplay() {
    // Format display to show appropriate decimal places
    if (currentInput === '') {
        display.value = '';
    } else {
        const number = parseFloat(currentInput);
        if (Number.isInteger(number)) {
            display.value = number.toString();
        } else {
            // Show up to 10 decimal places, removing trailing zeros
            display.value = number.toFixed(10).replace(/\.?0+$/, '');
        }
    }
}

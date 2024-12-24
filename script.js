const display = document.querySelector('.display');
const buttons = document.querySelectorAll('button');
const MAX_DECIMAL_PLACES = 8;
let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetDisplay = false;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        handleInput(button.textContent);
    });
});

document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (isCalculatorKey(key)) {
        event.preventDefault();
    }

    switch (key) {
        case 'Enter':
            handleInput('=');
            break;
        case 'Backspace':
            handleInput('⌫');
            break;
        case 'Escape':
            handleInput('C');
            break;
        case '*':
            handleInput('×');
            break;
        case '/':
            handleInput('÷');
            break;
        case '%':
            handleInput('%');
            break;
        default:
            if (isValidKey(key)) {
                handleInput(key);
            }
    }
});

function isCalculatorKey(key) {
    return [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '+', '-', '*', '/', '%', '.',
        'Enter', 'Backspace', 'Escape'
    ].includes(key);
}

function isValidKey(key) {
    return [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '+', '-', '.', '%'
    ].includes(key);
}

function handleInput(value) {
    if (isNumber(value)) {
        handleNumber(value);
    } else if (isOperator(value)) {
        handleOperator(value);
    } else if (value === '.') {
        handleDecimal();
    } else if (value === '=') {
        handleEquals();
    } else if (value === 'C') {
        clearCalculator();
    } else if (value === '⌫') {
        handleBackspace();
    }
    updateDisplay();
}

function isNumber(value) {
    return !isNaN(value) && value !== ' ';
}

function isOperator(value) {
    return ['+', '-', '×', '÷', '%'].includes(value);
}

function handleNumber(value) {
    if (shouldResetDisplay) {
        currentInput = value;
        shouldResetDisplay = false;
    } else {
        if (currentInput.replace('.', '').length >= 15) return;
        currentInput = currentInput === '0' ? value : currentInput + value;
    }
}

function handleOperator(value) {
    if (operation !== null) {
        calculate();
    }
    previousInput = currentInput;
    operation = value;
    shouldResetDisplay = true;
}

function handleDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
}

function handleEquals() {
    if (operation === null) return;
    calculate();
    operation = null;
}

function calculate() {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+':
            result = roundDecimal(prev + current);
            break;
        case '-':
            result = roundDecimal(prev - current);
            break;
        case '×':
            result = roundDecimal(prev * current);
            break;
        case '÷':
            if (current === 0) {
                currentInput = 'Error';
                shouldResetDisplay = true;
                return;
            }
            result = roundDecimal(prev / current);
            break;
        case '%':
            result = roundDecimal(prev % current);
            break;
        default:
            return;
    }

    if (!isFinite(result)) {
        currentInput = 'Error';
        shouldResetDisplay = true;
        return;
    }

    currentInput = formatResult(result);
    shouldResetDisplay = true;
}

function roundDecimal(number) {
    return Number(Math.round(number + 'e' + MAX_DECIMAL_PLACES) + 'e-' + MAX_DECIMAL_PLACES);
}

function formatResult(number) {
    let result = number.toString();
    
    if (result.includes('e')) {
        const parts = result.split('e');
        const base = parseFloat(parts[0]);
        const exponent = parseInt(parts[1]);
        
        if (exponent < -MAX_DECIMAL_PLACES) {
            return '0';
        } else if (exponent > 15) {
            return 'Error';
        }
        
        result = base * Math.pow(10, exponent);
    }

    const [integerPart, decimalPart] = result.split('.');

    if (integerPart.length > 15) {
        return 'Error';
    }

    if (decimalPart) {
        const trimmedDecimal = decimalPart.replace(/0+$/, '');
        
        if (trimmedDecimal.length > 0) {
            return `${integerPart}.${trimmedDecimal}`;
        }
    }

    return integerPart;
}

function clearCalculator() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    shouldResetDisplay = false;
}

function handleBackspace() {
    if (currentInput.length === 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
}

function updateDisplay() {
    if (currentInput === 'Error') {
        display.textContent = 'Error';
        return;
    }

    let displayValue = currentInput;
    const number = parseFloat(currentInput);
    
    if (!isNaN(number)) {
        if (Math.abs(number) >= 1e15) {
            displayValue = 'Error';
        } else if (Math.abs(number) < 1e-7 && number !== 0) {
            displayValue = number.toExponential(MAX_DECIMAL_PLACES - 1);
        }
    }

    display.textContent = displayValue;
}

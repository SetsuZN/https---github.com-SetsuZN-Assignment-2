const displayEl = document.getElementById("display");

let currentValue = "0";
let firstNumber = null;
let currentOperator = null;
let waitingForSecond = false;

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(operator, a, b) {
    const x = parseFloat(a);
    const y = parseFloat(b);
    if (operator === "+") return add(x, y);
    if (operator === "-") return subtract(x, y);
    if (operator === "*") return multiply(x, y);
    if (operator === "/") {
        if (y === 0) return "ERROR";
        return divide(x, y);
    }
    return null;
}

function updateDisplay() {
    displayEl.textContent = currentValue;
}

function resetAll() {
    currentValue = "0";
    firstNumber = null;
    currentOperator = null;
    waitingForSecond = false;
    updateDisplay();
}

function inputNumber(num) {
    if (waitingForSecond) {
        currentValue = num;
        waitingForSecond = false;
    } else {
        if (currentValue === "0") {
            currentValue = num;
        } else {
            currentValue += num;
        }
    }
    updateDisplay();
}

function inputDecimal() {
    if (waitingForSecond) {
        currentValue = "0.";
        waitingForSecond = false;
    } else if (!currentValue.includes(".")) {
        currentValue += ".";
    }
    updateDisplay();
}

function backspace() {
    if (currentValue.length === 1 || (currentValue.length === 2 && currentValue.startsWith("-"))) {
        currentValue = "0";
    } else {
        currentValue = currentValue.slice(0, -1);
    }
    updateDisplay();
}

function roundResult(value) {
    return Math.round(value * 1e10) / 1e10;
}

function chooseOperator(op) {
    if (currentOperator !== null && !waitingForSecond) {
        const result = operate(currentOperator, firstNumber, currentValue);
        if (result === "ERROR") {
            currentValue = "Cannot divide by 0!";
            firstNumber = null;
            currentOperator = null;
            waitingForSecond = true;
            updateDisplay();
            return;
        }
        currentValue = String(roundResult(result));
        updateDisplay();
        firstNumber = currentValue;
    } else {
        firstNumber = currentValue;
    }
    currentOperator = op;
    waitingForSecond = true;
}

function equals() {
    if (currentOperator === null || firstNumber === null) return;
    const result = operate(currentOperator, firstNumber, currentValue);
    if (result === "ERROR") {
        currentValue = "Cannot divide by 0!";
        firstNumber = null;
        currentOperator = null;
        waitingForSecond = true;
        updateDisplay();
        return;
    }
    currentValue = String(roundResult(result));
    firstNumber = null;
    currentOperator = null;
    waitingForSecond = true;
    updateDisplay();
}

document.querySelectorAll("[data-num]").forEach(function (btn) {
    btn.addEventListener("click", function () {
        if (currentValue === "Cannot divide by 0!") resetAll();
        inputNumber(btn.dataset.num);
    });
});

document.querySelectorAll("[data-op]").forEach(function (btn) {
    btn.addEventListener("click", function () {
        if (currentValue === "Cannot divide by 0!") resetAll();
        chooseOperator(btn.dataset.op);
    });
});

document.querySelectorAll("[data-action]").forEach(function (btn) {
    btn.addEventListener("click", function () {
        const action = btn.dataset.action;
        if (action === "clear") resetAll();
        else if (action === "backspace") backspace();
        else if (action === "decimal") inputDecimal();
        else if (action === "equals") equals();
    });
});

document.addEventListener("keydown", function (e) {
    const k = e.key;
    if (k >= "0" && k <= "9") inputNumber(k);
    else if (k === ".") inputDecimal();
    else if (k === "+" || k === "-" || k === "*" || k === "/") chooseOperator(k);
    else if (k === "Enter" || k === "=") {
        e.preventDefault();
        equals();
    } else if (k === "Backspace") backspace();
    else if (k === "Escape") resetAll();
});

updateDisplay();
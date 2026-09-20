// object values

const calculator ={
    displayValue: '0',
    firstOperand: null,
    expression: '',
    waitingForSecondOperand: false,
    operator:null,
};


// operator chaining
const formatResult = (value) => {
    if (!Number.isFinite(value)) {
        return 'Error';
    }

    return `${parseFloat(value.toFixed(7))}`;
};

const evaluateExpression = (expression) => {
    const tokens = expression.match(/\d*\.?\d+|[+\-*/%]/g);

    if (!tokens || tokens.length === 0) {
        return 0;
    }

    const values = [];
    const operators = [];
    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '%': 2,
    };

    const applyOperator = () => {
        const op = operators.pop();
        const right = values.pop();
        const left = values.pop();

        if (op === '/') {
            if (right === 0) {
                throw new Error('Division by zero');
            }
            values.push(left / right);
            return;
        }

        if (op === '%') {
            if (right === 0) {
                throw new Error('Division by zero');
            }
            values.push(left % right);
            return;
        }

        if (op === '+') values.push(left + right);
        if (op === '-') values.push(left - right);
        if (op === '*') values.push(left * right);
    };

    tokens.forEach((token) => {
        if (/^\d*\.?\d+$/.test(token)) {
            values.push(parseFloat(token));
            return;
        }

        while (
            operators.length > 0 &&
            precedence[operators[operators.length - 1]] >= precedence[token]
        ) {
            applyOperator();
        }

        operators.push(token);
    });

    while (operators.length > 0) {
        applyOperator();
    }

    return values[0];
};

// Update display

const updateDisplay = () =>{
    const display = document.querySelector('.screen');
    const { expression, displayValue, waitingForSecondOperand } = calculator;

    if (!expression) {
        display.value = displayValue;
        return;
    }

    if (waitingForSecondOperand || !/[+\-*/%]$/.test(expression)) {
        display.value = expression;
        return;
    }

    display.value = `${expression}${displayValue}`;
}

updateDisplay();

// Handle key press
const keys =document.querySelector('.keys')
keys.addEventListener('click',(event) =>{
    const {target} = event;
    if(!target.matches('button')){
        return;
    }

    if(target.classList.contains('operator')){
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if(target.classList.contains('function')){
        deleteLastDigit();
        updateDisplay();
        return;
    }

    if(target.classList.contains('decimal')){
           inputDecimal(target.value);
           updateDisplay();
           return;
    }

    if(target.classList.contains('all-clear')){
        resetCalculator();
        updateDisplay();
        return;
    }


    inputDigit(target.value);
    updateDisplay();
});


// Input Digit


const inputDigit = (digit) =>{
          const{ displayValue, waitingForSecondOperand} = calculator;
          

          if(waitingForSecondOperand === true){
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
          }else{
            calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
          }
};


// Input Decimal

const inputDecimal = (dot) =>{
           if(calculator.waitingForSecondOperand === true) {
            calculator.displayValue = '0.'
            calculator.waitingForSecondOperand = false;
            return;
           }

           if(!calculator.displayValue.includes(dot)){
            calculator.displayValue += dot;
           }
};




//Handle Operator

const handleOperator = (nextOperator) =>{
    if (nextOperator === '=') {
        try {
            const expression = calculator.expression && calculator.waitingForSecondOperand
                ? calculator.expression.slice(0, -1)
                : `${calculator.expression}${calculator.displayValue}`;

            if (expression) {
                const result = evaluateExpression(expression);
                calculator.displayValue = formatResult(result);
                calculator.firstOperand = result;
                calculator.expression = '';
            }
        } catch (error) {
            calculator.displayValue = 'Error';
            calculator.firstOperand = null;
            calculator.expression = '';
            calculator.operator = null;
            calculator.waitingForSecondOperand = false;
            return;
        }

        calculator.operator = null;
        calculator.waitingForSecondOperand = false;
        return;
    }


    if (calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        calculator.expression = `${calculator.expression.slice(0, -1)}${nextOperator}`;
        return;
    }

    calculator.expression = `${calculator.expression}${calculator.displayValue}${nextOperator}`;

    calculator.operator = nextOperator;
    calculator.waitingForSecondOperand = true;
};


// Calculator logic


const calculate = (firstOperand, secondOperand, operator) =>{
       if(operator === '+'){
        return firstOperand + secondOperand;
       }
       else if(operator === '-'){
        return firstOperand - secondOperand;
       }
       else if(operator === '*'){
        return firstOperand * secondOperand;
       }
       else if(operator === '/'){
        if (secondOperand === 0) {
            throw new Error('Division by zero');
        }
        return firstOperand / secondOperand;
       }
       else if(operator === '%'){
        if (secondOperand === 0) {
            throw new Error('Division by zero');
        }
        return firstOperand % secondOperand;
       }
      return secondOperand;
};

// Delete last digit
const deleteLastDigit = () => {
    if (calculator.waitingForSecondOperand) {
        calculator.expression = calculator.expression.slice(0, -1);
        calculator.operator = null;
        calculator.waitingForSecondOperand = false;
        calculator.displayValue = calculator.expression.split(/[+\-*/%]/).pop() || '0';
        return;
    }

    const currentValue = calculator.displayValue;

    if (currentValue.length > 1) {
        calculator.displayValue = currentValue.slice(0, -1);
    } else {
        calculator.displayValue = '0';
    }
};

// Reset calculator
const resetCalculator = () =>{
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.expression = '';
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

// Keyboard support
window.addEventListener('keydown', (event) => {
    const key = event.key;
    const handledKeys = ['Backspace', 'Escape', 'Enter', '=', '.', '+', '-', '*', '/', '%'];

    if (!handledKeys.includes(key) && !/^[0-9]$/.test(key)) {
        return;
    }

    event.preventDefault();

    if (/^[0-9]$/.test(key)) {
        inputDigit(key);
        updateDisplay();
        return;
    }

    if (key === '.') {
        inputDecimal('.');
        updateDisplay();
        return;
    }

    if (['+', '-', '*', '/', '%'].includes(key)) {
        handleOperator(key);
        updateDisplay();
        return;
    }

    if (key === 'Enter' || key === '=') {
        handleOperator('=');
        updateDisplay();
        return;
    }

    if (key === 'Backspace') {
        deleteLastDigit();
        updateDisplay();
        return;
    }

    if (key === 'Escape') {
        resetCalculator();
        updateDisplay();
    }
});

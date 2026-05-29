const buttons = {
    'percent': '%',
    'ce': 'CE',
    'c': 'C',
    'del': 'DEL',
    'divideByOne': '1/x',
    'power': 'x\u00B2', // x by the power of 2
    'squareRoot': '\u221Ax', // √x
    'divider': '÷',
    'nine': '9',
    'eight': '8',
    'seven': '7',
    'multiplication': '×',
    'six': '6',
    'five': '5',
    'four': '4',
    'subtract': '−',
    'three': '3',
    'two': '2',
    'one': '1',
    'addition': '+',
    'sign': '+/-',
    'zero': '0',
    'dot': '.',
    'equal': '=',
    
    // Scientific Buttons
    'sin': 'sin',
    'cos': 'cos',
    'tan': 'tan',
    
    'ln': 'ln',                   // log
    'log': 'log',                 // log10
    'powerY': 'x\u02B8',          // x by the power of Y
    'ePowerX': 'e\u02E3',         // eˣ
    'tenPowerX': '10\u02E3',      // 10 by the power of X
    'customRoot': '\u02B8\u221Ax', // radical x with the Y index
    
    'pi': '\u03C0',               // Pi
    'e': 'e',                     // neper
    
    'openParentheses': '(',
    'closeParentheses': ')',
    
    'factorial': 'n!',
    'mod': 'Mod',                 // division remainder
    'exp': 'Exp',                 // نماد علمی (انگلیسیش یادم رفت)
    
    // Memory Buttons
    'mc': 'MC',                   // clear memory
    'mr': 'MR',                   // read from memory
    'mPlus': 'M+',                // add to memory
    'mMinus': 'M-',               // remove from memory
    'ms': 'MS',                   // save in memory
    
    // Control & Modes
    'ans': 'Ans',                 // latest result
    'angleMode': 'Deg',
    'shift': 'Shift'              // switch to secondery operator
};


const scientificKeys = [
    'sin', 'cos', 'tan', 'ln', 'log', 'powerY', 'ePowerX',
    'tenPowerX', 'customRoot', 'pi', 'e', 'openParentheses',
    'closeParentheses', 'factorial', 'mod', 'exp'
];

const memoryKeys = ['mc', 'mr', 'mPlus', 'mMinus', 'ms'];

const controlKeys = ['ans', 'angleMode', 'shift'];

const eraseKeys = ['c', 'ce', 'del'];

const numberKeys = ['zero', 'one', 'two', 'three', 'four', 'five',
    'six', 'seven', 'eight', 'nine', 'dot', 'sign'
    ];

const operatorKeys = [
    'divider', 'multiplication', 'subtract', 'addition', 'equal', 
    'percent', 'divideByOne', 'power', 'squareRoot',
    'powerY', 'customRoot', 'mod'
];

let firstNumber = '';
let secondNumber = '';
let activeOperator = '';
let resetInput = false;
let angleMode = 'deg';
let memoryValue = 0;
let lastAnswer = '0';
let parenthesesStack = [];
let isShiftActive = false;

// assigning Elements
const container = document.querySelector('.buttons-container');
const standardPanel = document.querySelector('.standard-panel');
const scientificPanel = document.querySelector('.scientific-panel');
const memoryPanel = document.querySelector('.memory-panel')
const input = document.getElementById('result');
const expressionDiv = document.getElementById('expression');

// Source - https://stackoverflow.com/a/38589039
// Posted by Peter Rakmanyi, modified by community. See post 'Timeline' for change history
// Retrieved 2026-05-21, License - CC BY-SA 4.0
// to remove the scorll action from the 'input' element field
document.addEventListener('wheel', function(event){
    if(document.activeElement.type === 'number'){
        document.activeElement.blur();
    }
});


Object.entries(buttons).forEach(([key, value]) => {
    const btn = document.createElement('button')

    btn.innerText = value;
    btn.className = 'btn';
    btn.classList.add(key);

     if (memoryKeys.includes(key)) {
        memoryPanel.appendChild(btn);
     } else if (scientificKeys.includes(key) || controlKeys.includes(key)) {
        scientificPanel.appendChild(btn);
    } else {
        standardPanel.appendChild(btn);
    }

    if (numberKeys.includes(key)) {
        btn.classList.add('number');
    } else if (eraseKeys.includes(key)) {
        btn.classList.add('erase');
    } else if (scientificKeys.includes(key)) {
        btn.classList.add('scientific');
    } else if (controlKeys.includes(key)) {
        btn.classList.add('control')
    } else if (operatorKeys.includes(key)) {
        btn.classList.add('operator');
    } else if (memoryKeys.includes(key)) {
        btn.classList.add('memory')
    } else {
        console.warn(`WARN: button with the key "${key}" is NOT defined in any list`);
    }

    btn.addEventListener('click', () => {
        handleButtonClick(key, value);
    })

});

function handleButtonClick(key, value) {
    if (numberKeys.includes(key)) {
        handleNumber(key, value);
    } else if (eraseKeys.includes(key)) {
        handleErase(key);
    } else if (operatorKeys.includes(key)) {
        handleOperator(key);
    } else if (scientificKeys.includes(key)) {
        handleScientific(key);
    } else if (controlKeys.includes(key)) {
        handleControl(key);
    } else if (memoryKeys.includes(key)) {
        handleMemory(key);
    }
}


function handleNumber(key, value) {
    if (resetInput) {
        input.value = '';
        resetInput = false;
    }

    if (key === 'sign') {
        if (input.value !== '0' && input.value !== '') {
            if (input.value.startsWith('-')) {
                input.value = input.value.slice(1);
            } else {
                input.value = '-' + input.value;
            }
            return;
        }
    }

    if (key === 'dot') {
        if (input.value.includes('.')) {
            return;
        }
    }

    if (input.value === '0' && key !== 'dot' && key !== 'sign') {
        input.value = value;
    } else if (key === 'sign') {
        input.value = '-';
    } else {
        input.value += value;
    }
}

function handleErase(key) {
    if (key === 'c') {
        firstNumber = '';
        secondNumber = '';
        activeOperator = '';
        resetInput = false;
        input.value = '0';
        expressionDiv.innerText = '';
    } else if (key === 'ce') {
        input.value = '0';
    } else if (key === 'del') {
        input.value = input.value.slice(0, -1);
        if (input.value == '') {
            input.value = '0';
        }
    }
}

function calculate(num1, op, num2) {
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);

    if (isNaN(n1) || isNaN(n2)) {
        return '0';
    }

    switch (op) {
        case 'addition':
            return (n1 + n2).toString();
        case 'subtract':
            return (n1 - n2).toString();
        case 'multiplication':
            return (n1 * n2).toString();
        case 'divider':
            if (n2 !== 0) {
                return (n1 / n2).toString();
            } else {
                return "Can't divide by zero";
            }
        case 'powerY':
            return Math.pow(n1, n2).toString();
        case 'customRoot':
            return Math.pow(n1, (1 / n2)).toString();
        case 'mod':
            return (n1 % n2).toString();
        default:
            return num2;
    }
}

function handleOperator(key) {
    const currentValue = parseFloat(input.value);

    if (['percent', 'divideByOne', 'power', 'squareRoot'].includes(key)) {
        if(isNaN(currentValue)) {
            return;
        }

        if (key === 'percent') {
            input.value = (currentValue / 100).toString();
        } else if (key === 'divideByOne') {
            if (currentValue !== 0) {
                input.value = (1 / currentValue).toString();
            } else {
                input.value = "Can't divide by zero";
            }
        } else if (key === 'power') {
            // using currentValue ** currentValue was resulting in irrelevant numbers.
            input.value = Math.pow(currentValue, 2).toString();
        } else if (key === 'squareRoot') {
            if (currentValue >= 0) {
                input.value = Math.sqrt(currentValue).toString();
            } else {
                input.value = 'Error';
            }
        }

        resetInput = true;
    } else if (['addition', 'subtract', 'multiplication', 'divider', 'powerY', 'customRoot', 'mod'].includes(key)) {
        if (firstNumber !== '' && activeOperator !== '' && !resetInput) {
            secondNumber = input.value;
            const result = calculate(firstNumber, activeOperator, secondNumber);
            input.value = result;
            firstNumber = result;
        } else {
            firstNumber = input.value;
        }

        activeOperator = key;
        resetInput = true;

        const opSymbol = getOperatorSymbol(activeOperator);
            expressionDiv.innerText = `${firstNumber} ${opSymbol}`;

    } else if (key === 'equal') {
        if (firstNumber !== '' && activeOperator !== '') {
            secondNumber = input.value;
            const result = calculate(firstNumber, activeOperator, secondNumber);

            const opSymbol = getOperatorSymbol(activeOperator);
            expressionDiv.innerText = `${firstNumber} ${opSymbol} ${secondNumber} =`;

            input.value = result;
            lastAnswer = result;

            firstNumber = '';
            activeOperator = '';
            resetInput = true;
        }
    }
}

function handleScientific(key) {
    const currentValue = parseFloat(input.value);

    if (key === 'pi') {
        input.value = Math.PI.toString();
        resetInput = true;
        return;
    }
    if (key === 'e') {
        input.value = Math.E.toString();
        resetInput = true;
        return;
    }

    if (key === 'openParentheses') {
        parenthesesStack.push({
            firstNumber,
            activeOperator
        });

        firstNumber = '';
        activeOperator = '';
        input.value = '0';
        resetInput = true;
        return;
    }
    if (key === 'closeParentheses') {
        if (parenthesesStack.length > 0) {
            let remainingResult = input.value;

            if (firstNumber !== '' && activeOperator !== '') {
                remainingResult = calculate(firstNumber, activeOperator, remainingResult);
            }

            const savedState = parenthesesStack.pop();
            firstNumber = savedState.firstNumber;
            activeOperator = savedState.activeOperator;

            input.value = remainingResult;
            resetInput = true;
        }
        return;
    }

    if (isNaN(currentValue)) {
        return;
    }

    if (key === 'exp') {
        if (input.value !== '0' && !input.value.includes('e')) {
            input.value += 'e';
        }
        return;
    }

    let finalOperation = key;
    if (isShiftActive && ['sin', 'cos', 'tan'].includes(key)) {
        if (key === 'sin') {
            finalOperation = 'asin'
        } else if (key === 'cos') {
            finalOperation = 'acos';
        } else if (key === 'tan') {
            finalOperation = 'atan';
        }
    }

    let angle;
    if (['sin', 'cos', 'tan'].includes(key)) {
        if (angleMode === 'deg') {
            angle = (currentValue * Math.PI) / 180;
        } else {
            angle = currentValue;
        }

        if (finalOperation === 'sin') {
            input.value = Math.sin(angle).toString();
        } else if (finalOperation === 'cos') {
            input.value = Math.cos(angle).toString();
        } else if (finalOperation === 'tan') {
            if (angleMode === 'deg' && currentValue % 180 === 90) {
                input.value = 'Error';
            } else {
                input.value = Math.tan(angle).toString();
            }
        }

        if (isShiftActive) {
            toggleShift(false)
        }

    } else if (['asin', 'acos', 'atan'].includes(finalOperation)) {
        if ((key === 'asin' || key === 'acos') && (currentValue < -1 || currentValue > 1)) {
            input.value = 'Error';
            resetInput = true;
            toggleShift(false);
            return;
        }

        let radResult = 0;
        if (finalOperation === 'asin') {
            radResult = Math.asin(currentValue);
        } else if (finalOperation === 'acos') {
            radResult = Math.acos(currentValue);
        } else if (finalOperation === 'atan') {
            radResult = Math.atan(currentValue);
        }

        let finalResult;
        if (angleMode === 'deg') {
            finalResult = (radResult * 180) / Math.PI;
        } else {
            finalResult = radResult;
        }
        input.value = finalResult.toString();
    }
    
    if (isShiftActive) {
        toggleShift(false);
    }

    else if (key === 'ln') {
        if (currentValue > 0) {
            input.value = Math.log(currentValue).toString();
        } else {
            input.value = 'Error';
        }
    } else if (key === 'log') {
        if (currentValue > 0) {
            input.value = Math.log10(currentValue).toString();
        } else {
            input.value = "Error";
        }
    } else if (key === 'ePowerX') {
        input.value = Math.exp(currentValue).toString();
    } else if (key === 'tenPowerX') {
        input.value = Math.pow(10, currentValue).toString();
    } else if (key === 'factorial') {
        input.value = factorial(currentValue);
    }

    resetInput = true;
}

function handleMemory(key) {
    const currentValue = parseFloat(input.value);

    if (isNaN(currentValue)) {
        return;
    }

    if (key === 'mc') {
        memoryValue = 0;
    } else if (key === 'mr') {
        input.value = memoryValue.toString();
        resetInput = true;
    } else if (key === 'mPlus') {
        memoryValue += currentValue;
        resetInput = true;
    } else if (key === 'mMinus') {
        memoryValue -= currentValue;
        resetInput = true;
    } else if (key === 'ms') {
        memoryValue = currentValue;
        resetInput = true;
    }
}

function handleControl(key) {
    if (key === 'angleMode') {
        const angleBtn = document.querySelector('.angleMode');

        if (angleMode === 'deg') {
            angleMode = 'rad'
            angleBtn.innerText = 'Rad';
            console.log('radian mode');
        } else {
            angleMode = 'deg';
            angleBtn.innerText = 'Deg';
            console.log('Degree mode');
        }
    } else if (key === 'ans') {
        input.value = lastAnswer;
        resetInput = true;
    } else if (key === 'shift') {
        toggleShift(!isShiftActive);
    }
}

function factorial(n) {
    if (n < 0 || !Number.isInteger(n)){
        return 'Error';
    }
    if (n === 0 || n === 1){
        return '1';
    }
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result.toString();
}

function toggleShift(state) {
    isShiftActive = state;

    const shiftBtn = document.querySelector('.shift');
    const sinBtn = document.querySelector('.sin');
    const cosBtn = document.querySelector('.cos');
    const tanBtn = document.querySelector('.tan');

    if (isShiftActive) {
        shiftBtn.classList.add('active-shift');

        sinBtn.innerText = 'sin\u207B\u00B9';
        cosBtn.innerText = 'cos\u207B\u00B9';
        tanBtn.innerText = 'tan\u207B\u00B9';
    } else {
        shiftBtn.classList.remove('active-shift');

        sinBtn.innerText = 'sin';
        cosBtn.innerText = 'cos';
        tanBtn.innerText = 'tan';
    }
}

function getOperatorSymbol(opKey) {
    if (opKey === 'powerY') {
        return '^';
    }
    if (opKey === 'customRoot') {
        return 'yroot';
    }
    return buttons[opKey] || '';
}
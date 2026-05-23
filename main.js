const buttons = {
    'percent': '%',
    'ce': 'CE',
    'c': 'C',
    'del': 'DEL',
    'dividByOne': '1/x',
    'power': 'x\u00B2',
    'squreRoot': '\u221Ax',
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
    'equal': '='
};

// Source - https://stackoverflow.com/a/38589039
// Posted by Peter Rakmanyi, modified by community. See post 'Timeline' for change history
// Retrieved 2026-05-21, License - CC BY-SA 4.0
// to remove the scorll action from the 'input' element field
document.addEventListener('wheel', function(event){
    if(document.activeElement.type === 'number'){
        document.activeElement.blur();
    }
});

function handleButtonClick(button) {
    const input = document.getElementById('result');
    let currentText = input.value;
    let lastValue = currentText.length - 1;
    
    currentText += currentText;
    if (currentText === '0') {
        currentText = '';
    }
    
}


const container = document.querySelector('.buttons-container');
const input = document.getElementById('result');

Object.entries(buttons).forEach(([key, value]) => {
    const btn = document.createElement('button')

    btn.innerText = value;
    btn.className = 'btn';
    btn.classList.add(key);

    if (!isNaN(value) || value === buttons.dot) {
        btn.classList.add('number');
    } else if (value === buttons.c || value === buttons.ce || value === buttons.del) {
        btn.classList.add('erase');
    } else {
        btn.classList.add('operator');
    }

    btn.addEventListener('click', () => {
        if (btn.classList.contains('number')) {
            if (currentText === '0') {
                currentText = '';
        }
        currentText += value;
        } else if (btn.classList.contains('operator')) {
            // add condition that if there is already a operator available in 
            // the field it replace that with the new one when a new operator is clicked on
            if (btn.classList.contains('addition')) {
                currentText += '+';
            }
            if (btn.classList.contains('subtract')) {
                // if (currentText.contains(btn.classList.contains('operator'))) {
                // currentText += '(-';
                // } else {
                    currentText += '-';
                // }
            }
        }
    });

    container.appendChild(btn);
});
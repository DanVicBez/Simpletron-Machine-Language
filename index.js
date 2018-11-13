// SML execution
var memory = [],
    instructionCounter = 0,
    instructionRegister = 0,
    operator = 0,
    operand = 0,
    nextCounter = 0,
    accumulator = 0,
    halted = false,
    debug = false;

// DOM Elements
var btnLoad = document.getElementById('btn-load'),
    btnExec = document.getElementById('btn-exec'),
    btnDebug = document.getElementById('btn-debug'),
    btnClear = document.getElementById('btn-clear'),
    code = document.querySelector('#code textarea'),
    output = document.querySelector('#output textarea');

// Initialize memory
for(var i = 0; i < 100; i++) {
    memory.push(0);
}

// Constantly update the memory dump
setInterval(function() {
    var dump = 'accumulator:\t\t' + format(accumulator) + 
        '\ninstructionCounter:\t' + format(instructionCounter) + 
        '\nnextCounter:\t\t' + format(nextCounter) +
        '\ninstructionRegister:\t' + format(instructionRegister) + 
        '\n\n\t0\t1\t2\t3\t4\t5\t6\t7\t8\t9\n';
    
    for(var i1 = 0; i1 < 10; i1++) {
        dump += i1 * 10;
        
        for(var i2 = 0; i2 < 10; i2++) {
            dump += '\t' + format(memory[i1 * 10 + i2]);
        }
        
        dump += '\n'
    }
    
    document.querySelector('#dump textarea').innerText = dump;
}, 100);

// Load the machine code into memory
btnLoad.addEventListener('click', function() {
    btnDebug.innerText = 'Start Debug';
    
    debug = false;
    var lines = code.value.split('\n');

    if(isValid(lines)) {
        consoleStatus('Program loaded onto memory');

        memory.forEach(function(value, index) {
            if(index < lines.length) {
                memory[index] = ~~lines[index].substring(4);
            } else {
                memory[index] = 0;
            }
        });

    } else {
        error();
    }
});

// Execute the instructions in the memory
btnExec.addEventListener('click', function() {
    if(debug) {
        alert('You are already debugging. Please click "Load into memory" to stop debugging.');
        return;
    }
    
    consoleStatus('Beginning program execution');

    halted = false;
    instructionCounter = 0;
    nextCounter = 0;
    accumulator = 0;

    while(!halted) {
        execInstruction();
    }
});

// Step through the code line-by-line
btnDebug.addEventListener('click', function() {
    if(!debug) {
        debug = true;
        halted = false;
        instructionCounter = 0;
        nextCounter = 0;
        accumulator = 0;
        
        btnDebug.innerText = 'Next Line';
    }
    
    execInstruction();
});

// Clear the console
btnClear.addEventListener('click', function() {
    output.value = '';
});

// Executes the next instruction
function execInstruction() {
    instructionCounter = nextCounter;

    if(instructionCounter === memory.length) {
        halt();
    }
    
    instructionRegister = ~~(memory[instructionCounter]);
    operator = ~~(instructionRegister / 100);
    operand = instructionRegister % 100;

    nextCounter = instructionCounter + 1;

    switch(operator) {
        case opcodes.READ:
            memory[operand] = parseInt(prompt('Integer from -9999 to 9999'), 10) || 0;
            break;
        case opcodes.WRITE:
            consoleWrite(memory[operand]);
            break;
        case opcodes.LOAD:
            accumulator = memory[operand];
            break;
        case opcodes.STORE:
            memory[operand] = accumulator;
            break;
        case opcodes.ADD:
            accumulator += memory[operand];
            break;
        case opcodes.SUBTRACT:
            accumulator -= memory[operand];
            break;
        case opcodes.MULTIPLY:
            accumulator *= memory[operand];
            break;
        case opcodes.DIVIDE:
            if(accumulator === 0) {
                consoleStatus('FATAL ERROR: division by zero');
                halt();
            } else {
                accumulator = ~~(memory[operand] / accumulator);    
            }
            break;
        case opcodes.BRANCH:
            nextCounter = operand;
            break;
        case opcodes.BRANCHNEG:
            if(accumulator < 0) {
                nextCounter = operand;
            }
            break;
        case opcodes.BRANCHZERO:
            if(accumulator === 0) {
                nextCounter = operand;
            }
            break;
        case opcodes.HALT:
            halt();
            break;
        default:
            consoleStatus('FATAL ERROR: invalid operation code');
            halt();
            break;
    }

    // Check for accumulator overflow and underflow
    if(accumulator > 9999) {
        consoleStatus('FATAL ERROR: accumulator overflow');
        halt();
    } else if(accumulator < -9999) {
        consoleStatus('FATAL ERROR: accumulator underflow');
        halt();
    }

    var loc = -1;
    var flow = 0;

    // Check for memory overflow and underflow
    for(var i = 0; i < memory.length && loc === -1; i++) {
        if(Math.abs(memory[i]) > 9999) {
            loc = i;
            flow = Math.sign(memory[i]);
        }
    }

    if(loc > -1) {
        consoleStatus('FATAL ERROR: ' + (flow === -1 ? 'under' : 'over') + 'flow at memory location ' + loc);
        halt();
    }
}

// Determines whether the SML code is valid
function isValid(lines) {
    // Make sure that every line matches the correct format
    if(lines.filter(function(value) {
        return !value.match(/^\d{2}: (\+|-)?\d{4}$/ig);
    }).length) {
        return false;
    } else {
        var valid = true;

        // Make sure that the memory locations are in order
        lines.forEach(function(value, index) {
            var num = parseInt(value.substring(0, 2), 10);

            if(index === 0) {
                if(num !== 0) {
                    valid = false;
                }
            } else {
                var prev = parseInt(lines[index - 1].substring(0, 2), 10);

                if(num - prev !== 1) {
                    valid = false;
                }
            }
        });

        return valid;
    }

    return true;
}

// Displays an error message
function error() {
    alert('The code does not match the SML syntax rules. Please check it and try again.');
}

// Halts the SML code
function halt() {
    consoleStatus('Program halted');
    halted = true;
    debug = false;
    
    btnDebug.innerText = 'Start Debug';
}

// Writes to the console
function consoleWrite(val) {
    output.value += val + '\n';
    output.scrollTop = output.scrollHeight;
}

// Writes to the console with asterisks
function consoleStatus(val) {
    consoleWrite('*** ' + val + ' ***');
}

// Formats a number for the memory dump
function format(num) {
    var sign = (num >= 0 ? '+' : '-');
    
    num = Math.abs(num) + '';
    
    while(num.length < 4) {
        num = '0' + num;
    }
    
    return sign + num;
}
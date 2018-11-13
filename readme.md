The Simpletron
===============
Operation Codes
---------------
* 10: READ
* 11: WRITE
* 20: LOAD
* 21: STORE
* 30: ADD
* 31: SUBTRACT
* 32: MULTIPLY
* 33: DIVIDE
* 40: BRANCH
* 41: BRANCHNEG
* 42: BRANCHZERO
* 43: HALT

Sample Programs
---------------
Print the inputted number:

    00: 1003
    01: 1103
    02: 4300

Print the larger of two numbers:

    00: 1009
    01: 1010
    02: 2009
    03: 3110
    04: 4107
    05: 1109
    06: 4300
    07: 1110
    08: 4300

    
Returns the floored average of the inputted numbers.
The first input number is the number of numbers you wish to average,
While each subsequent number is part of the averaged set.
The final average, without decimals, will be output once all numbers are input.

    00: 1023
    01: 2023
    02: 2119
    03: 1022
    04: 2020
    05: 3022
    06: 2120
    07: 2023
    08: 3118
    09: 2123
    10: 2024
    11: 3123
    12: 4103
    13: 2019
    14: 3320
    15: 2121
    16: 1121
    17: 4300
    18: 0001
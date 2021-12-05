# Introduction
You can clone the repository and run the calculator without installing anything.

0 1 2 3 4 5 6 7 8 9 => 10
. +/- + - * / = AC => 8

clear
7 8 9 + 
4 5 6 -
1 2 3 *
0 . ± /
equal

I coded my own state machine inspired by [xstate](https://xstate.js.org/).

# Use Cases
## Calculate
**As a** user **I want** to perform calculation **so that** I do not need to calculate in my head.

**Scenario**: User needs to calculate the number of wedding guests. 
- **Given** I start a new calculation **when** I enter a number **then** the number appears in the result area **and** I can enter another number or perform an action.
- **Given** a number is entered **when** I perform an action **then** the action appears in the result area **and** I can enter another number.
- **Given** an action was performed **when** I enter another number **then** the number appears in the result area **and** I can enter another number or perform the calculation by pressing equal sign.

## Keyboard support
**As a** user **I want** to enter numbers and perform actions with the keyboard **so that** I can perform calculations faster.

**Scenario**: User uses the calculator on his laptop. **Given** I start a new calculation **when** I press the key 5 **then** then 5 is entered in the calculation.
- numbers: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
- actions: multiply, divide, add, substract, reset...
- other: decimal

## Calculate with one decimal
**As a** user **I want** to calculate with numbers with decimal points **so that** I can calculate more precisely.

**Scenario**: User needs to calculate more precisely. 
- **Given** a number is entered **when** I press the decimal button **then** the decimal point appears in the result area **and** I can enter another number.
- **Given** I enter a second number  **when** the number appears in the result area **then** I can not add another decimal point **and** I can not enter a third number.
- Edge Cases: 0.0 = 0, .5 = 0.5

## Reset calculator
**As a** user **I want** to reset the calculator **so that** I can start my calculation from scratch.

**Scenario**: User has to make a new calculation.
- **Given** I entered a calculation **when** I press the reset button **then** the calculation is removed from the result area and I can start a new calculation.
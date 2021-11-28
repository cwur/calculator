// Setup
// Get all nodes
// output
// input -> buttons
// Initially reset output to nothing ("")
// Add event listeners to input

// States
// - idle: No number entered. Only numbers, decimal available.
// - number: Number entered. All buttons available, except equal.
// - decimal: Decimal point is entered. Only numbers available.
// - action: Action entered. Only numbers and decimal available.

/**
 * States
 * 
 * idle:
 *  ui: only numbers, decimal available
 *  entry: clears output
 *  transistions: first-numbers, first-decimal
 * number:
 *  ui: all buttons available, except equal
 *  function: toogleSign
 *  transitions: first-decimal, action, idle 
 * decimal:
 *  ui: all buttons available, except decimal
 *  function: toogleSign
 *  transitions: action, idle 
 * 
 *  2 -> 2. -> 2.2 -> + -> 3. -> 3.4 -> = 5.6
 * 
 * **/

const outputNode = document.querySelector(".output");
const inputNodes = document.querySelectorAll("button");

inputNodes.forEach(inputNode => {
  inputNode.addEventListener('click', () => handleClick(inputNode.dataset))
});

let states = {
  "current": {
    name: "initial",
    number: null,
    calculationType: null,
    calculationTypeNext: null
  },
  actions: {
    hello: () => alert("hello initial"),
    toggleSign,
    clear: () => transition("initial"),
  },
  "initial": {
    entry: () => {
      reset();
    },
    actions: {
      enterNumber: (number) => {
        transition("enter-number");
        enterNumber(number);
      },
      enterDecimal: () => {
        transition("enter-decimal");
        enterDecimal();
      },
    },
    exit: () => { },
  },
  "enter-number": {
    entry: () => { },
    actions: {
      enterNumber,
      enterDecimal: () => {
        transition("enter-decimal");
        enterDecimal();
      },
      add: () => {
        add();
        transition("calculate");
      },
      substract: () => {
        substract();
        transition("calculate");
      },
      multiply: () => {
        multiply();
        transition("calculate");
      },
      divide: () => {
        divide();
        transition("calculate");
      },
      calculate: () => {
        transition("calculate-final");
      },
    },
    exit: () => { },
  },
  "enter-decimal": {
    entry: () => { },
    actions: {
      enterNumber,
      add: () => {
        add();
        transition("calculate");
      },
      substract: () => {
        substract();
        transition("calculate");
      },
      multiply: () => {
        multiply();
        transition("calculate");
      },
      divide: () => {
        divide();
        transition("calculate");
      },
      calculate: () => {
        transition("calculate-final");
      },
    },
    exit: () => { },
  },
  "calculate": {
    entry: () => calculate(),
    actions: {
      enterNumber: (number) => {
        transition("enter-number")
        enterNumber(number);
      },
      enterDecimal: () => {
        transition("enter-decimal");
        enterDecimal();
      },
    },
    exit: () => {
      clearOutput();
    },
  },
  "calculate-final": {
    entry: () => calculate(),
    actions: {
      enterNumber: (number) => {
        transition("enter-number")
        enterNumber(number);
      },
      enterDecimal: () => {
        transition("enter-decimal");
        enterDecimal();
      },
    },
    on: {
      enterNumber: "enter-number",
      enterDecimal: "enter-decimal",
    },
    exit: () => reset(),
  },
}

transition("initial");

function transition(state) {
  states[states.current.name].exit();
  states[state].entry();
  states.current.name = state;

  document.querySelector("body").dataset.state = state;
}

function call(action, payload) {
  console.log(states);

  const state = states[states.current.name];
  const actionExistsInState = Object.keys(state.actions).includes(action);
  if (actionExistsInState) {
    state.actions[action](payload);
    return;
  }

  const actionExistsAboveState = Object.keys(states.actions).includes(action);
  if (actionExistsAboveState) {
    states.actions[action](payload);
    return;
  }
}

function handleClick({ message, value }) {
  call(message, value);
}

function enterNumber(number) {
  let output = outputNode.textContent;
  outputNode.textContent = output + number;
}

function toggleSign() {
  let output = outputNode.textContent;
  output = output[0] === "-" ? output.slice(1) : "-" + output;

  outputNode.textContent = output;
}

function enterDecimal() {
  let output = outputNode.textContent;
  outputNode.textContent = output + ".";
}

function add() {
  states.current.calculationTypeNext = (a, b) => a + b;
}

function divide() {
  states.current.calculationTypeNext = (a, b) => b / a;
}

function substract() {
  states.current.calculationTypeNext = (a, b) => b - a;
}

function multiply() {
  states.current.calculationTypeNext = (a, b) => a * b;
}

function calculate() {
  let output = outputNode.textContent;

  if (!states.current.number) {
    states.current.number = output;
    states.current.calculationType = states.current.calculationTypeNext
    return;
  }

  const newOutput = states.current.calculationType(Number(output), Number(states.current.number));
  states.current.number = newOutput;
  outputNode.textContent = newOutput;

  states.current.calculationType = states.current.calculationTypeNext
}

function reset() {
  clearOutput();
  states.current.number = null;
  states.current.calculationType = null;
}

function clearOutput() {
  outputNode.textContent = "";
}
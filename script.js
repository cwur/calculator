/*
 * @TODO: Maximal eine Nachkommastelle eingeben. Neuer State?
 * @TODO: Keyboard Support!
 * @TOOD: Löschen von Zeichen?
 * @TODO: Design?
 * @TODO: Sonst noch was extra auf der Homepage?
 */


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

document.addEventListener('keypress', (e) => handleKeyPress(e.key));

inputNodes.forEach(inputNode => {
  inputNode.addEventListener('click', () => handleClick(inputNode.dataset));
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
    entry: () => reset(),
    actions: {
      enterNumber: (number) => enterNumber(number),
    },
    on: {
      enterDecimal: "enter-decimal",
      enterNumber: "enter-number",
    },
    exit: () => { },
  },
  "enter-number": {
    entry: () => { },
    actions: {
      enterNumber,
      add,
      substract,
      multiply,
      divide,
    },
    on: {
      calculate: "calculate-final",
      enterDecimal: "enter-decimal",
      divide: "calculate",
      multiply: "calculate",
      substract: "calculate",
      add: "calculate",
    },
    exit: () => { },
  },
  "enter-decimal": {
    entry: () => { enterDecimal() },
    actions: {
      enterNumber,
      add,
      substract,
      multiply,
      divide,
    },
    on: {
      calculate: "calculate-final",
      divide: "calculate",
      multiply: "calculate",
      substract: "calculate",
      add: "calculate",
    },
    exit: () => { },
  },
  "calculate": {
    entry: () => calculate(),
    actions: {
      enterNumber: (number) => {
        clearOutput();
        enterNumber(number);
      },
      enterDecimal: () => clearOutput()
    },
    on: {
      enterNumber: "enter-number",
      enterDecimal: "enter-decimal",
    },
    exit: () => { },
  },
  "calculate-final": {
    entry: () => calculate(),
    actions: {
      enterNumber: (number) => enterNumber(number),
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
  console.log('transition to ', state, states.current)

  states[states.current.name].exit();
  states[state].entry();
  states.current.name = state;

  document.querySelector("body").dataset.state = state;
}

function call(action, payload) {
  console.log("action...", action, payload, states);

  const state = states[states.current.name];

  const actionExistsInState = Object.keys(state.actions).includes(action);
  const actionExistsAboveState = Object.keys(states.actions).includes(action);
  if (actionExistsInState) {
    state.actions[action](payload);
  } else if (actionExistsAboveState) {
    states.actions[action](payload);
  }

  const transitionExistsInState = Object.keys(state.on).includes(action);
  if (transitionExistsInState) {
    transition(state.on[action]);
  }
}

function handleKeyPress(key) {
  const input = Array.from(inputNodes).find(inputNode => inputNode.dataset.key === key);
  console.log("keypress...", key, input)
  call(input.dataset.message, input.dataset.value);
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
    console.warn(output, states.current);
    states.current.number = output;
    states.current.calculationType = states.current.calculationTypeNext
    console.warn(output, states.current)
    return;
  }

  const newOutput = states.current.calculationType(Number(output), Number(states.current.number));
  const newOuputOneDecimal = newOutput.toFixed(1);
  states.current.number = +newOuputOneDecimal;
  outputNode.textContent = newOuputOneDecimal;

  states.current.calculationType = states.current.calculationTypeNext
}

function reset() {
  clearOutput();
  states.current.number = null;
  states.current.calculationType = null;
  states.current.calculationTypeNext = null;
}

function clearOutput() {
  outputNode.textContent = "";
}
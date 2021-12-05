const outputNode = document.querySelector(".output");
const inputNodes = document.querySelectorAll("button");

document.addEventListener('keydown', (e) => handleKeyEvent(e.key));
inputNodes.forEach(inputNode => {
  inputNode.addEventListener('click', () => handleClick(inputNode.dataset));
});

let states = {
  "initial": {
    name: "number",
    prevNumber: "",
    prevCalculationFormula: null,
    number: "0",
    calculationSymbol: "",
  },
  actions: {
    clear: () => {
      states.initial.prevNumber = "";
      states.initial.prevCalculationFormula = null;
      states.initial.number = "0";
      states.initial.calculationSymbol = "";
      transition("number", "0");
    },
  },
  on: {},
  "number": {
    entry: (number) => { enterNumber(number) },
    actions: {
      toggleSign,
      deleteCharacter,
      enterDecimal,
    },
    on: {
      "enterNumber": "number",
      "enterDecimal": "decimal",
      "deleteCharacter": "number",
      "calculate": "calculation",
      "calculateFinal": "calculationFinal",
    },
  },
  "decimal": {
    actions: {
      toggleSign,
      deleteCharacter,
    },
    on: {
      "enterNumber": "decimalNumber",
      "deleteCharacter": "number",
    },
  },
  "decimalNumber": {
    entry: (number) => { enterNumber(number) },
    actions: {
      toggleSign,
      deleteCharacter,
    },
    on: {
      "deleteCharacter": "decimal",
      "calculate": "calculation",
      "calculateFinal": "calculationFinal",
    },
  },
  "calculation": {
    entry: (calculationType) => { calculate(calculationType) },
    actions: {
      enterDecimal,
    },
    on: {
      "enterNumber": "number",
      "enterDecimal": "decimal",
      "calculateFinal": "calculationFinal",
    },
  },
  "calculationFinal": {
    entry: () => { calculateFinal() },
    actions: {
      enterDecimal,
    },
    on: {
      "calculate": "calculation",
    },
  },
};


function transition(state, payload) {
  console.log('transition to ', state, states.initial)

  const exitExistsInState = Object.keys(states[states.initial.name]).includes("exit");
  if (exitExistsInState) {
    states[states.initial.name].exit();
  }
  const entryExistsInState = Object.keys(states[state]).includes("entry");
  if (entryExistsInState) {
    states[state].entry(payload);
  }
  states.initial.name = state;

  document.querySelector("body").dataset.state = state;
}

function call(action, payload) {
  console.log("action...", action, payload, states);

  const state = states[states.initial.name];

  const actionExistsInState = Object.keys(state.actions).includes(action);
  const actionExistsAboveState = Object.keys(states.actions).includes(action);
  if (actionExistsInState) {
    state.actions[action](payload);
  } else if (actionExistsAboveState) {
    states.actions[action](payload);
  }

  const transitionExistsInState = Object.keys(state.on).includes(action);
  const transitionExistsAboveState = Object.keys(states.on).includes(action);
  if (transitionExistsInState) {
    transition(state.on[action], payload);
  } else if (transitionExistsAboveState) {
    transition(states.on[action], payload);
  }

  printOutput();
}

function handleKeyEvent(key) {
  const input = Array.from(inputNodes).find(inputNode => inputNode.dataset.key === key);
  if (input) call(input.dataset.message, input.dataset.value);
}

function handleClick({ message, value }) {
  call(message, value);
}

function printOutput() {
  const { prevNumber, calculationSymbol, number } = states.initial;

  const outputPrevNumber = prevNumber || "";
  const outputCalculationSymbol = calculationSymbol || "";
  const outputNumber = number || "0";

  const isDecimalPrevNumber = outputPrevNumber.includes(".");
  const isDecimalNumber = outputNumber.includes(".");
  const outputPrevNumberRounded = isDecimalPrevNumber ? (+outputPrevNumber).toFixed(1) : outputPrevNumber;
  const outputNumberRounded = isDecimalNumber ? (+outputNumber).toFixed(1) : outputNumber;

  outputNode.textContent = `${outputPrevNumberRounded} ${outputCalculationSymbol} ${outputNumberRounded}`;
}

function enterNumber(number) {
  if (states.initial.number === "0") {
    states.initial.number = number;
  } else {
    states.initial.number += number;
  }
}

function toggleSign() {
  const number = states.initial.number
  if (number === "" || number === "0") return;

  states.initial.number = number[0] === "-" ? number.slice(1) : "-" + number;
}

function enterDecimal() {
  states.initial.number += ".";
}

function deleteCharacter() {
  const number = states.initial.number

  // Delete minus sign with last number: -3 -> 0
  if (number[0] === "-" && number.length === 2) {
    states.initial.number = "";
    return;
  }

  states.initial.number = number.substr(0, number.length - 1);
}

const formula = {
  add: {
    func: (a, b) => a + b,
    symbol: "+"
  },
  substract: {
    func: (a, b) => a - b,
    symbol: "-"
  },
  multiply: {
    func: (a, b) => a * b,
    symbol: "*"
  },
  divide: {
    func: (a, b) => a / b,
    symbol: "/"
  },
};

function calculate(calculationType) {

  const { prevNumber, number, prevCalculationFormula, calculationSymbol } = states.initial

  if (prevCalculationFormula) {
    states.initial.prevNumber = String(prevCalculationFormula(+prevNumber, +number));
    states.initial.number = "0";
    states.initial.prevCalculationFormula = formula[calculationType].func;
    states.initial.calculationSymbol = formula[calculationType].symbol;
  } else {
    states.initial.prevNumber = number;
    states.initial.number = "0";
    states.initial.prevCalculationFormula = formula[calculationType].func;
    states.initial.calculationSymbol = formula[calculationType].symbol;
  }
}

function calculateFinal() {
  const { prevNumber, number, prevCalculationFormula, calculationSymbol } = states.initial
  if (prevCalculationFormula) {
    states.initial.prevNumber = "";
    states.initial.number = String(prevCalculationFormula(+prevNumber, +number));
    states.initial.prevCalculationFormula = null;
    states.initial.calculationSymbol = "";
  }
}
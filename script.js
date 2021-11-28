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
})
const inputNodesByType = {
  number: getNodesByType(inputNodes, "number"),
  decimal: getNodesByType(inputNodes, "decimal"),
  sign: getNodesByType(inputNodes, "sign"),
  action: getNodesByType(inputNodes, "action"),
  clear: getNodesByType(inputNodes, "clear"),
  equal: getNodesByType(inputNodes, "equal"),
}


let states = {
  "current": {
    name: "idle",
    firstNumber: "",
    action: null,
  },
  "idle": () => {
    state = "idle"
    document.title = state;
    clearOutput();
    enableButtonByType("number");
    enableButtonByType("decimal");
    enableButtonByType("sign");
    disableButtonByType("action");
    disableButtonByType("equal");
    disableButtonByType("clear");
  },
  "number": () => {
    state = "number"
    document.title = state;
    enableButtonByType("number");
    enableButtonByType("decimal");
    enableButtonByType("sign");
    enableButtonByType("action");
    enableButtonByType("equal");
    enableButtonByType("clear");
  },
  "decimal": () => {
    state = "decimal"
    document.title = state;
    enableButtonByType("number");
    disableButtonByType("decimal");
    enableButtonByType("sign");
    enableButtonByType("action");
    enableButtonByType("equal");
    enableButtonByType("clear");
  },
  "action": () => {
    states.idle()
  }
}
let state = "";
states.idle();
let summand = "";

function handleClick({ type, value }) {
  let output = outputNode.textContent;
  switch (type) {
    case "number":
      if (output.match("\.")) {
        states.decimal();
      } else {
        states.number()
      }
      output += value;
      break;
    case "sign":
      if (output[0] === "+") {
        output = "-" + output.slice(1)
      } else if (output[0] === "-") {
        output = "+" + output.slice(1)
      } else {
        output = "-" + output
      }
      break;
    case "decimal": {
      states.decimal();
      output += ".";
      break;
    }
    case "clear": {
      states.idle();
      output = "";
      break;
    }
    case "action": {
      states.idle();
      // console.log(output, type, value)
      if (summand === "") {
        console.log("saving summand...")
        summand = output;
        output = "";
      } else {
        console.log("calculating...", summand, output)
        output = Number(summand) + Number(output);
        summand = "";
      }
      break;
    }
    case "equal": {
      output = Number(summand) + Number(output);
      break;
    }
  }
  outputNode.textContent = output
}

function clearOutput() {
  console.log("clearing...", outputNode.textContent)
  return outputNode.textContent = "";
}

function enableNumbers() {
  Array.from(inputNodesByType.number).forEach(numberNode => enableButton(numberNode))
}

function getNodesByType(nodes, type) {
  return Array.from(nodes).filter(node => node.dataset.type === type);
}

function disableButtonByType(type) {
  Array.from(inputNodesByType[type]).forEach(node => disableButton(node))
}

function enableButtonByType(type) {
  Array.from(inputNodesByType[type]).forEach(node => enableButton(node))
}

function enableButton(node) {
  node.disabled = false;
}

function disableButton(node) {
  node.disabled = true;
}
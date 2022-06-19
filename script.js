const display = document.querySelector(".display p");
const digit1 = document.querySelector(".digit1");
const digit2 = document.querySelector(".digit2");
const digit3 = document.querySelector(".digit3");
const digit4 = document.querySelector(".digit4");
const digit5 = document.querySelector(".digit5");
const digit6 = document.querySelector(".digit6");
const digit7 = document.querySelector(".digit7");
const digit8 = document.querySelector(".digit8");
const digit9 = document.querySelector(".digit9");
const digit0 = document.querySelector(".digit0");
const buttonAdd = document.querySelector(".buttonAdd");
const buttonSubtract = document.querySelector(".buttonSubtract");
const buttonMultiply = document.querySelector(".buttonMultiply");
const buttonDivide = document.querySelector(".buttonDivide");
const buttonClear = document.querySelector(".buttonClear");
const buttonEquals = document.querySelector(".buttonEquals");

let displayValue = "";

// Digits
digit1.addEventListener("click", () => {
    displayValue += "1";
    display.innerHTML = displayValue;
});
digit2.addEventListener("click", () => {
    displayValue += "2";
    display.innerHTML = displayValue;
});
digit3.addEventListener("click", () => {
    displayValue += "3";
    display.innerHTML = displayValue;
});
digit4.addEventListener("click", () => {
    displayValue += "4";
    display.innerHTML = displayValue;
});
digit5.addEventListener("click", () => {
    displayValue += "5";
    display.innerHTML = displayValue;
});
digit6.addEventListener("click", () => {
    displayValue += "6";
    display.innerHTML = displayValue;
});
digit7.addEventListener("click", () => {
    displayValue += "7";
    display.innerHTML = displayValue;
});
digit8.addEventListener("click", () => {
    displayValue += "8";
    display.innerHTML = displayValue;
});
digit9.addEventListener("click", () => {
    displayValue += "9";
    display.innerHTML = displayValue;
});
digit0.addEventListener("click", () => {
    displayValue += "0";
    display.innerHTML = displayValue;
});

// Operators
buttonAdd.addEventListener("click", () => {
    displayValue += "+";
    display.innerHTML = displayValue;
});
buttonSubtract.addEventListener("click", () => {
    displayValue += "-";
    display.innerHTML = displayValue;
});
buttonMultiply.addEventListener("click", () => {
    displayValue += "x";
    display.innerHTML = displayValue;
});
buttonDivide.addEventListener("click", () => {
    displayValue += "/";
    display.innerHTML = displayValue;
});

buttonClear.addEventListener("click", () => {
    displayValue = "";
    display.innerHTML = displayValue;
});
buttonEquals.addEventListener("click", () => {
    displayValue = operate(displayValue);
    display.innerHTML = displayValue;
});

// Functions
function splitArray(inputArray, op) {
    let operatorCount = inputArray.reduce((total, a) => {
        if (a === op) {
            total++;
            return total;
        }
        return total;
    }, 0);

    let sections = 1;
    let opLocations = {};
    for (let i = 0; i < operatorCount; i++) {
        opLocations[`section${i + 1}`] = indexFinder(inputArray, op);
        inputArray.splice(opLocations[`section${i + 1}`], 1);
        sections++;
    }

    let sectionsDetails = [];
    for (let i = 1; i < sections + 1; i++) {
        // First, Last, then inbetween
        if (i === 1) {
            sectionsDetails[i - 1] = inputArray.slice(0, opLocations["section1"]);
        } else if (i === sections) {
            sectionsDetails[i - 1] = inputArray.slice(opLocations[`section${i - 1}`]);
        } else {
            sectionsDetails[i - 1] = inputArray.slice(opLocations[`section${i - 1}`], opLocations[`section${i}`]);
        }
    }

    return sectionsDetails;
}

function indexFinder(inputArray, operator) {
    let opIndex = inputArray.findIndex((a) => {
        if (a === operator) {
            return true;
        }
    });
    return opIndex;
}

// Works like a tree, solves the end of each branch first (multiplication), then moves to the base (addition)
function addSection(array) {
    let addRemove = splitArray(array, "+");
    addRemove = addRemove.map((array) => {
        return subtractSection(array);
    });
    addRemove = addRemove.reduce((total, current) => {
        return total + current;
    }, 0);
    return addRemove;
}

function subtractSection(array) {
    let subtractRemove = splitArray(array, "-");
    subtractRemove = subtractRemove.map((array) => {
        return divideSection(array);
    });
    subtractRemove = subtractRemove.reduce((total, current) => {
        if (total === null) {
            return current;
        } else {
            return total - current; 
        }
    }, null);
    return subtractRemove;
}

function divideSection(array) {
    let divideRemove = splitArray(array, "/");
    divideRemove = divideRemove.map((array) => {
        return multiplySection(array);
    });
    divideRemove = divideRemove.reduce((total, current) => {
        if (total === 0) {
            return current;
        } else if (current === 0) {
            return NaN;
        } else {
            return total / current;
        }
    }, 0);
    return divideRemove;
}

function multiplySection(array) {
    let multiplyRemove = splitArray(array, "x");
    multiplyRemove = multiplyRemove.map((array) => {
        return array.join("");
    });
    multiplyRemove = multiplyRemove.reduce((total, current) => {
        return total * current;
    }, 1);
    return multiplyRemove;
}

function operate(displayValue) {
    let displayValueArray = displayValue.split("");
    displayValueArray.unshift("0");
    let calculated = addSection(displayValueArray);
    if (!calculated && calculated !== 0) {
        return "You broke it.";
    }
    return (Math.round(calculated * 1000))/1000;
}
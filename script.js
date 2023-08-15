const inputs = document.querySelector(".input-container");

const equationInput = document.querySelector(".equationInput");
const resultDisplay = document.querySelector(".result");

let disableButtons = false;

let buttons = ["AC", "C","%", "÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "="];

let keyPresses = ["*","c","%", "/", "7", "8", "9", "+", "4", "5", "6", "-", "1", "2", "3", "x", "0", ".", "=", "backspace", "enter"];


let operators = ["%", "÷", "-", "+", "×"];


let count = 0;
buttons.forEach(btn => {
	let newButton = document.createElement('div');
	newButton.classList.add("button");
	switch (btn) {
		case "%":
		case "÷":
		case "×":
		case "-":
		case "+":
			newButton.classList.add("operators");
			break;

		case "AC":
		case "C":
			newButton.classList.add("clearBtns");
			break;
		case "=":
			newButton.classList.add("equals");
			break;
		default:
			newButton.classList.add("numAndDecimal");
			break;
	}
	newButton.textContent = btn;
	if(btn === "="){
		count+=1;
		newButton.style.width = "auto";
		newButton.style.gridColumn = '3 / 5';
		newButton.style.borderRadius = '2.5rem';
	}
	inputs.appendChild(newButton);
});

const buttonPress = document.querySelectorAll(".button");

buttonPress.forEach(button => {
	button.addEventListener('click', () => {
		if(disableButtons && button.textContent=="AC" || disableButtons && button.textContent=="C"){
			disableButtons = false;
			updateDisplayedEquation("AC");
		}else if (!disableButtons){
			updateDisplayedEquation(button.textContent);
		}
	});
	
});

document.addEventListener('keyup', (key) => {
	let keyVal = key.key.toLowerCase();
	if(keyPresses.includes(keyVal)){
		if(disableButtons && keyVal == "c" || disableButtons && keyVal == "backspace"){
			disableButtons = false;
			updateDisplayedEquation("AC");
		}else if(!disableButtons){
			switch (keyVal) {
				case "backspace":
					updateDisplayedEquation("C");
					break;
				case "enter":
					updateDisplayedEquation("=");
					break;
				case "*":
					updateDisplayedEquation("×");
					break;
				case "x":
					updateDisplayedEquation("×");
					break;
				case "/":
					updateDisplayedEquation("÷");
					break;
				default:
					updateDisplayedEquation(keyVal);
					break;
			}
		}
	}
});

function updateDisplayedEquation(text) {
	if (text == "AC") {
		equationInput.textContent= "0";
		resultDisplay.textContent= " ";
	}else if (text == "C"){
		if(equationInput.textContent.length>0){
			equationInput.textContent = equationInput.textContent.substring(0,equationInput.textContent.length-1);
		}
		if(equationInput.textContent.length==0){
			resultDisplay.textContent = " ";
		}
	}else if(text == "="){
		let numArr = equationInput.textContent.split(/[%,÷+\-×]/);
		if(equationInput.textContent.substring(0,1) == "-"){
			numArr[0]= "0";
		}
		resultDisplay.textContent=findResult(numArr, equationInput.textContent.split(/[0-9.]+/).filter(Boolean));
		disableButtons = true;
	}else if(text == "."){
		let eqNum = equationInput.textContent.split(/[%,÷+\-×]/);
		if(!eqNum[eqNum.length-1].includes(".")){
			equationInput.textContent+=text;
		}
	}else if(operators.includes(text)){
		if(!operators.includes(equationInput.textContent.substring(equationInput.textContent.length-1,equationInput.textContent.length))){
			equationInput.textContent+=text;
		}
	}

	else{
		if(equationInput.textContent == "0"){
			equationInput.textContent=text;
		}else{
			equationInput.textContent+=text;
		}
	}
}


function findResult(eqNum, eqOp){
	
	if(eqNum.length == 1){
		return eqNum[0];
	}

	if(eqOp.includes("×") || eqOp.includes("÷") || eqOp.includes("%")){
		for (let i = 0; i < eqOp.length; i++) {
			console.log(eqOp);
			console.log(eqNum);
			let newNum = 0;

			switch (eqOp[i]) {
				case "×":
					newNum = parseFloat(eqNum[i])*parseFloat(eqNum[i+1]);
					console.log(parseFloat(eqNum[i])+ " multiply "+ parseFloat(eqNum[i+1]));
					eqOp.splice(i, 1);
					eqNum.splice(i,2);
					eqNum.splice(i, 0, newNum.toString());
					i--;
					break;
				case "÷":
					newNum = parseFloat(eqNum[i])/parseFloat(eqNum[i+1]);
					console.log(parseFloat(eqNum[i])+ " divide "+ parseFloat(eqNum[i+1]));
					eqOp.splice(i, 1);
					eqNum.splice(i,2);
					eqNum.splice(i, 0, newNum.toString());
					i--;
					break;
				case "%":
					newNum = parseFloat(eqNum[i])%parseFloat(eqNum[i+1]);
					console.log(parseFloat(eqNum[i])+ " remainder "+ parseFloat(eqNum[i+1]));
					eqOp.splice(i, 1);
					eqNum.splice(i,2);
					eqNum.splice(i, 0, newNum.toString());
					i--;
					break;
				default:
					break;
			}
			console.log("new num: "+ newNum);
			
		}
		return findResult(eqNum,eqOp);
	}else{
		console.log(eqOp);
		console.log(eqNum);
		let newNum = 0;
		if(eqOp[0] == "+"){
			newNum = parseFloat(eqNum[0])+parseFloat(eqNum[1]);
			console.log(parseFloat(eqNum[0])+ " sum "+ parseFloat(eqNum[1]));
			console.log("new num: "+ newNum);
		}else{
			newNum = parseFloat(eqNum[0])-parseFloat(eqNum[1]);
			console.log(parseFloat(eqNum[0])+ " subtract "+ parseFloat(eqNum[1]));
			console.log("new num: "+ newNum);
		}
		eqOp.splice(0, 1);
		eqNum.splice(0,2);
		eqNum.splice(0, 0, newNum.toString());
		return findResult(eqNum,eqOp);
	}
}

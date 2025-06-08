window.addEventListener('load', () => {

	const numDiceInput = document.getElementById('num-dice-input');
	const dieTypeInput = document.getElementById('die-type-input');
	const modeInput = document.getElementById('mode-input');
	const rollButton = document.getElementById('roll');
	const resetButton = document.getElementById('reset');

	const diceArea = document.getElementById('dice-area');
	const resultArea = document.getElementById('result-area');
	const singleTotalArea = document.getElementById('single-total-area');
	const total = document.getElementById('total');
	const doubleTotalArea = document.getElementById('double-total-area');
	const leftTotal = document.getElementById('left-total');
	const divider = document.getElementById('divider');
	const rightTotal = document.getElementById('right-total');

	for (let i=1; i <=100; i++) {
		numDiceInput.innerHTML += `<option value=${i}>${i}</option>`;
	}
	
	let dice = {
		d20: { 
			value: 20, 
			label: 'D20', 
			image: 'https://drive.google.com/thumbnail?size=400&id=1Cdv19qd-HBZSnrfe2hkunU3bsPZ7VPht',
		},
		d12: { 
			value: 12, 
			label: 'D12', 
			image: 'https://drive.google.com/thumbnail?size=400&id=1gRMfOlt98M5dmc-Ex5enZRFy7Bkkr9ta',
		},
		d10: { 
			value: 10, 
			label: 'D10', 
			image: 'https://drive.google.com/thumbnail?size=400&id=1iwbOiPeNMREcQswWeLZ-dDJXzoaozVum',
		},
		d8: { 
			value: 8, 
			label: 'D8', 
			image: 'https://drive.google.com/thumbnail?size=400&id=1LrjniIM1RG4u8as6hT5Pa-nS_1z0Bt5z',
		},
		d6: { 
			value: 6, 
			label: 'D6', 
			image: 'https://drive.google.com/thumbnail?size=400&id=1KABrJFwctJG8JlLhL8ZXYIjj4-a2Gd64',
		},
		d4: { 
			value: 4, 
			label: 'D4', 
			image: 'https://drive.google.com/thumbnail?size=400&id=1TywBsbvDZ8IMiz_7UNQJJS88FTd2kDTN',
		},
	};

	for (die in dice) {
		dieTypeInput.innerHTML += `<option value=${dice[die].value}>${dice[die].label}</option>`;
		diceArea.innerHTML += `<img id="${die}" src='${dice[die].image}' height='80px' alt="${dice[die].label} die" />`;
	}

	const d20 = document.getElementById('d20');
	const d12 = document.getElementById('d12');
	const d10 = document.getElementById('d10');
	const d8 = document.getElementById('d8');
	const d6 = document.getElementById('d6');
	const d4 = document.getElementById('d4');

  dice['d20'].obj = d20;
  dice['d12'].obj = d12;
  dice['d10'].obj = d10;
  dice['d8'].obj = d8;
  dice['d6'].obj = d6;
  dice['d4'].obj = d4;

	rollButton.addEventListener('click', event => {
		event.preventDefault();
		spinDie(dice[`d${dieTypeInput.value}`].obj);
		if (modeInput.value === 'normal') {
			total.style.opacity = 0;
			setTimeout(() => {
				total.innerHTML = getTotalValue(dieTypeInput.value, numDiceInput.value);
				total.style.opacity = 1;						
			}, 600);
		} else {
			leftTotal.style.opacity = 0;
			divider.style.opacity = 0;
			rightTotal.style.opacity = 0;
			setTimeout(() => {
				let leftValue = getTotalValue(dieTypeInput.value, numDiceInput.value);
				let rightValue = getTotalValue(dieTypeInput.value, numDiceInput.value);
				leftTotal.innerHTML = leftValue;
				rightTotal.innerHTML = rightValue;
				divider.style.opacity = 0.5;
				if (modeInput.value === 'advantage') {
					if (leftTotal.innerHTML == Math.max(...[leftValue, rightValue])) {
						leftTotal.style.opacity = 1;
						rightTotal.style.opacity = 0.2;
					} else {
						leftTotal.style.opacity = 0.2;
						rightTotal.style.opacity = 1;
					}
				} else {
					if (leftTotal.innerHTML == Math.min(...[leftValue, rightValue])) {
						leftTotal.style.opacity = 1;
						rightTotal.style.opacity = 0.2;
					} else {
						leftTotal.style.opacity = 0.2;
						rightTotal.style.opacity = 1;
					}					
				}			
			}, 600);
		}
	});

	resetButton.addEventListener('click', event => {
		event.preventDefault();
		numDiceInput.value = 1;
		dieTypeInput.value = 20;
		modeInput.value = 'normal';
		changeDie(`d20`);
		resultArea.style.fontSize = getFontSize(1, 20, true);
    resetTotals();
		singleTotalArea.style.display = 'block';
		doubleTotalArea.style.display = 'none';
	});
	
	document.addEventListener('input', (event) => {
		event.preventDefault();
		resetTotals();
		let numDice = numDiceInput.value;
		let dieType = dieTypeInput.value;
		if (event.target === dieTypeInput) {
			changeDie(`d${dieType}`);
		}
		resultArea.style.fontSize = getFontSize(numDice, dieType, modeInput.value === 'normal');
		singleTotalArea.style.display = modeInput.value === 'normal' ? 'block' : 'none';
		doubleTotalArea.style.display = modeInput.value === 'normal' ? 'none' : 'block';
	});
	
	function resetTotals() {
		total.innerHTML = 0;
		total.style.opacity = 0.2;
		leftTotal.innerHTML = 0;
		leftTotal.style.opacity = 0.2;
		rightTotal.innerHTML = 0;
		rightTotal.style.opacity = 0.2;
	}

	function spinDie(die) {
		die.style.animation = 'spin 1s ease-out';
		let spin = die.getAnimations()[0];
		spin.finish();
		spin.play();
		die.style.animation = "none";
	}

	function changeDie(dieType) {
		for (die in dice) {
			dice[die].obj.style.display = die === dieType ? 'block' : 'none';
		}
	}
});

function getFontSize(numDice, dieType, isNormal) {
	let max = numDice * dieType;
	if (isNormal || max < 10) {
		return '60px';  
	} else if (max < 200) {
		return '42px';
	} else if (max < 1000) {
		return '32px';
	} 
	return '24px';
}

function getRandomNum(max) {
	return Math.ceil(Math.random() * max);
}

function getTotalValue(max, numDice) {
	let total = 0;
	for (let i=1; i <= numDice; i++) {
		total += getRandomNum(max);
	}
	return total;
}

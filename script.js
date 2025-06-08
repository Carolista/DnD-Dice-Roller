import dice from './dice.js';
import { getTotalValue, getFontSize } from './helpers.js';

window.addEventListener('load', () => {

    // Form Inputs
	const numDiceInput = document.getElementById('num-dice-input');
	const dieTypeInput = document.getElementById('die-type-input');
	const modeInput = document.getElementById('mode-input');
	const rollButton = document.getElementById('roll');
	const resetButton = document.getElementById('reset');

    // Containers & Wrappers
	const diceArea = document.getElementById('dice-area');
	const resultArea = document.getElementById('result-area');
	const singleTotalArea = document.getElementById('single-total-area');
	const total = document.getElementById('total');
	const doubleTotalArea = document.getElementById('double-total-area');
	const leftTotal = document.getElementById('left-total');
	const divider = document.getElementById('divider');
	const rightTotal = document.getElementById('right-total');

    // Add options to number of dice dropdown menu
	for (let i = 1; i <= 100; i++) {
		numDiceInput.innerHTML += `<option value=${i}>${i}</option>`;
	}

    // Add options to die type dropdown menu and place images for each die type
	for (let die in dice) {
		dieTypeInput.innerHTML += `<option value=${dice[die].value}>${dice[die].label}</option>`;
		diceArea.innerHTML += `<img id="${die}" src='${dice[die].image}' height='80px' alt="${dice[die].label} die" />`;
	}

    // Add references to each img element to imported dice object
	dice['d20'].obj = document.getElementById('d20');
	dice['d12'].obj = document.getElementById('d12');
	dice['d10'].obj = document.getElementById('d10');
	dice['d8'].obj = document.getElementById('d8');
	dice['d6'].obj = document.getElementById('d6');
	dice['d4'].obj = document.getElementById('d4');

    // Set initial values of inputs and update image to match
	numDiceInput.value = Number(localStorage.getItem('numDice')) || 1;
	dieTypeInput.value = Number(localStorage.getItem('dieType')) || 20;
	modeInput.value = localStorage.getItem('mode') || 'normal';

	changeDieImage(`d${dieTypeInput.value}`);

    // Handle updates for any dropdown change
    document.addEventListener('input', event => {
        event.preventDefault();
        resetTotals();
        let numDice = numDiceInput.value;
        let dieType = dieTypeInput.value;
        let mode = modeInput.value;
        localStorage.setItem('numDice', numDice);
        localStorage.setItem('dieType', dieType);
        localStorage.setItem('mode', mode);
        if (event.target === dieTypeInput) {
            changeDieImage(`d${dieType}`);
        }
        resultArea.style.fontSize = getFontSize(
            numDice,
            dieType,
            modeInput.value === 'normal'
        );
        singleTotalArea.style.display =
            modeInput.value === 'normal' ? 'block' : 'none';
        doubleTotalArea.style.display =
            modeInput.value === 'normal' ? 'none' : 'block';

    });

    // Handle click on ROLL button
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
					if (leftTotal.innerHTML == Math.max(leftValue, rightValue)) {
						leftTotal.style.opacity = 1;
						rightTotal.style.opacity = 0.2;
					} else {
						leftTotal.style.opacity = 0.2;
						rightTotal.style.opacity = 1;
					}
				} else {
					if (leftTotal.innerHTML == Math.min(leftValue, rightValue)) {
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

    // Handle click on RESET button
	resetButton.addEventListener('click', event => {
		event.preventDefault();
        resetInputs();
		resetTotals();
        resetDisplay();
        changeDieImage('d20');
	});

    function resetInputs() {
        numDiceInput.value = 1;
        dieTypeInput.value = 20;
        modeInput.value = 'normal';
        localStorage.setItem('numDice', 1);
        localStorage.setItem('dieType', 20);
        localStorage.setItem('mode', 'normal');
    }

	function resetTotals() {
		total.innerHTML = 0;
		total.style.opacity = 0.2;
		leftTotal.innerHTML = 0;
		leftTotal.style.opacity = 0.2;
		rightTotal.innerHTML = 0;
		rightTotal.style.opacity = 0.2;
        resultArea.style.fontSize = getFontSize(1, 20, true);
        singleTotalArea.style.display = 'block';
        doubleTotalArea.style.display = 'none';
	}

    // Switch visible image to match current die type
	function changeDieImage(dieType) {
		for (let die in dice) {
			dice[die].obj.style.display = die === dieType ? 'block' : 'none';
		}
	}

    // Handle animation of die image when roll button is clicked
	function spinDie(die) {
		die.style.animation = 'spin 1s ease-out';
		let spin = die.getAnimations()[0];
		spin.finish();
		spin.play();
		die.style.animation = 'none';
	}

});


export function getRandomNum(max) {
    return Math.ceil(Math.random() * max);
}

export function getTotalValue(max, numDice) {
    let total = 0;
	for (let i = 1; i <= numDice; i++) {
        total += getRandomNum(max);
	}
	return total;
}

export function getFontSize(numDice, dieType, isNormal) {
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

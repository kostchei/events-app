// levelGen.js

// Method 1: Random level between 1 and 20
export function randomLevel() {
    return Math.floor(Math.random() * 20) + 1;
}

// Method 2: Level based on probability distribution (stops at 8th level)
export function probabilisticLevel() {
    const levels = [1, 2, 3, 4, 5, 6, 7, 8];
    const probabilities = [0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625, 0.0078125, 0.00390625];

    let random = Math.random();
    let cumulativeProbability = 0;

    for (let i = 0; i < levels.length; i++) {
        cumulativeProbability += probabilities[i];
        if (random < cumulativeProbability) {
            return levels[i];
        }
    }

    return 1; // Fallback to level 1
}

// Method 3: Level based on 2d4 + 1d6 + 2 (range: 5-16)
export function diceLevel() {
    const roll2d4 = () => Math.floor(Math.random() * 4) + 1 + Math.floor(Math.random() * 4) + 1;
    const roll1d6 = () => Math.floor(Math.random() * 6) + 1;

    return roll2d4() + roll1d6() + 2;
}
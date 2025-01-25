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

// Method 3: Level based on 2d4 + 1d6 + 2 (range: 5–16)
export function diceLevel() {
    const roll2d4 = () => Math.floor(Math.random() * 4) + 1 + Math.floor(Math.random() * 4) + 1;
    const roll1d6 = () => Math.floor(Math.random() * 6) + 1;

    return roll2d4() + roll1d6() + 2;
}

// Method 4: Level based on party level
export function levelBasedOnParty(partyLevel) {
    if (partyLevel >= 14) return 20;

    const levelMapping = {
        1: 4, 2: 5, 3: 6, 4: 8, 5: 9, 6: 10, 7: 12,
        8: 13, 9: 14, 10: 15, 11: 17, 12: 18, 13: 19, 14: 21,
    };

    return levelMapping[partyLevel] || 1;
}

// Main generator function for NPC level
export function generateNpcLevel(npcType, partyLevel) {
    const roll = Math.random() * 100;

    if (npcType === "bastionLeaders") {
        if (roll < 80) {
            return diceLevel(); // 80% use diceLevel
        } else if (roll < 90) {
            return levelBasedOnParty(partyLevel); // 10% use party-based levels
        } else {
            return randomLevel(); // 10% are random
        }
    } else if (npcType === "questGiversFriendly") {
        if (roll < 80) {
            return probabilisticLevel(); // 80% use probabilisticLevel
        } else if (roll < 90) {
            return randomLevel(); // 10% are random
        } else {
            return levelBasedOnParty(partyLevel); // 10% use party-based levels
        }
    } else if (npcType === "enemiesEncounters") {
        if (roll < 90) {
            return levelBasedOnParty(partyLevel); // 90% use party-based levels
        } else {
            return randomLevel(); // 10% are random
        }
    }

    return 1; // Default fallback
}

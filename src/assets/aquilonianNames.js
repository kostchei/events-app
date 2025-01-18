// aquilonianNames.js

// Example Arthurian style syllable sets — these are *completely made up* for demonstration.
// Feel free to refine them based on research or your own preference.
const nm1 = ["ar", "ca", "mer", "mor", "gor", "per", "el", "lan", "vi", "ig", "ka"]; 
const nm2 = ["", "", "bel", "cal", "car", "gwy", "mer", "mor", "pen", "tar", "uth"];
const nm3 = ["gon", "loc", "lon", "din", "der", "lan", "thur", "gaw", "vyr", "rod", "wyn"];
const nm4 = ["s", "th", "n", "r", "m", "l", "d", "h"];

// Slightly different arrays for female names
const nm5 = ["", "", "morg", "gua", "anna", "hel", "is", "ela", "vio", "gly"];
const nm6 = ["a", "e", "i", "o", "y", "ia", "io", "ora", "ella"];
const nm7 = ["wen", "lin", "gause", "vyr", "min", "sir", "lott", "lyn", "nette", "thea"];
const nm8 = ["", "", "n", "th", "l", "s", "ll", "m", "d"];

/**
 * Generates a random Arthurian-style name.
 * 
 * @param {"male"|"female"} type - Which type of name to generate.
 * @returns {string} The generated name (with the first letter capitalized).
 */
function generateName(type) {
    let nMs = "";
    
    // Male Name Generation
    function nameMas() {
        const rnd  = Math.floor(Math.random() * nm2.length);
        const rnd2 = Math.floor(Math.random() * nm1.length);
        const rnd3 = Math.floor(Math.random() * nm4.length);
        let rnd4   = Math.floor(Math.random() * nm1.length);
        const rnd5 = Math.floor(Math.random() * nm3.length);
        let rnd6   = Math.floor(Math.random() * nm1.length);
        const rnd7 = Math.floor(Math.random() * nm3.length);

        // Example logic: ensure some of our random picks skip the first items 
        // if we want to avoid too many leading vowels or empty strings, etc.
        if (rnd < 3) {
            while (rnd4 < 3) {
                rnd4 = Math.floor(Math.random() * nm1.length);
            }
        }
        if (rnd < 3 || rnd4 < 3) {
            while (rnd6 < 3) {
                rnd6 = Math.floor(Math.random() * nm1.length);
            }
        }

        // Build the name by concatenating syllables
        nMs = nm2[rnd] + nm1[rnd2] + nm3[rnd5] + nm1[rnd4] + nm3[rnd7] + nm1[rnd6] + nm4[rnd3];
    }

    // Female Name Generation
    function nameFem() {
        let rnd   = Math.floor(Math.random() * nm5.length);
        const rnd2 = Math.floor(Math.random() * nm6.length);
        let rnd3   = Math.floor(Math.random() * nm8.length);
        let rnd4   = Math.floor(Math.random() * nm6.length);
        const rnd5 = Math.floor(Math.random() * nm7.length);
        let rnd6   = Math.floor(Math.random() * nm6.length);
        const rnd7 = Math.floor(Math.random() * nm7.length);

        // Make sure some indices skip certain items if we want to reduce duplicates
        if (rnd < 2) {
            while (rnd < 2) {
                rnd = Math.floor(Math.random() * nm5.length);
            }
        }
        if (rnd2 < 2) {
            while (rnd4 < 2) {
                rnd4 = Math.floor(Math.random() * nm6.length);
            }
        }
        if (rnd2 < 2 || rnd4 < 2) {
            while (rnd6 < 2) {
                rnd6 = Math.floor(Math.random() * nm6.length);
            }
        }

        // Build the name by concatenating syllables
        nMs = nm5[rnd] + nm6[rnd2] + nm7[rnd5] + nm6[rnd4] + nm7[rnd7] + nm6[rnd6] + nm8[rnd3];
    }

    if (type === "male") {
        nameMas();
    } else if (type === "female") {
        nameFem();
    }

    // Capitalize the first letter of the name before returning it
    nMs = nMs.charAt(0).toUpperCase() + nMs.slice(1);
    return nMs;
}

export default generateName;

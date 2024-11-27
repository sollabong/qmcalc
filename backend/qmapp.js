class QuineMcCluskey {
    binaryMinterms;
    primeImplicants;
    essentialPrimeImplicants;
    groups;
    result;

    constructor(variables, minterms) {
        this.variables = variables; 
        this.minterms = minterms;   
        this.binaryMinterms = [];
        this.primeImplicants = [];
        this.essentialPrimeImplicants = [];
        this.groups = {};
        this.result = {};

    }

    minimize() {
        // mintermből binary
        this.binaryMinterms = this.convertMintermsToBinary();
        
        // minterm csoportosítás az 1-esek száma alapján
        this.groups = this.groupMintermsByOnes();
        
        // prím implikánsok keresése minterm csoportosítással, összevonással
        this.primeImplicants = this.findPrimeImplicants(this.groups);
        
        // prím implikáns tábla készítése
        this.createPrimeImplicantChart();

        //nélkülözhetetlen prím implikánsok keresése a prím implikáns tábla segítségével
        this.essentialPrimeImplicants = this.extractEssentialPrimeImplicants();
 
        // frontendnek küldött object összeállítása
        const result = {
            binaryTerms: this.binaryMinterms,
            primeImplicants: this.formatImplicants(this.primeImplicants),
            essentialPrimeImplicants: this.formatImplicants(this.essentialPrimeImplicants),
            minimizedExpression: this.formatMinimizedExpression(this.essentialPrimeImplicants),
        }
        
        return result;
    }

    convertMintermsToBinary() {
        const numVariables = this.variables.length;
        return this.minterms.map((minterm) =>
            minterm.toString(2).padStart(numVariables, '0')
        );
    }

    groupMintermsByOnes() {
        let groups = {};
        this.binaryMinterms.forEach((term) => {
            const countOnes = term.split('1').length - 1;
            if (!groups[countOnes]) {
                groups[countOnes] = [];
            }
            groups[countOnes].push(term);
        });
        return groups;
    }

    findPrimeImplicants() {
        let groups = this.groups;
        let primeImplicants = [];
        let isMerged = true;
    
        while (isMerged) {
            isMerged = false;
            let mergedGroups = [];
            let newGroups = {};  
            let mergedTerms = new Set();
    
            let keys = Object.keys(groups).map(Number);
    
            for (let i = 0; i < keys.length - 1; i++) {
                let group1 = groups[keys[i]];
                let group2 = groups[keys[i + 1]];
    
                let mergedGroup = [];
    
                // egymás alatti csoportok összevonása
                group1.forEach((term1) => {
                    group2.forEach((term2) => {
                        let mergedTerm = this.mergeTerms(term1, term2);
                        if (mergedTerm) {
                            mergedGroup.push(mergedTerm);
                            mergedTerms.add(term1);
                            mergedTerms.add(term2);
                            isMerged = true;
                        }
                    });
                });
    
                // ha van összevonás, tároljuk a következő oszlopba
                if (mergedGroup.length > 0) {
                    mergedGroups.push(mergedGroup);
                }
            }
    
            // prím implikánsokhoz adjuk, ha már nem összevonható
            for (let key of keys) {
                groups[key].forEach((term) => {
                    if (!mergedTerms.has(term) && !primeImplicants.includes(term)) {
                        primeImplicants.push(term);
                    }
                });
            }
    
            // Újracsoportosítás, ha voltak összevonások
            if (isMerged) {
                mergedGroups.forEach((group) => {
                    group.forEach((mergedTerm) => {
                        let onesCount = mergedTerm.toString(2).split('1').length - 1;
                        if (!newGroups[onesCount]) {
                            newGroups[onesCount] = [];
                        }
                        newGroups[onesCount].push(mergedTerm);
                    });
                });
    
                groups = newGroups;
            }
        }
        return primeImplicants;
    }

    mergeTerms(term1, term2) {
        let diffIndex = -1;
        for (let i = 0; i < term1.length; i++) {
            if (term1[i] !== term2[i]) {
                if (diffIndex !== -1) {
                    return null; // több, mint egy különbség, nincs összevonás
                }
                diffIndex = i;
            }
        }
        if (diffIndex === -1) return null;
        return term1.substring(0, diffIndex) + '-' + term1.substring(diffIndex + 1);
    }

    createPrimeImplicantChart() {
        let chart = [];
        this.primeImplicants.forEach((pi) => {
            let row = [];
            this.minterms.forEach((minterm) => {
                row.push(this.checkImplicant(pi, minterm));
            });
            chart.push(row);
        });
        this.primeImplicantChart = chart;
        return this.primeImplicantChart;
    }

    checkImplicant(primeImplicant, minterm) {
        const binaryMinterm = minterm.toString(2).padStart(this.variables.length, '0');
        for (let i = 0; i < primeImplicant.length; i++) {
            if (primeImplicant[i] !== '-' && primeImplicant[i] !== binaryMinterm[i]) {
                return false;
            }
        }
        return true;
    }

    extractEssentialPrimeImplicants() {
        let essentialPIs = [];
        let chart = this.primeImplicantChart;
        let remainingColumns = [...Array(chart[0].length).keys()];
        let remainingRows = [...Array(chart.length).keys()]; 
    
        while (remainingColumns.length > 0) {
            let foundEssential = false;
    
            /* 1. lépés: Azonosítsuk azokat az oszlopokat, amelyekben csak egy 'true' található, 
               és jelöljük meg a hozzá tartozó prím implikánst nélkülözhetetlenként. */
            for (let mintermIndex of remainingColumns) {
                let countX = 0;
                let essentialPIIndex = -1;
    
                // Minden sor esetében ellenőrizzük, hogy ebben az oszlopban csak egy 'true' szerepel-e
                for (let piIndex of remainingRows) {
                    if (chart[piIndex][mintermIndex] === true) {
                        countX++;
                        essentialPIIndex = piIndex;
                    }
                }
    
                // Ha ebben az oszlopban pontosan egy 'true' található, akkor a hozzá tartozó prím implikáns nélkülözhetetlen
                if (countX === 1) {
                    essentialPIs.push(this.primeImplicants[essentialPIIndex]);
    
                    // 2. lépés: Távolítsuk el a megfelelő sort és azokat az oszlopokat, amelyeket ez a prím implikáns lefed
                    remainingRows = remainingRows.filter((piIndex) => piIndex !== essentialPIIndex);
                    remainingColumns = remainingColumns.filter((colIndex) => chart[essentialPIIndex][colIndex] !== true);
                    foundEssential = true;
                    break;
                }
            }
    
            // 3. lépés: Ha már nem maradt oszlop, amiben csak 1 "true" van
            if (!foundEssential) {
                for (let piIndex of remainingRows) {
                    let coversAll = remainingColumns.every((colIndex) => chart[piIndex][colIndex] === true);
                    if (coversAll) {
                        essentialPIs.push(this.primeImplicants[piIndex]);
                        // Távolítsuk el ezt a sort és a hozzá tartozó fedett oszlopokat
                        remainingRows = remainingRows.filter((index) => index !== piIndex);
                        remainingColumns = remainingColumns.filter((colIndex) => chart[piIndex][colIndex] !== true);
                        break; // Amint találunk egy fedő sort, lépjünk ki a ciklusból
                    }
                }
            }
    
            // Ha nem maradt több oszlop, megállítjuk a loopot
            if (remainingRows.length === 0 || remainingColumns.length === 0) {
                break;
            }
        }
        return essentialPIs;
    }

    formatMinimizedExpression(primeImplicants) {
        return primeImplicants.map((pi) => {
            return pi.split('').map((bit, index) => {
                if (bit === '0') return this.variables[index] + '\u0305';
                if (bit === '1') return this.variables[index];
                return '';
            }).join('');
        }).join(' + ');
    }

    formatImplicants(implicants) {
        return implicants.map((pi) => {
            return pi.split('').map((bit, index) => {
                if (bit === '0') return this.variables[index] + '\u0305';
                if (bit === '1') return this.variables[index];
                return '';
            }).join('');
        });
    }

}

module.exports = QuineMcCluskey;
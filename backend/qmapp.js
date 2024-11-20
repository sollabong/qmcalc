class QuineMcCluskey {
    constructor(variables, minterms) {
        this.variables = variables; // Változó lista (pl ["A", "B", "C", "D"])
        this.minterms = minterms;   // minterm tömb (pl [0, 1, 5, 7, 10, 14])
        this.binaryMinterms = [];
        this.primeImplicants = [];
    }

    minimize() {
        // mintermből binary
        this.convertMintermsToBinary();

        // minterm csoportosítás az 1-esek száma alapján
        const groupedMinterms = this.groupMintermsByOnes();

        // prím implikánsok keresése minterm csoportosítással
        this.primeImplicants = this.findPrimeImplicants(groupedMinterms);

        // alapvető prím implikánsok keresése
        const essentialPrimeImplicants = this.findEssentialPrimeImplicants();

        // minimalizált alak formázása
        const formattedExpression = this.formatExpression(essentialPrimeImplicants);
        return formattedExpression;
    }

    convertMintermsToBinary() {
        
    }

    groupMintermsByOnes() {
        
    }

    findPrimeImplicants() {
   
    }

    findEssentialPrimeImplicants() {
        
    }

    formatExpression() {
        
    }
}

module.exports = QuineMcCluskey;
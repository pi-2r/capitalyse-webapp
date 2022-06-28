import cleanNumber from "../helpers/cleanNumber";

export default {
    mixins: [cleanNumber],
    computed: {
        indexes() {
            return this.$store.getters['indexes/portfolio'];
        },
    },
    methods: {
        getTotalBalance(data) {
            const eurTotalIndex = this.indexes.eurTotalIndex;
            let total = 0;

            // loop door data heen
            for (let i = 0; i < data.length; i++) {
                // voeg toe als data niet leeg is
                // dit is de enige check die nodig is bij balance
                // dit is omdat elke kolom van de eurTotalIndex 
                // bijdraagt aan het totaal
                if (data[i][0] !== '') {
                    // maak nummer schoon
                    // voeg toe aan totaal
                    let amount = this.cleanNumber(data[i][eurTotalIndex]);
                    total += amount;
                }
            }

            return total;
        }
    }
}
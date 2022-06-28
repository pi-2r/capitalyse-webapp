import cleanNumber from '../helpers/cleanNumber';
import includesFromArray from '../helpers/includesFromArray';

export default {
    mixins: [cleanNumber, includesFromArray],
    computed: {
        names() {
            return this.$store.getters['dictionary/exchangeFees'];
        },
        indexes() {
            return this.$store.getters['indexes/exchangeFees'];
        },
    },
    methods: {
        getTotalExchangeFees(data) {
            const names = this.names;
            const indexes = this.indexes;
            const searchIndex = indexes.searchIndex;
            const feeIndex = indexes.feeIndex;
            let totalFees = 0;

            // -1 omdat de laatste rij leeg is
            // als de huidige searchIndex in de foor loop voor komt in de 
            // namen array, dan is de huidige rij een fee
            // dus moet de fee bij de totalFees toegevoegd worden
            for (let i = 0; i < data.length - 1; i++) {
                if (this.includesFromArray(names, data[i][searchIndex])) {
                    let nr = this.cleanNumber(data[i][feeIndex]);
                    totalFees += nr;
                }
            }

            // maak nummer met goede komma's en return het
            totalFees = totalFees.toFixed(2);
            totalFees = parseFloat(totalFees).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

            return totalFees;
        },
    }
}
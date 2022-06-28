import cleanNumberMixin from '../helpers/cleanNumber';
import includesFromArrayMixin from '../helpers/includesFromArray';

export default {
    mixins: [cleanNumberMixin, includesFromArrayMixin],
    methods: {
        getTotalDeposits(data) {
            const depositNames = this.$store.getters['dictionary/deposit'];
            const withdrawalNames = this.$store.getters['dictionary/withdrawal'];

            const indexes = this.$store.getters['indexes/deposits'];
            const searchIndex = indexes.searchIndex;
            const depositIndex = indexes.depositIndex;

            let tot = 0;

            for (let i = 0; i < data.length; i++) {
                // als er data is
                if (data[i][searchIndex]) {
                    // valide checks
                    const validDeposit =
                        this.includesFromArray(depositNames, data[i][searchIndex]) &&
                        this.cleanNumber(data[i][depositIndex]) > 0;

                    const validWithdrawal =
                        this.includesFromArray(withdrawalNames, data[i][searchIndex]) &&
                        this.cleanNumber(data[i][depositIndex]) < 0;

                    // als valide is, voeg deposits aan totaal toe
                    if (validDeposit || validWithdrawal) {
                        let nr = this.cleanNumber(data[i][depositIndex]);
                        tot += nr;
                    }
                }
            }

            return tot;
        },
    }
}
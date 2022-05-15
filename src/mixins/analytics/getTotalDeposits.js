import cleanNumberMixin from '../../mixins/cleanNumber';
import includesFromArrayMixin from '../../mixins/includesFromArray';

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
                
                if (data[i][searchIndex]) { 
                    
                    const validDeposit =
                        this.includesFromArray(depositNames, data[i][searchIndex]) &&
                        this.cleanNumber(data[i][depositIndex]) > 0;

                    const validWithdrawal =
                        this.includesFromArray(withdrawalNames, data[i][searchIndex]) &&
                        this.cleanNumber(data[i][depositIndex]) < 0;
                    
                    if (validDeposit || validWithdrawal) {
                        let nr = this.cleanNumber(data[i][depositIndex]);
                            tot += nr;
                    }
                }
            }

            tot = tot.toFixed(2);
            tot = parseFloat(tot).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})

            return tot;
        },
    }
}
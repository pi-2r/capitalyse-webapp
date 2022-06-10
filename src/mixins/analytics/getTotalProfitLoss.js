import cleanNumber from "../helpers/cleanNumber";
import getTotalBalance from "./getTotalBalance";
import getTotalDeposits from "./getTotalDeposits";

export default {
    mixins: [cleanNumber, getTotalBalance, getTotalDeposits],
    computed: {
        portfolioIndexes() {
            return this.$store.getters['indexes/portfolio'];
        },
        transactionsIndexes() {
            return this.$store.getters['indexes/profitLossTransactionsIndexes'];
        }
    },
    methods: {
        getTotalProfitLoss(portfolioFile, accountFile) {
            const totDeposits = this.getTotalDeposits(accountFile);
            const portfolioEurAmt = this.getTotalBalance(portfolioFile);
            
            const total = portfolioEurAmt - totDeposits;
            return total;
        }
    }
}
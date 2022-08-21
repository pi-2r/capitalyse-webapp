import cleanNumber from "../helpers/cleanNumber";
import includesFromArray from "../helpers/includesFromArray";
import getHoldingTransactionFees from "./getHoldingTransactionFees";

import getHoldingTransactions from "./getHoldingTransactions";

export default {
  mixins: [cleanNumber, getHoldingTransactions, includesFromArray, getHoldingTransactionFees],
  data() {
    return {
      mixinHoldingSize: 0,
      mixinsTransFees: 0,
      mixinNetTransWorth: 0,
      mixinHoldingTransactions: [],
    }
  },
  computed: {
    portfolioIndexes() {
      return this.$store.getters['indexes/portfolio'];
    },
    accountStatementIndexes() {
      return this.$store.getters['indexes/accountStatement'];
    },
    currencyDebitNames() {
      return this.$store.getters['dictionary/currencyDebit'];
    },
    buyNames() {
      return this.$store.getters['dictionary/buy'];
    },
  },
  methods: {
    getHoldingProfitLoss(accountData, portfolioData, transactionsData, isin) {

      this.mixinHoldingSize = this.getHoldingSize(portfolioData, isin);

      this.mixinHoldingTransactions = this.getHoldingTransactions(accountData, isin);
      this.mixinNetTransWorth = this.getHoldingNetTransWorth(this.mixinHoldingTransactions, this.buyNames);

      this.mixinTransFees = this.getHoldingTransactionFees(transactionsData, isin);

      console.log(this.mixinHoldingSize, this.mixinNetTransWorth, this.mixinTransFees);

      const totalPL = this.mixinHoldingSize - this.mixinNetTransWorth - this.mixinTransFees;
      
      if (typeof totalPL === 'number') {
        return totalPL;
      } else {
        return false;
      }
    },
    getHoldingSize(portfolioData, isin) {
      // pak de holding uit portfolio file en neem de totale waarde in euros
      // voor de huidige waarde vd holding
      for(let i = 0; i < portfolioData.length; i++) {
        if (portfolioData[i][this.portfolioIndexes.isinIndex] === isin) {
          return this.cleanNumber(portfolioData[i][this.portfolioIndexes.eurTotalIndex]);
        }
      }
      return false;
    },
    getHoldingNetTransWorth(holdingTransactions, names) {
      // 'names' bepaald of er gezocht wordt naar euro of een andere valuta
      // buyNames is euro
      // currencyDebitNames is andere valuta
      let tot = 0;

      for (let i = 0; i < holdingTransactions.length; i++) {
        if (holdingTransactions[i][this.accountStatementIndexes.typeIndex].includes("Vendre")) {
          console.log(holdingTransactions[i]);
        }
        console.log(holdingTransactions[i]);

        if (this.includesFromArray(names, holdingTransactions[i][this.accountStatementIndexes.typeIndex])) {
      
          tot += this.cleanNumber(holdingTransactions[i][this.accountStatementIndexes.amountIndex]);
        }
      }
      return tot * -1;
    },
  }
}
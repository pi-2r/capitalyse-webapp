import cleanNumber from "../helpers/cleanNumber";
import includesFromArray from "../helpers/includesFromArray";
import currencyMarkup from "../helpers/currencyMarkup";

import getHoldingTransactionFees from "./getHoldingTransactionFees";
import getHoldingPositionValue from "./getHoldingPositionValue";
import getHoldingTransactions from "./getHoldingTransactions";

export default {
  mixins: [cleanNumber, getHoldingTransactions, includesFromArray, getHoldingTransactionFees, getHoldingPositionValue, currencyMarkup],
  data() {
    return {
      mixinHoldingSize: 0,
      mixinTransFees: 0,
      mixinNetTransWorth: 0,
      mixinIsHoldingInEuro: null,
      mixinHoldingTransactions: [],
      currencies: {
        eur: "EUR",
        usd: "USD",
      }
    }
  },
  computed: {
    portfolioIndexes() {
      return this.$store.getters['indexes/portfolio'];
    },
    accountStatementIndexes() {
      return this.$store.getters['indexes/accountStatement'];
    },
    currencyChangeNames() {
      return this.$store.getters['dictionary/currencyChange'];
    },
    buyNames() {
      return this.$store.getters['dictionary/buy'];
    },
  },
  methods: {
    getHoldingProfitLoss(accountData, portfolioData, transactionsData, isin) {
      // Get holding size as currently is in portfoliofile
      this.mixinHoldingSize = this.getHoldingPositionValue(portfolioData, isin);
      // Get transactions array for this isin
      this.mixinHoldingTransactions = this.getHoldingTransactions(accountData, isin);
      // Check if is EURO or other currency to give correct function
      this.mixinIsHoldingInEuro = this.isHoldingInEuro(this.mixinHoldingTransactions);
      // Give correct function to get net traded value in euro
      if (this.mixinIsHoldingInEuro) {
        this.mixinNetTransWorth = this.getHoldingNetTransWorthEUR(this.mixinHoldingTransactions);
      } else {
        this.mixinNetTransWorth = this.getHoldingNetTransWorthOther(this.mixinHoldingTransactions);
      }
      // Get transaction fees
      this.mixinTransFees = this.getHoldingTransactionFees(transactionsData, portfolioData, isin);
      // Calculate profit/loss
      let totalPL = this.mixinHoldingSize.value - this.mixinNetTransWorth - this.mixinTransFees.fees;
      // Calculate profit/loss percentage
      let totalPLPercentage = totalPL / this.mixinHoldingSize.value * 100;

      if (typeof totalPL === 'number') {
        return {
          totalPL: totalPL,
          totalPLPercentage: totalPLPercentage,
        };
      } else {
        return false;
      }
    },
    // check of holding in euro is ofwel in een andere valuta
    // dit omdat ie andere dictionary namen nodig heeft bij verschillende valuta
    isHoldingInEuro(holdingTransactions) {
      for (let i = 0; i < holdingTransactions.length; i++) {
        if (
          this.includesFromArray(this.buyNames, holdingTransactions[i][this.accountStatementIndexes.typeIndex]) &&
          holdingTransactions[i][this.accountStatementIndexes.ogCurrencyIndex] === this.currencies.eur
        ) {
          return true;
        }
      }
      return false;
    },
    getHoldingNetTransWorthEUR(holdingTransactions) {
      // 'names' bepaald of er gezocht wordt naar euro of een andere valuta
      // buyNames is euro
      let tot = 0;

      for (let i = 0; i < holdingTransactions.length; i++) {
        if (this.includesFromArray(this.buyNames, holdingTransactions[i][this.accountStatementIndexes.typeIndex])) {
          tot += this.cleanNumber(holdingTransactions[i][this.accountStatementIndexes.amountIndex]);
        }
      }
      return tot * -1;
    },
    getHoldingNetTransWorthOther(holdingTransactions) {
      // 'names' bepaald of er gezocht wordt naar euro of een andere valuta
      // currencyDebitNames is andere valuta
      let tot = 0;

      for (let i = 0; i < holdingTransactions.length; i++) {
        if (
          this.includesFromArray(this.currencyChangeNames, holdingTransactions[i][this.accountStatementIndexes.typeIndex]) &&
          holdingTransactions[i][this.accountStatementIndexes.ogCurrencyIndex] === this.currencies.eur
        ) {
          tot += this.cleanNumber(holdingTransactions[i][this.accountStatementIndexes.amountIndex]);
        }
      }
      return tot * -1;
    },
  }
}
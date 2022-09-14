import cleanNumber from "../helpers/cleanNumber";
import includesFromArray from "../helpers/includesFromArray";

export default {
  mixins: [cleanNumber, includesFromArray],
  data() {
    return {
      currencies: {
        eur: "EUR",
        usd: "USD",
      }
    }
  },
  computed: {
    accountStatementIndexes() {
      return this.$store.getters['indexes/accountStatement'];
    },
    buyNames() {
      return this.$store.getters['dictionary/buy'];
    },
  },
  methods: {
    // check of holding in euro is ofwel in een andere valuta
    // dit omdat ie andere dictionary namen nodig heeft bij verschillende valuta
    getIsHoldingInEuro(holdingTransactions) {
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
  }
}
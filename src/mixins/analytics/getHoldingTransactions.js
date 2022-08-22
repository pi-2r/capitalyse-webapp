import cleanNumber from "../helpers/cleanNumber";

export default {
  mixins: [cleanNumber],
  computed: {
    accountStatementIndexes() {
      return this.$store.getters['indexes/accountStatement'];
    },
  },
  methods: {
    getHoldingTransactions(accountData, isin) {
      let holdingTransactions = [];
      for (let i = 0; i < accountData.length; i++) {

        if (accountData[i][this.accountStatementIndexes.isinIndex] === isin) {
          holdingTransactions.push(accountData[i]);
        }
      }

      if (holdingTransactions.length > 0) {
        return holdingTransactions;
      }
      return false;
    }
  }
}
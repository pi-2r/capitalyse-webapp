import cleanNumber from "../helpers/cleanNumber";

import getHoldingTransactions from "./getHoldingTransactions";

export default {
  mixins: [cleanNumber, getHoldingTransactions],
  data() {
    return {
      mixinIsHoldingInEuro: null,
      mixinHoldingTransactions: [],
      mixinNetTransWorth: 0,
    }
  },
  computed: {
    transactionsIndexes() {
      return this.$store.getters['indexes/transactions'];
    },
  },
  methods: {
    getHoldingTransactionFees(data, accountData, isin) {
      const searchIndex = this.transactionsIndexes.searchIndex;
      const isinIndex = this.transactionsIndexes.isinIndex;

      let tot = 0;

      // -1 omdat de laatste kolom leeg is
      // checkt of deze data niet leeg is ofwel bestaat
      // dit is de enige check die nodig is omdat de kosten
      // een eigen kolom hebben in de data
      // checkt per isin
      for (let i = 0; i < data.length - 1; i++) {
        if (data[i][isinIndex] === isin) {
          if (data[i][searchIndex] && data[i][searchIndex] !== "") {
            let nr = parseFloat(data[i][searchIndex]);
            tot += nr;
          }
        }
      }

      // Get transactions array for this isin
      this.mixinHoldingTransactions = this.getHoldingTransactions(accountData, isin);
      // Check if is EURO or other currency to give correct function
      this.mixinIsHoldingInEuro = this.getIsHoldingInEuro(this.mixinHoldingTransactions);
      // Give correct function to get net traded value in euro
      if (this.mixinIsHoldingInEuro) {
        this.mixinNetTransWorth = this.getHoldingNetTransWorthEUR(this.mixinHoldingTransactions);
      } else {
        this.mixinNetTransWorth = this.getHoldingNetTransWorthOther(this.mixinHoldingTransactions);
      }

      // get percentage of position size
      let percentage = tot / this.mixinNetTransWorth * 100;
      
      return {
        fees: tot,
        percentage: percentage,
      };
    },
  }
}
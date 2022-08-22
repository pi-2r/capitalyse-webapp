import cleanNumber from "../helpers/cleanNumber";

import getHoldingPositionValue from "./getHoldingPositionValue";

export default {
  mixins: [cleanNumber, getHoldingPositionValue],
  computed: {
    transactionsIndexes() {
      return this.$store.getters['indexes/transactions'];
    },
  },
  methods: {
    getHoldingTransactionFees(data, portfolioData, isin) {
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

      // get percentage of position size
      let holdingValue = this.getHoldingPositionValue(portfolioData, isin);
      let percentage = tot / holdingValue.value * 100;
      
      return {
        fees: tot,
        percentage: percentage,
      };
    },
  }
}
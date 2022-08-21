import cleanNumber from "../helpers/cleanNumber";

export default {
  mixins: [cleanNumber],
  computed: {
    transactionsIndexes() {
      return this.$store.getters['indexes/transactions'];
    },
  },
  methods: {
    getHoldingTransactionFees(data, isin) {
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

      // markup
      tot = tot.toFixed(2);
      tot = parseFloat(tot).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

      return this.cleanNumber(tot);
    },
  }
}
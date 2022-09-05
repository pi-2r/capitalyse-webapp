import cleanNumber from '../helpers/cleanNumber';
import includesFromArray from '../helpers/includesFromArray';

export default {
  mixins: [cleanNumber, includesFromArray],
  computed: {
    portfolioIndexes() {
      return this.$store.getters['indexes/portfolio'];
    },
    cashNames() {
      return this.$store.getters['dictionary/portfolioCash'];
    },
  },
  methods: {
    getHoldingsList(portfolioData) {
      const portfolioIndexes = this.portfolioIndexes;
      const cashNames = this.cashNames;
      let holdings = [];

      // fill holdings list
      for (let i = 0; i < portfolioData.length - 1; i++) {
        if (portfolioData[i] != '') {
          // maak er mooi nummer van
          let tot = portfolioData[i][portfolioIndexes.eurTotalIndex];
          tot = this.cleanNumber(tot);
          tot = tot.toFixed(2);
          // tot = parseFloat(tot).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

          holdings.push({
            isin: portfolioData[i][portfolioIndexes.isinIndex],
            name: portfolioData[i][portfolioIndexes.productIndex],
            amount: portfolioData[i][portfolioIndexes.amountIndex],
            totalValue: tot
          });
        }
    
      }

      // remove cash positions
      holdings = holdings.filter((value) => {
        return !this.includesFromArray(cashNames, value.name)
      })

      // grootste eerst
      holdings.sort((a, b) => {
        return b.totalValue - a.totalValue;
      });

      return holdings;
    },
  }
}
export default {
  computed: {
    portfolioIndexes() {
      return this.$store.getters['indexes/portfolio'];
    },
  },
  methods: {
    getHoldingName(portfolioData, isin) {
      let holdingName = '';
      // pak de holding uit portfolio file en neem de totale waarde in euros
      // voor de huidige waarde vd holding
      for (let i = 0; i < portfolioData.length; i++) {
        if (portfolioData[i][this.portfolioIndexes.isinIndex] === isin) {
          holdingName = portfolioData[i][this.portfolioIndexes.productIndex];
        }
      }
   
      if(holdingName !== '') {
        return holdingName;
      } else {
        return false;
      }
    },
  }
}
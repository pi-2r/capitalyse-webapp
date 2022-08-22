import cleanNumber from "../helpers/cleanNumber";
import getTotalInvestedAmount from "./getTotalInvestedAmount";

export default {
  mixins: [cleanNumber, getTotalInvestedAmount],
  computed: {
    portfolioIndexes() {
      return this.$store.getters['indexes/portfolio'];
    },
  },
  methods: {
    getHoldingPositionValue(portfolioData, isin) {
      let positionValue = {
        value: 0,
        percentage: 0,
      };
      // pak de holding uit portfolio file en neem de totale waarde in euros
      // voor de huidige waarde vd holding
      for (let i = 0; i < portfolioData.length; i++) {
        if (portfolioData[i][this.portfolioIndexes.isinIndex] === isin) {
          positionValue.value = this.cleanNumber(portfolioData[i][this.portfolioIndexes.eurTotalIndex]);
        }
      }

      // bereken percentage
      let totalInvestedAmount = this.getTotalInvestedAmount(portfolioData);
      positionValue.percentage = (positionValue.value / totalInvestedAmount) * 100;

      return positionValue;
    },
  }
}
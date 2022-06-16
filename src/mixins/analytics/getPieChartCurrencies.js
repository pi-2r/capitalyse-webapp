import cleanNumber from '../helpers/cleanNumber';
import includesFromArray from '../helpers/includesFromArray';

export default {
  mixins: [cleanNumber, includesFromArray],
  computed: {
    cashNames() {
      return this.$store.getters['dictionary/portfolioCash'];
    },
    indexes() {
      return this.$store.getters['indexes/portfolio'];
    },
  },
  data() {
    return {
      currenciesArray: [],
      currenciesLabelsHolder: [],
      currenciesDataHolder: [],
    };
  },
  methods: {
    getPieChartCurrencies(data) {
      this.currenciesLabelsHolder = [];
      this.currenciesDataHolder = [];
      this.currenciesArray = [];

      this.createArrayOfCurrencies(data);

      if (this.currenciesArray.length > 0) {

        this.sortCurrenciesChartData();
        this.turnIntoCurrencyChartData();

        return {
          labels: this.currenciesLabelsHolder,
          data: this.currenciesDataHolder,
        };

      } else {
        return false;
      }
    },
    createArrayOfCurrencies(data) {
      let isFirstIteration = true;
      let alreadyExists = false;

      for (let i = 0; i < data.length - 1; i++) {

        const localCurrency = data[i][this.indexes.localCurrencyIndex].split(" ")[0];
        const eurTotal = this.cleanNumber(data[i][this.indexes.eurTotalIndex]);

        if (isFirstIteration) {
          this.currenciesArray.push({
            name: localCurrency,
            value: eurTotal,
          });
          isFirstIteration = false;
        }

        for (let j = 0; j < this.currenciesArray.length; j++) {
          if (this.currenciesArray[j].name === localCurrency) {
            this.currenciesArray[j].value += eurTotal;
            alreadyExists = true;
            break;
          } else {
            alreadyExists = false;
          }
        }

        if (!alreadyExists) {
          this.currenciesArray.push({
            name: localCurrency,
            value: eurTotal,
          });
        }
        alreadyExists = false;

        console.log(this.currenciesArray);
      }
    },
    turnIntoCurrencyChartData() {
      for (let i = 0; i < this.currenciesArray.length; i++) {
        this.currenciesLabelsHolder.push(this.currenciesArray[i].name);
        this.currenciesDataHolder.push(this.currenciesArray[i].value);
      }
    },
    sortCurrenciesChartData() {
      this.currenciesArray.sort((a, b) => {
        return b.value - a.value;
      });
    }
  }
}
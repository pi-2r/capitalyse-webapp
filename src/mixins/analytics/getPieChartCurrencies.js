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

      // gets all currencies from data
      this.createArrayOfCurrencies(data);

      // if is not empty, do more data manipulation and return data
      if (this.currenciesArray.length > 0) {

        this.sortCurrenciesChartData();
        this.turnIntoCurrencyChartData();

        return {
          labels: this.currenciesLabelsHolder,
          data: this.currenciesDataHolder,
        };

      } else {
        // return false als er geen data is
        return false;
      }
    },
    createArrayOfCurrencies(data) {
      let isFirstIteration = true;
      let alreadyExists = false;

      // -1 omdat de laatste rij leeg is
      for (let i = 0; i < data.length - 1; i++) {

        // haal de currency uit de data in EUR
        const localCurrency = data[i][this.indexes.localCurrencyIndex].split(" ")[0];
        const eurTotal = this.cleanNumber(data[i][this.indexes.eurTotalIndex]);

        // bij eerste loop er altijd in doen
        if (isFirstIteration) {
          this.currenciesArray.push({
            name: localCurrency,
            value: eurTotal,
          });
          isFirstIteration = false;
        }
        
        // loop door de array van currencies
        // als de currency nog niet bestaat, voeg toe
        // als de currency al bestaat, voeg de value toe
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

      }
    },
    turnIntoCurrencyChartData() {
      // loop door de array van currencies
      // haal uit de array de name en maak er een label array
      // haal uit de array de values en maak er een currencies array
      for (let i = 0; i < this.currenciesArray.length; i++) {
        this.currenciesLabelsHolder.push(this.currenciesArray[i].name);
        this.currenciesDataHolder.push(this.currenciesArray[i].value);
      }
    },
    sortCurrenciesChartData() {
      // sorteer op grootte van de value
      this.currenciesArray.sort((a, b) => {
        return b.value - a.value;
      });
    }
  }
}
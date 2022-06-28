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
      holdingsArray: [],
      labelsHolder: [],
      dataHolder: [],
    };
  },
  methods: {
    getPieChartHoldings(data) {
      this.labelsHolder = [];
      this.dataHolder = [];
      this.holdingsArray = [];

      // haal holdings uit de data
      this.createArrayOfHoldings(data);

      // als er data is, doe meer data manipulatie en return data
      if (this.holdingsArray.length > 0) {

        this.mergeCashRows();
        this.sortChartData();
        this.turnIntoHoldingsChartData();

        return {
          labels: this.labelsHolder,
          data: this.dataHolder,
        };

      } else {
        return false;
      }
    },
    sortChartData() {
      // sorteer op grootte holding
      this.holdingsArray.sort((a, b) => {
        return b.value - a.value;
      });
    },
    mergeCashRows() {
      let totalCash = 0;
      let amountOfCashRows = 0;

      // loop door de holdings heen
      // als cash wordt gevonden, voeg deze toe aan de total cash
      for (let i = 0; i < this.holdingsArray.length; i++) {
        if (this.includesFromArray(this.cashNames, this.holdingsArray[i].name)) {
          totalCash += this.holdingsArray[i].value
          this.holdingsArray.splice(i, 1);
          amountOfCashRows++;
          i--;
        }
      }

      // als er cash is, voeg total cash toe aan de holdings array
      if (amountOfCashRows > 0) {
        this.holdingsArray.push({
          name: 'CASH & CASH FUND & FTX CASH',
          value: totalCash,
        });
      }

      // loopt door de holdings heen
      // bij cash -> rename naar 'Cash'
      for (let i = 0; i < this.holdingsArray.length; i++) {
        if (this.includesFromArray(this.cashNames, this.holdingsArray[i].name)) {
          this.holdingsArray[i].name = 'Cash';
        }
      }
    },
    createArrayOfHoldings(data) {
      // indexes waar relevante data staat
      const indexes = this.indexes;
      const eurTotalIndex = indexes.eurTotalIndex;
      const productIndex = indexes.productIndex;

      // -1 omdat de laatste rij leeg is
      for (let i = 0; i < data.length - 1; i++) {
        let nr = this.cleanNumber(data[i][eurTotalIndex]);
        this.holdingsArray.push({
          name: data[i][productIndex],
          value: nr,
        });
      }
    },
    turnIntoHoldingsChartData() {
      // get labels and data from holdings array
      for (let i = 0; i < this.holdingsArray.length; i++) {
        this.labelsHolder.push(this.holdingsArray[i].name);
        this.dataHolder.push(this.holdingsArray[i].value);
      }
    }
  }
}
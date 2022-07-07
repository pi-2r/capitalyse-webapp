import cleanNumberMixin from '../helpers/cleanNumber';
import includesFromArrayMixin from '../helpers/includesFromArray';
import splitDateMixin from '../helpers/splitDate';

export default {
  mixins: [cleanNumberMixin, includesFromArrayMixin, splitDateMixin],
  data() {
    return {
      monthNamesShort: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      dividendsArray: [],
      dataHolder: [],
      labelsHolder: [],
      names: {
        eur: 'EUR',
      }
    }
  },
  computed: {
    indexes() {
      return this.$store.getters['indexes/dividendChart'];
    },
    dividendNamesEUR() {
      return this.$store.getters['dictionary/dividendEUR'];
    },
    currencyNames() {
      return this.$store.getters['dictionary/currency'];
    }
  },
  methods: {
    getChartDividends(data) {

      this.getDividendsFromData(data);

      if (this.dividendsArray.length > 0) {
        this.sortDividendsByDate();
        this.addMissingMonthsToChart();
        // this.convertLabelsToWords();


        return {
          labels: this.labelsHolder,
          data: this.dataHolder,
        }

      } else {
        return false;
      }

    },
    getDividendsFromData(data) {
      const dateIndex = this.indexes.dateIndex;
      const searchIndex = this.indexes.searchIndex;
      const isinIndex = this.indexes.isinIndex;
      const currencyIndex = this.indexes.currencyIndex;
      const productIndex = this.indexes.productIndex;
      const dividendIndex = this.indexes.dividendIndex;
      const dividendNamesEUR = this.dividendNamesEUR;
      const currencyNames = this.currencyNames;


      this.dividendsArray = [];
      this.dataHolder = [];
      this.labelsHolder = [];

      for (let i = 0; i < data.length - 1; i++) {

        const validDividendEUR =
          (this.includesFromArray(dividendNamesEUR, data[i][searchIndex]) &&
            data[i][currencyIndex] === this.names.eur)

        let validDividendOther = false;
        const foundDividendNotEur =
          (this.includesFromArray(currencyNames, data[i][searchIndex]) &&
            data[i][currencyIndex] === this.names.eur &&
            data[i][productIndex] === "");
        
        let currentDividendIsin = "";
        let currentDividendName = "";

        // als ie een dividend heeft gevonden die niet in EUR is
        if (foundDividendNotEur) {
          // ga door op huidige index + 1
          for (let j = i; j < data.length; j++) {
            if (data[j][dateIndex] !== '') {
              // als de row een dividend is
              if (this.includesFromArray(dividendNamesEUR, data[j][searchIndex])) {
                // dividend van de debit row, maakt het ook positief
                const otherDividendAmount = (this.cleanNumber(data[i + 1][dividendIndex])) * -1;

                // speling omdat het soms net iets meer of minder is, waarom weet ik niet
                if (otherDividendAmount + 0.02 > this.cleanNumber(data[j][10]) &&
                  otherDividendAmount - 0.02 < this.cleanNumber(data[j][10])) {
                  // als ie een andere dividend heeft gevonden gebruik je j index
                  currentDividendIsin = data[j][isinIndex];
                  currentDividendName = data[j][productIndex];

                  validDividendOther = true;
                  break;
                }
              }
            }
          }
        }

        // als ie een dividend heeft gevonden die in EUR is gebruik de i index
        // currentDividendName wordt alleen gevuld bij een andere dividend, daarom werkt deze check
        currentDividendName === '' ? currentDividendName = data[i][productIndex] : null;
        currentDividendIsin === '' ? currentDividendIsin = data[i][isinIndex] : null;

        if (validDividendEUR || validDividendOther) {
          let alreadyExists = false;
          let date = data[i][dateIndex].slice(3, 10);

          let divAmt = this.cleanNumber(data[i][dividendIndex]);

          console.log(currentDividendName, currentDividendIsin, divAmt);

          // first time
          if (this.dividendsArray.length === 0) {
            this.dividendsArray.push({
              date: date,
              divAmt: divAmt,
            });
          } else {
            // if already exists, find and add to existing
            for (let j = 0; j < this.dividendsArray.length; j++) {
              if (this.dividendsArray[j].date === date) {
                this.dividendsArray[j].divAmt += divAmt;
                alreadyExists = true;
                break;
              }
            }
            // if doesnt already exists, add new
            if (!alreadyExists) {
              this.dividendsArray.push({
                date: date,
                divAmt: divAmt,
              });
            }
          }
        }
      }
    },
    sortDividendsByDate() {
      // sort array by date if exists
      this.dividendsArray
        ? this.dividendsArray.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        })
        : null;

      let firstDate = this.dividendsArray[0].date.split("-");
      let lastDate =
        this.dividendsArray[this.dividendsArray.length - 1].date.split("-");
      let newFirstDate = new Date(lastDate[1], lastDate[0] - 1);
      let newLastDate = new Date(firstDate[1], firstDate[0]);

      // create array from first date to last date
      let dateArray = [];
      while (newFirstDate < newLastDate) {
        dateArray.push(newFirstDate.toLocaleDateString());
        newFirstDate.setMonth(newFirstDate.getMonth() + 1);
      }

      this.dividendsArray.reverse();
      // fill chart
      for (let i = 0; i < dateArray.length; i++) {
        let date = dateArray[i];
        let found = false;

        // find date in dividendsArray, if found add to chart
        for (let x = 0; x < this.dividendsArray.length; x++) {
          let dateFromArray = this.splitDate(this.dividendsArray[x].date);
          let newDateFromArray = new Date(
            dateFromArray[1],
            dateFromArray[0] - 1
          ).toLocaleDateString();

          if (date === newDateFromArray) {
            found = true;
            let dividend = this.dividendsArray[x].divAmt;
            this.dataHolder.push(dividend);
          }
        }

        // if not found push 0 aka null
        if (!found) {
          this.dataHolder.push(null);
        }

        // date to month and year only
        date = this.splitDate(date);

        // if american notation
        if (
          this.splitDate(dateArray[1])[0] !== this.splitDate(dateArray[0])[0]
        ) {
          date = date[0] + "-" + date[2];
        } else {
          // if normal notation
          date = date[1] + "-" + date[2];
        }

        this.labelsHolder.push(date);
      }
    },
    addMissingMonthsToChart() {
      // add potentially missing months untill current month
      let currentMonth =
        new Date().getMonth() + 1 + "-" + new Date().getFullYear();
      if (!this.includesFromArray(this.labelsHolder, currentMonth)) {
        let lastMonthInChart = this.labelsHolder[this.labelsHolder.length - 1];
        let lastMonth = this.splitDate(lastMonthInChart);
        let newLastMonth = new Date(lastMonth[1], lastMonth[0]);
        let newCurrentMonth = new Date(
          currentMonth.split("-")[1],
          currentMonth.split("-")[0] - 1
        );
        let firstiteration = true;

        while (newLastMonth <= newCurrentMonth) {
          firstiteration
            ? (newLastMonth = new Date(
              newLastMonth.getFullYear(),
              newLastMonth.getMonth() + 1
            ))
            : null;
          firstiteration = false;

          let pushedMonth = newLastMonth.getMonth();
          let pushedYear = newLastMonth.getFullYear();

          if (pushedMonth === 0) {
            pushedMonth = 12;
            pushedYear = pushedYear - 1;
          }

          let pushedDate = pushedMonth + "-" + pushedYear;
          this.labelsHolder.push(pushedDate);
          newLastMonth.setMonth(newLastMonth.getMonth() + 1);
        }
        this.labelsHolder.push(currentMonth);
      }

      // remove duplicate last and second last bug
      this.removeDuplicateBug();
    },
    removeDuplicateBug() {
      if (
        this.labelsHolder[this.labelsHolder.length - 1] ===
        this.labelsHolder[this.labelsHolder.length - 2]
      ) {
        this.labelsHolder.pop();
      }
    },
    convertLabelsToWords() {
      // convert labels to words
      for (let i = 0; i < this.labelsHolder.length; i++) {
        let date = this.labelsHolder[i].split("-");
        if (date[0] === '1') {
          this.labelsHolder[i] = date[1];
        } else {
          this.labelsHolder[i] = this.monthNamesShort[date[0] - 1];
        }
      }
    },
    setYearToDate() {
      // delete all months before this year
      let currentYear = new Date().getFullYear();
      for (let i = 0; i < this.labelsHolder.length; i++) {
        let label = this.labelsHolder[i];
        let labelYear = label.split("-")[1];
        if (labelYear < currentYear) {
          this.labelsHolder.splice(i, 1);
          this.dataHolder.splice(i, 1);
          i--;
        }
      }
      // delete all dividends before this year
      for (let i = 0; i < this.dividendsArray.length; i++) {
        let dividendYear = this.dividendsArray[i].date.split("-")[1];
        if (dividendYear < currentYear) {
          this.dividendsArray.splice(i, 1);
          i--;
        }
      }
    },
    setYears(years) {
      // get one year ago in MM-YYYY
      let currentYear = new Date().getFullYear();
      let currentMonth = new Date().getMonth() + 1;
      let yearAgo = new Date(currentYear - years, currentMonth);

      // delete all months before yearAgo
      for (let i = 0; i < this.labelsHolder.length; i++) {
        let label = this.labelsHolder[i];
        let labelYear = label.split("-")[1];
        let labelMonth = label.split("-")[0];
        let labelDate = new Date(labelYear, labelMonth - 1);

        if (labelDate < yearAgo || labelDate < yearAgo + 1) {
          this.labelsHolder.splice(i, 1);
          this.dataHolder.splice(i, 1);
          i--;
        }
      }

      // delete all dividends of more than one year ago
      for (let i = 0; i < this.dividendsArray.length; i++) {
        let dividendYear = this.dividendsArray[i].date.split("-")[1];
        let dividendMonth = this.dividendsArray[i].date.split("-")[0];
        let dividendDate = new Date(dividendYear, dividendMonth - 1);

        if (dividendDate < yearAgo || dividendDate < yearAgo + 1) {
          this.dividendsArray.splice(i, 1);
          i--;
        }
      }
    }
  }
}
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
        this.turnIntoChartData();

        return this.dividendsArray;

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
        let currentDividendDate = "";

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
                  currentDividendDate = data[j][dateIndex];

                  // if currentDividendDate has a day, remove it
                  if (currentDividendDate.includes('-')) {
                    currentDividendDate = currentDividendDate.split('-')[1] + '-' + currentDividendDate.split('-')[2];
                  }

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
          let isinAlreadyExists = false;
          let isinDateAlreadyExists = false;
          let date = data[i][dateIndex].slice(3, 10);
          currentDividendDate === '' ? date = data[i][dateIndex].slice(3, 10) : date = currentDividendDate;

          let divAmt = this.cleanNumber(data[i][dividendIndex]);
          divAmt = parseFloat(divAmt.toFixed(2));


          // first time
          if (this.dividendsArray.length === 0) {
            this.dividendsArray.push({
              isin: currentDividendIsin,
              name: currentDividendName,
              dividend: [{
                date: date,
                amount: divAmt,
              }]
            });
          } else {
            // if already exists, find and add to existing
            for (let j = 0; j < this.dividendsArray.length; j++) {
              if (this.dividendsArray[j].isin === currentDividendIsin) {
                isinAlreadyExists = true;
                for (let k = 0; k < this.dividendsArray[j].dividend.length; k++) {
                  if (this.dividendsArray[j].dividend[k].date === date) {
                    this.dividendsArray[j].dividend[k].amount += divAmt;
                    isinDateAlreadyExists = true;
                    break;
                  }
                }
              }
            }
            // if doesnt already exists, add new
            if (!isinAlreadyExists) {
              this.dividendsArray.push({
                isin: currentDividendIsin,
                name: currentDividendName,
                dividend: [{
                  date: date,
                  amount: divAmt,
                }]
              });
            } else if (!isinDateAlreadyExists) {
              // if date doesnt already exists, add new to existing isin
              for (let j = 0; j < this.dividendsArray.length; j++) {
                if (this.dividendsArray[j].isin === currentDividendIsin) {
                  this.dividendsArray[j].dividend.push({
                    date: date,
                    amount: divAmt,
                  });
                }
              }
            }
          }
        }
      }
    },
    sortDividendsByDate() {
      // dit is om de dividend per elke isin te sorteren op datum
      for (let i = 0; i < this.dividendsArray.length; i++) {
        this.dividendsArray[i].dividend.sort((a, b) => {
          // maakt van de string datums een date object
          let newADate = a.date.split('-');
          newADate[0] = parseInt(newADate[0]);
          newADate[1] = parseInt(newADate[1]);
          newADate = new Date(newADate[1] - 1, newADate[0]);

          let newBDate = b.date.split('-');
          newBDate[0] = parseInt(newBDate[0]);
          newBDate[1] = parseInt(newBDate[1]);
          newBDate = new Date(newBDate[1] - 1, newBDate[0]);

          return newADate - newBDate;
        });
      }
    },
    addMissingMonthsToChart() {
      let oldestDate = new Date();
      let oldestDateString = '';

      for (let i = 0; i < this.dividendsArray.length; i++) {
        for (let j = 0; j < this.dividendsArray[i].dividend.length; j++) {
          let date = this.dividendsArray[i].dividend[j].date;
          date = date.split('-');
          date[0] = parseInt(date[0]);
          date[1] = parseInt(date[1]);
          let dateObject = new Date(date[1], date[0] - 1);


          if (dateObject < oldestDate) {
            oldestDate = dateObject;
            oldestDateString = this.dividendsArray[i].dividend[j].date;
          }

        }
      }

      // add missing months in between the dividend dates
      for (let i = 0; i < this.dividendsArray.length; i++) {
        if (this.dividendsArray[i].dividend[0].date !== oldestDateString)
          this.dividendsArray[i].dividend.unshift({
            date: oldestDateString,
            amount: 0,
          })

        for (let j = 0; j < this.dividendsArray[i].dividend.length - 1; j++) {
          let date = this.dividendsArray[i].dividend[j].date.split('-');
          date[0] = parseInt(date[0]);
          date[1] = parseInt(date[1]);
          date = new Date(date[1], date[0] - 1);

          let datePlusOneMonth = new Date(date.getFullYear(), date.getMonth() + 1);

          let nextDate = this.dividendsArray[i].dividend[j + 1].date.split('-');
          nextDate[0] = parseInt(nextDate[0]);
          nextDate[1] = parseInt(nextDate[1]);
          nextDate = new Date(nextDate[1], nextDate[0] - 1);

          let datePlusOneMonthString = (datePlusOneMonth.getMonth() + 1) + '-' + datePlusOneMonth.getFullYear();
          if ((datePlusOneMonth.getMonth() + 1) < 10) {
            datePlusOneMonthString = '0' + datePlusOneMonthString;
          }

          if (nextDate > datePlusOneMonth) {
            this.dividendsArray[i].dividend.splice(j + 1, 0, {
              date: datePlusOneMonthString,
              amount: 0,
            });
          }

        }

        let dateList = [];

        for (let j = 0; j < this.dividendsArray[i].dividend.length; j++) {
          let date = this.dividendsArray[i].dividend[j].date;
          dateList.push(date);
        }

        // add potentially missing months untill current month
        let currentMonth =
          new Date().getMonth() + 1 + "-" + new Date().getFullYear();

        if (parseFloat(currentMonth.split('-')[0]) < 10) {
          currentMonth = '0' + currentMonth;
        }

        if (!this.includesFromArray(dateList, currentMonth)) {
          let lastMonthInChart = dateList[dateList.length - 1];
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
            if (pushedMonth < 10) {
              pushedDate = "0" + pushedDate;
            }

            this.dividendsArray[i].dividend.push({
              date: pushedDate,
              amount: 0,
            });
            newLastMonth.setMonth(newLastMonth.getMonth() + 1);
          }


          this.dividendsArray[i].dividend.push({
            date: currentMonth,
            amount: 0,
          });
        }
      }

      // remove duplicate last and second last bug
      this.removeDuplicateBug();
    },
    removeDuplicateBug() {
      for (let i = 0; i < this.dividendsArray.length; i++) {
        if (
          this.dividendsArray[i].dividend[this.dividendsArray[i].dividend.length - 1].date ===
          this.dividendsArray[i].dividend[this.dividendsArray[i].dividend.length - 2].date
        ) {
          this.dividendsArray[i].dividend.pop();
        }
      }
    },
    turnIntoChartData() {
      for (let i = 0; i < this.dividendsArray.length; i++) {
        this.dividendsArray[i].dividendsList = [];
        this.dividendsArray[i].datesList = [];

        for (let j = 0; j < this.dividendsArray[i].dividend.length; j++) {
          this.dividendsArray[i].dividendsList.push(
            this.dividendsArray[i].dividend[j].amount
          );
          this.dividendsArray[i].datesList.push(
            this.dividendsArray[i].dividend[j].date
          );
        }
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

      for (let i = 0; i < this.dividendsArray.length; i++) {
        for (let j = 0; j < this.dividendsArray[i].dividend.length; j++) {
          let dividendYear = parseFloat(this.dividendsArray[i].dividend[j].date.split("-")[1]);

          if (dividendYear < currentYear) {
            this.dividendsArray[i].dividend.splice(j, 1);
            this.dividendsArray[i].datesList.splice(j, 1);
            this.dividendsArray[i].dividendsList.splice(j, 1);
            j--;
          }

        }
      }
    },
    setYears(years) {
      // get one year ago in MM-YYYY
      let currentYear = new Date().getFullYear();
      let currentMonth = new Date().getMonth() + 1;
      let yearAgo = new Date(currentYear - years, currentMonth);

      // delete all months before yearAgo
      for (let i = 0; i < this.dividendsArray.length; i++) {

        for (let j = 0; j < this.dividendsArray[i].dividend.length; j++) {
          let dividendYear = this.dividendsArray[i].dividend[j].date;
          let labelYear = parseFloat(dividendYear.split("-")[1]);
          let labelMonth = parseFloat(dividendYear.split("-")[0]);
          let labelDate = new Date(labelYear, labelMonth - 1);

          if (labelDate < yearAgo || labelDate < yearAgo + 1) {
            this.dividendsArray[i].dividend.splice(j, 1);
            this.dividendsArray[i].datesList.splice(j, 1);
            this.dividendsArray[i].dividendsList.splice(j, 1);
            j--;
          }
        }
      }
    }
  }
}
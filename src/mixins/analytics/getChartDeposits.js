import cleanNumberMixin from '../helpers/cleanNumber';
import includesFromArrayMixin from '../helpers/includesFromArray';

export default {
  mixins: [cleanNumberMixin, includesFromArrayMixin],
  data() {
    return {
      depositsArray: [],
      dataHolder: [],
      labelsHolder: [],
      names: {
        eur: 'EUR',
      }
    }
  },
  computed: {
    indexes() {
      return this.$store.getters['indexes/deposits'];
    },
    depositNames() {
      return this.$store.getters['dictionary/deposit'];
    },
    withdrawalNames() {
      return this.$store.getters['dictionary/withdrawal'];
    },
  },
  methods: {
    getChartDeposits(data) {
      this.getDepositsFromData(data);

      if (this.depositsArray.length > 0) {
        this.sortDepositsByDate();
        this.addMissingMonthsToChart();

        return {
          labels: this.labelsHolder,
          data: this.dataHolder,
        }

      } else {
        return false;
      }
    },
    getDepositsFromData(data) {
      const depositNames = this.depositNames;
      const withdrawalNames = this.withdrawalNames;

      const dateIndex = this.indexes.dateIndex;
      const searchIndex = this.indexes.searchIndex;
      const depositIndex = this.indexes.depositIndex;

      this.depositsArray = [];
      this.labelsHolder = [];
      this.dataHolder = [];

      for (let i = 0; i < data.length; i++) {
        if (data[i][depositIndex]) {
          const validDeposit =
            this.includesFromArray(depositNames, data[i][searchIndex]) &&
            this.cleanNumber(data[i][depositIndex]) > 0;

          const validWithdrawal =
            this.includesFromArray(withdrawalNames, data[i][searchIndex]) &&
            this.cleanNumber(data[i][depositIndex]) < 0;

          if (validDeposit || validWithdrawal) {
            let alreadyExists = false;
            let date = data[i][dateIndex].slice(3, 10);

            let depAmt = this.cleanNumber(data[i][depositIndex]);

            // first time
            if (this.depositsArray.length === 0) {
              this.depositsArray.push({
                date: date,
                depAmt: depAmt,
              });
            } else {
              for (let j = 0; j < this.depositsArray.length; j++) {
                if (this.depositsArray[j].date === date) {
                  this.depositsArray[j].depAmt += depAmt;
                  alreadyExists = true;
                  break;
                }
              }
              if (!alreadyExists) {
                this.depositsArray.push({
                  date: date,
                  depAmt: depAmt,
                });
              }
            }
          }
        }
      }
    },
    sortDepositsByDate() {
      this.depositsArray
        ? this.depositsArray.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        })
        : null;

      let firstDate = this.depositsArray[0].date.split("-");
      let lastDate =
        this.depositsArray[this.depositsArray.length - 1].date.split("-");
      let newFirstDate = new Date(lastDate[1], lastDate[0] - 1);
      let newLastDate = new Date(firstDate[1], firstDate[0]);

      let dateArray = [];
      while (newFirstDate < newLastDate) {
        dateArray.push(newFirstDate.toLocaleDateString());
        newFirstDate.setMonth(newFirstDate.getMonth() + 1);
      }
      this.depositsArray.reverse();

      // fill chart
      for (let i = 0; i < dateArray.length; i++) {
        let date = dateArray[i];
        let found = false;

        // find date in depositsArray, if found add to chart
        for (let x = 0; x < this.depositsArray.length; x++) {
          let dateFromArray = this.splitDate(this.depositsArray[x].date);
          let newDateFromArray = new Date(
            dateFromArray[1],
            dateFromArray[0] - 1
          ).toLocaleDateString();

          if (date === newDateFromArray) {
            found = true;
            let deposit = this.depositsArray[x].depAmt;
            // if first iteration
            if (x !== 0) {
              // add all previous deposits
              for (let y = 0; y < x; y++) {
                deposit += this.depositsArray[y].depAmt;
              }
            }

            this.dataHolder.push(deposit);
          }
        }

        if (!found) {
          this.dataHolder.push(0);
        }

        // where there are no deposits, add previous month's deposits
        for (let y = 0; y < this.dataHolder.length; y++) {
          if (this.dataHolder[y] === 0) {
            this.dataHolder[y] = this.dataHolder[y - 1];
          }
        }

        // date to month and year only
        date = this.splitDate(date);

        // if american notation
        if (dateArray.length > 1) {
          if (
            this.splitDate(dateArray[1])[0] !==
            this.splitDate(dateArray[0])[0]
          ) {
            date = date[0] + "-" + date[2];
          } else {
            // if normal notation
            date = date[1] + "-" + date[2];
          }
          // second check, less reliable than first (if starts in jan can be inaccurate)
        } else {
          if (this.splitDate(dateArray[0])[0] == 1) {
            date = date[1] + "-" + date[2];
          } else {
            date = date[0] + "-" + date[2];
          }
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

          this.dataHolder.push(this.dataHolder[this.dataHolder.length - 1]);
        }
        this.dataHolder.push(this.dataHolder[this.dataHolder.length - 1]);
        this.labelsHolder.push(currentMonth);
      }

      // add potentially missing months untill current month
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
    countFromZero(prevTotal) {
      const diff = prevTotal - this.dataHolder[0];
      const firstDate = this.dataHolder[0];
      for (let i = 0; i < this.dataHolder.length; i++) {
        const currentDate = this.dataHolder[i];
        this.dataHolder[i] = currentDate - firstDate - diff;
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

      let total = 0;

      // delete all deposits before this year
      for (let i = 0; i < this.depositsArray.length; i++) {
        let depositYear = this.depositsArray[i].date.split("-")[1];
        if (depositYear < currentYear) {
          total += this.depositsArray[i].depAmt;
          this.depositsArray.splice(i, 1);
          i--;
        }
      }

      this.countFromZero(total);
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
      for (let i = 0; i < this.depositsArray.length; i++) {
        let depositYear = this.depositsArray[i].date.split("-")[1];
        let depositMonth = this.depositsArray[i].date.split("-")[0];
        let depositDate = new Date(depositYear, depositMonth - 1);

        if (depositDate < yearAgo || depositDate < yearAgo + 1) {
          this.depositsArray.splice(i, 1);
          i--;
        }
      }
    },
  }
}
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
      // lees de data uit en pak de deposits er uit
      this.getDepositsFromData(data);
      
      // als er deposits zijn, sorteer ze op datum en voeg missende maanden toe
      if (this.depositsArray.length > 0) {
        this.sortDepositsByDate();
        this.addMissingMonthsToChart();

        return {
          labels: this.labelsHolder,
          data: this.dataHolder,
        }

      } else {
        // als er geen deposits zijn, retourneer false
        return false;
      }
    },
    getDepositsFromData(data) {
      // de namen die we uit de data willen halen
      const depositNames = this.depositNames;
      const withdrawalNames = this.withdrawalNames;

      // de array indexen waar alle relevante data te vinden is
      const dateIndex = this.indexes.dateIndex;
      const searchIndex = this.indexes.searchIndex;
      const depositIndex = this.indexes.depositIndex;

      // leeg de data
      this.depositsArray = [];
      this.labelsHolder = [];
      this.dataHolder = [];

      // loop door de data heen en pak de deposits er uit
      for (let i = 0; i < data.length; i++) {
        // als er data bestaat op de deposits index
        if (data[i][depositIndex]) {
          // valide deposit
          const validDeposit =
            this.includesFromArray(depositNames, data[i][searchIndex]) &&
            this.cleanNumber(data[i][depositIndex]) > 0;
          // valide withdrawal
          const validWithdrawal =
            this.includesFromArray(withdrawalNames, data[i][searchIndex]) &&
            this.cleanNumber(data[i][depositIndex]) < 0;
          
          // checkt voor de valide variabelen hierboven
          if (validDeposit || validWithdrawal) {
            let alreadyExists = false;
            let date = data[i][dateIndex].slice(3, 10);
            
            // maak de data schoon
            let depAmt = this.cleanNumber(data[i][depositIndex]);

            // first time
            if (this.depositsArray.length === 0) {
              this.depositsArray.push({
                date: date,
                depAmt: depAmt,
              });
            } else {
              // als de depositsArray langer is dan nul
              // loop door de depositsArray heen en check of de date al bestaat
              for (let j = 0; j < this.depositsArray.length; j++) {
                if (this.depositsArray[j].date === date) {
                  // als de date al bestaat, voeg de depAmt toe aan deze date
                  this.depositsArray[j].depAmt += depAmt;
                  // zet de boolean op true voor de volgende check
                  alreadyExists = true;
                  break;
                }
              }
              if (!alreadyExists) {
                // als de date nog niet bestaat, voeg de nieuwe date toe aan de depositsArray
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
      // sorteert op datum als depositsArray bestaat
      this.depositsArray
        ? this.depositsArray.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        })
        : null;

      // de vieze datums uit de array
      let firstDate = this.depositsArray[0].date.split("-");
      let lastDate =
        this.depositsArray[this.depositsArray.length - 1].date.split("-");
      // maak schone date objecten van de vieze datums
      let newFirstDate = new Date(lastDate[1], lastDate[0] - 1);
      let newLastDate = new Date(firstDate[1], firstDate[0]);

      // zolang de eerste datum kleiner is dan de laatste datum, voeg deze toe aan de dateArray
      // en voeg steeds een maand toe aan de datum
      let dateArray = [];
      while (newFirstDate < newLastDate) {
        dateArray.push(newFirstDate.toLocaleDateString());
        newFirstDate.setMonth(newFirstDate.getMonth() + 1);
      }
      // reverse de dateArray om de datums in de juiste volgorde te hebben
      this.depositsArray.reverse();

      // fill chart
      for (let i = 0; i < dateArray.length; i++) {
        let date = dateArray[i];
        let found = false;

        // zoek datum in depositsArray, als die bestaat voeg hem toe aan de chart
        for (let x = 0; x < this.depositsArray.length; x++) {
          let dateFromArray = this.splitDate(this.depositsArray[x].date);
          let newDateFromArray = new Date(
            dateFromArray[1],
            dateFromArray[0] - 1
          ).toLocaleDateString();

          if (date === newDateFromArray) {
            found = true;
            let deposit = this.depositsArray[x].depAmt;
            // eerste keer
            if (x !== 0) {
              // voeg alle vorige deposits toe
              for (let y = 0; y < x; y++) {
                deposit += this.depositsArray[y].depAmt;
              }
            }

            this.dataHolder.push(deposit);
          }
        }

        // als de datum niet gevonden is, voeg een nul toe aan de data
        if (!found) {
          this.dataHolder.push(0);
        }

        // waar er geen deposits zijn, voeg de vorige maand toe aan de chart
        // dit wordt gedaan om een vloeiende lijn te krijgen
        for (let y = 0; y < this.dataHolder.length; y++) {
          if (this.dataHolder[y] === 0) {
            this.dataHolder[y] = this.dataHolder[y - 1];
          }
        }

        // datum naar -> maand en jaar
        date = this.splitDate(date);

        if (dateArray.length > 1) {
          // data manipulatie voor de amerikaanse datum notatie
          // hier uit komt een normale datum met '-'
          if (
            this.splitDate(dateArray[1])[0] !==
            this.splitDate(dateArray[0])[0]
          ) {
            date = date[0] + "-" + date[2];
          } else {
            // bij normale notatie
            date = date[1] + "-" + date[2];
          }
          // tweede check, minder betrouwbaar dan eerste (als start in januari kan het onnauwkeurig zijn)
        } else {
          if (this.splitDate(dateArray[0])[0] == 1) {
            date = date[1] + "-" + date[2];
          } else {
            date = date[0] + "-" + date[2];
          }
        }

        this.labelsHolder.push(date);
      }
      // einde for loop
    },
    addMissingMonthsToChart() {
      // voeg potentiele ontbrekende maanden toe tot de huidige maand
      let currentMonth =
        new Date().getMonth() + 1 + "-" + new Date().getFullYear();

      // als huidige maand niet in labelsHolder staat, voeg hem toe
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

      // let total = 0;

      // delete all deposits before this year
      for (let i = 0; i < this.depositsArray.length; i++) {
        let depositYear = this.depositsArray[i].date.split("-")[1];
        if (depositYear < currentYear) {
          // total += this.depositsArray[i].depAmt;
          this.depositsArray.splice(i, 1);
          i--;
        }
      }

      // this.countFromZero(total);
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

      // delete all deposits of more than one year ago
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
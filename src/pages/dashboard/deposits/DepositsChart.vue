<template>

    <section class="depositChartContainer">
        <!-- time frame -->
        <section class="timeFrame">
            
            <!-- radios -->
            <section class="timeFrame__buttons">
                <button 
                    @click="timeFrameChange" 
                    :class="{ btnActive : selectedTimeFrame == timeFrameOptions.allTime }" 
                    class="timeFrame__btn">{{timeFrameOptions.allTime}}
                </button>
                <button 
                    @click="timeFrameChange" 
                    :class="{ btnActive : selectedTimeFrame == timeFrameOptions.yearToDate }" 
                    class="timeFrame__btn">{{timeFrameOptions.yearToDate}}
                </button>
                <button 
                    @click="timeFrameChange" 
                    :class="{ btnActive : selectedTimeFrame == timeFrameOptions.oneYear }" 
                    class="timeFrame__btn">{{timeFrameOptions.oneYear}}
                </button>
                <button 
                    @click="timeFrameChange" 
                    :class="{ btnActive : selectedTimeFrame == timeFrameOptions.threeYears }" 
                    class="timeFrame__btn">{{timeFrameOptions.threeYears}}
                </button>
                <button 
                    @click="timeFrameChange" 
                    :class="{ btnActive : selectedTimeFrame == timeFrameOptions.fiveYears }" 
                    class="timeFrame__btn">{{timeFrameOptions.fiveYears}}
                </button>
                <!-- <button class="timeFrame__btn" id="js--timeFrame__btn--pastThreeYears">3 Years</button>
                <button class="timeFrame__btn" id="js--timeFrame__btn--pastFiveYears">5 Years</button> -->
            </section>
        </section>
     
        <section class="depositChartWrapper">
            <section class="depositChartHeading">
                <h2>Deposits & Withdrawals <span class="chartDataTypeStyling">| Cumulative</span></h2>
                <transition name="slide-fade" mode="out-in">
                    <p :key="selectedTimeFrame">
                        <span class="chartResultValue">
                        €{{ totalDeposits }}
                        </span>
                    </p>
                </transition>
            </section>

            <p class="chartErrorMsg" v-if="chartErrorMsg">
                {{ chartErrorMsg }}
            </p>
            <section class="depositChart" v-else>
                <LineChart v-if="!isLoading" 
                    :chart-data="chartData"  
                /> 
                <section class="spinnerContainer" v-else>
                    <spinner/>
                </section>
            </section>
    
        </section>
    </section>
</template>
<script>
import LineChart from '../../../components/ui/LineChart.vue'

import cleanNumberMixin from '../../../mixins/cleanNumber';
import includesFromArrayMixin from '../../../mixins/includesFromArray';
import splitDateMixin from '../../../mixins/splitDate';


export default {
    mixins: [cleanNumberMixin, includesFromArrayMixin, splitDateMixin],
    components: {
        LineChart
    },
    data() {
        return {
            isLoading: true,
            selectedTimeFrame: 'All Time',
            depositsArray: [],
            chartErrorMsg: null,
            dataHolder: [],
            labelsHolder: [],
            timeFrameOptions: {
                'allTime': 'All Time',
                'yearToDate': 'YTD',
                'oneYear': '1 Year',
                'threeYears': '3 Years',
                'fiveYears': '5 Years',
            }, 
            chartData: {
                labels: [],
                datasets: [{
                    data: [],
                    fill: true,
                    borderColor: "#0084ff",
                    backgroundColor: "red",
                    borderWidth: 2,
                    cubicInterpolationMode: 'monotone',
                }]
            }, 
        }
    },
    computed: {
        indexes() {
            return this.$store.getters['indexes/deposits'];
        },
        depositNames() {
            return this.$store.getters['dictionary/deposit'];
        },
        failedDepositNames() {
            return this.$store.getters['dictionary/failedDeposit'];
        },
        withdrawalNames() {
            return this.$store.getters['dictionary/withdrawal'];
        },
        currentPortfolio() {
            return this.$store.getters['files/getCurrentPortfolio'];
        },
        totalDeposits() {
            let total = 0;
            for(let i = 0; i < this.depositsArray.length; i++) {
                total += this.depositsArray[i].depAmt;
            }
            total = total.toFixed(2);
            total = parseFloat(total).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
            return total;
        },
        isThereData() {
            return !!this.currentPortfolio.accountFile;
        }
    },
    watch: {
        isThereData() {
            this.loadData();
        }
    },
    methods: {
        setTheme() {
            const theme = localStorage.getItem('theme');
            if(theme === 'dark') {
                this.chartData.datasets[0].backgroundColor = '#223443';
                this.chartData.datasets[0].borderColor = '#0084ff';
            } else {
                this.chartData.datasets[0].backgroundColor = '#e1f1fb';
                this.chartData.datasets[0].borderColor = '#0091ff';
            }
        },
        loadData() {
            if(this.isThereData) {
                this.getDeposits();
                this.isLoading = false;
            } else {
                this.isLoading = true;
            } 
        },
        timeFrameChange(e) {
            this.selectedTimeFrame = e.target.innerText
            this.isThereData ? this.getDeposits() : null;
            this.timeFrameDataUpdate();
        },
        getDeposits() {
            const depositNames = this.depositNames;
            const withdrawalNames = this.withdrawalNames;

            const data = this.currentPortfolio.accountFile;
            const dateIndex = this.indexes.dateIndex;
            const searchIndex = this.indexes.searchIndex;
            const depositIndex = this.indexes.depositIndex;

            this.depositsArray = [];
            this.labelsHolder = [];
            this.dataHolder = [];

            
            for(let i = 0; i < data.length; i++) {

                if(data[i][depositIndex]) {
                    const validDeposit = 
                        (this.includesFromArray(depositNames, data[i][searchIndex]) &&
                        this.cleanNumber(data[i][depositIndex]) > 0);

                    const validWithdrawal = 
                        (this.includesFromArray(withdrawalNames, data[i][searchIndex]) &&
                        this.cleanNumber(data[i][depositIndex]) < 0);

                    if(validDeposit || validWithdrawal) {
                        let alreadyExists = false;
                        let date = data[i][dateIndex].slice(3, 10);

                        let depAmt = this.cleanNumber(data[i][depositIndex]);

                        // first time
                        if(this.depositsArray.length === 0) {
                            this.depositsArray.push({
                                date: date,
                                depAmt: depAmt
                            });
                        } else {
                            for(let j = 0; j < this.depositsArray.length; j++) {
                                if(this.depositsArray[j].date === date) {
                                    this.depositsArray[j].depAmt += depAmt;
                                    alreadyExists = true;
                                    break;
                                }
                            }
                            if(!alreadyExists) {
                                this.depositsArray.push({
                                    date: date,
                                    depAmt: depAmt
                                });
                            }
                        }
                    }
                }
                

            }

            if(this.depositsArray.length > 0) {

                this.depositsArray ? this.depositsArray.sort((a, b) => {
                    return new Date(a.date) - new Date(b.date);
                }) : null;

                let firstDate = this.depositsArray[0].date.split('-');
                let lastDate = this.depositsArray[this.depositsArray.length - 1].date.split('-');
                let newFirstDate = new Date(lastDate[1], lastDate[0] - 1);
                let newLastDate = new Date(firstDate[1], firstDate[0]);

                let dateArray = [];
                while(newFirstDate < newLastDate) {
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
                        let newDateFromArray = new Date(dateFromArray[1], dateFromArray[0] -1).toLocaleDateString();

                        if (date === newDateFromArray) {
                            found = true;
                            let deposit = this.depositsArray[x].depAmt;
                            // if first iteration
                            if(x !== 0) {
                                // add all previous deposits
                                for(let y = 0; y < x; y++) {
                                    deposit += this.depositsArray[y].depAmt;
                                }
                            }
                            
                            this.dataHolder.push(deposit);
                        } 
                    }

                    if(!found) {
                        this.dataHolder.push(0);
                    }

                    // where there are no deposits, add previous month's deposits
                    for(let y = 0; y < this.dataHolder.length; y++) {
                        if(this.dataHolder[y] === 0) {
                            this.dataHolder[y] = this.dataHolder[y-1];
                        }
                    }
                

                    // date to month and year only
                    date = this.splitDate(date);

                    // if american notation
                    if(dateArray.length > 1) {
                        if(this.splitDate(dateArray[1])[0] !== this.splitDate(dateArray[0])[0]) {
                        date = date[0] + "-" + date[2];
                        } else {
                            // if normal notation
                            date = date[1] + "-" + date[2];
                        }
                    // second check, less reliable than first (if starts in jan can be inaccurate)
                    } else {
                        if(this.splitDate(dateArray[0])[0] == 1) {
                            date = date[1] + "-" + date[2];
                        } else {
                            date = date[0] + "-" + date[2];
                        }
                    }
                    

                    this.labelsHolder.push(date)           
                }

            
                this.addMissingMonthsToChart();

                this.chartData.labels = this.labelsHolder;
                this.chartData.datasets[0].data = this.dataHolder;
            } else {
                this.chartData.labels = [];
                this.chartData.datasets[0].data = [];

                this.chartErrorMsg = "Unfortunately, your language isn't supported yet. Please contact us to include your language for you and your country.";
            }

        },
        addMissingMonthsToChart() {
            // add potentially missing months untill current month
            
            let currentMonth = new Date().getMonth() + 1 + "-" + new Date().getFullYear();
            if (!this.includesFromArray(this.labelsHolder, currentMonth)) {            
                let lastMonthInChart = this.labelsHolder[this.labelsHolder.length - 1];
                let lastMonth = this.splitDate(lastMonthInChart);
                let newLastMonth = new Date(lastMonth[1], lastMonth[0]);
                let newCurrentMonth = new Date(currentMonth.split("-")[1], currentMonth.split("-")[0] - 1);
                let firstiteration = true;

                while (newLastMonth <= newCurrentMonth) {   
                    firstiteration ? newLastMonth = new Date(newLastMonth.getFullYear(), newLastMonth.getMonth() + 1) : null;       
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

            // remove duplicate last and second last bug
            if(this.labelsHolder[this.labelsHolder.length-1] === this.labelsHolder[this.labelsHolder.length-2]) {
                this.labelsHolder.pop();
            }
        },
        timeFrameDataUpdate() {
            // timeframes other than All-time
            if (this.selectedTimeFrame === this.timeFrameOptions.yearToDate) {
                this.setYearToDateData();
            } else if (this.selectedTimeFrame === this.timeFrameOptions.oneYear) {
                this.setYearDate(1);
            } else if (this.selectedTimeFrame === this.timeFrameOptions.threeYears) {
                this.setYearDate(3);
            } else if (this.selectedTimeFrame === this.timeFrameOptions.fiveYears) {
                this.setYearDate(5);
            }

            this.updateChart();

          
        },
        setYearToDateData() {
            // delete all months before this year
            let currentYear = new Date().getFullYear();
            for(let i = 0; i < this.labelsHolder.length; i++) {
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
        setYearDate(years) {
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
        updateChart() {
            this.chartData.labels = this.labelsHolder;
            this.chartData.datasets[0].data = this.dataHolder;
        },
        countFromZero(prevTotal) {
            const diff = prevTotal - this.dataHolder[0];
            const firstDate = this.dataHolder[0];
            for(let i = 0; i < this.dataHolder.length; i++) {
                const currentDate = this.dataHolder[i];
                this.dataHolder[i] = currentDate - firstDate - diff;
            }
        }
    },
    created() {
        this.loadData();
        this.setTheme();
    }
  
}
</script>

<style scoped>
h2 {
    color: var(--clr-dark-grey);
}

.chartDataTypeStyling {
    color: var(--clr-grey);
    font-weight: 300;
}

.chartErrorMsg {
    margin-top: 2rem;
    margin-bottom: 2rem;
    color: var(--clr-blue);
}

.spinnerContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.depositChartWrapper {
    padding: 2rem;
    padding-bottom: 0.1rem;
    background-color: var(--clr-very-light-blue);
    border-radius: var(--card-border-radius);
    box-shadow: var(--box-shadow-big);
    border: 1px solid var(--clr-very-light-grey);
}

.depositChartContainer {
    margin-bottom: 3rem;
}

.depositChartHeading {
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.depositChartHeading p {
    text-align: right;
}

.depositChart {
    width: 100%;
    height: 20rem;
    background-color: var(--clr-very-light-blue);
    border-radius: 0rem;
    margin-bottom: 1.5rem;
}

.noDataMsg {
    text-align: center;
    color: var(--clr-blue);
    margin-top: 6rem;
    margin-bottom: 2rem;
}

.chartResultValue {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--clr-blue);
}

.timeFrame__buttons {
    margin-bottom: 0.5rem;
    display: flex;
}

.timeFrame__btn {
    padding: 0.6rem 0.85rem;
    font-weight: 600;
    font-size: 0.85rem;
    margin-right: 0.5rem;
    background-color: var(--clr-very-light-blue);
    color: var(--clr-grey);
    transform: translateY(0px);
    border:1px solid var(--clr-medium-light-grey);
    border-radius: var(--btn-radius);
    user-select: none;
    box-shadow: var(--btn-shadow);
    
}


.timeFrame__btn:hover {
    cursor: pointer;
}

.btnActive {
    background-color: var(--clr-very-light-blue);
    color: var(--clr-blue);
    transform: translateY(0px);
    font-weight: 600;
    border: 1px solid var(--clr-blue);
}

/* anims */
.slide-fade-enter-active {
  transition: all .15s ease-out;
}
.slide-fade-leave-active {
  transition: all .15s ease-in;
}
.slide-fade-enter-from {
  transform: translateY(-15px);
  opacity: 0;
}

.slide-fade-leave-to {
    transform: translateY(15px);
    opacity: 0;
}

@media screen and (max-width: 550px) {
    .timeFrame__buttons {
        overflow-x: scroll;
    }

    .timeFrame__btn {
        min-width: 6rem;
    }
    
}
</style>
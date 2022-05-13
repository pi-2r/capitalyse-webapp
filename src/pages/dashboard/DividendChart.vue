<template>

    <section class="dividendChartContainer">
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
                <!-- <button class="timeFrame__btn" id="js--timeFrame__btn--pastThreeYears">3 Years</button>
                <button class="timeFrame__btn" id="js--timeFrame__btn--pastFiveYears">5 Years</button> -->
            </section>
        </section>
     
        <section class="dividendChartWrapper">
            <section class="dividendChartHeading">
                <h2>Dividend Payments</h2>
                <transition name="slide-fade" mode="out-in">
                    <p :key="selectedTimeFrame">
                        <span class="chartResultValue greenNumber">
                        €{{ totalDividends }}
                        </span>
                    </p>
                </transition>
            </section>

            <p class="chartErrorMsg" v-if="chartErrorMsg">
                {{ chartErrorMsg }}
            </p>
            <section class="dividendChart" v-else>
                <BarChart v-if="!isLoading" 
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
import BarChart from '../../components/ui/BarChart.vue'

import cleanNumberMixin from '../../mixins/cleanNumber';
import includesFromArrayMixin from '../../mixins/includesFromArray';
import splitDateMixin from '../../mixins/splitDate';

export default {
    mixins: [cleanNumberMixin, includesFromArrayMixin, splitDateMixin],
    components: {
        BarChart
    },
    data() {
        return {
            isLoading: true,
            selectedTimeFrame: 'All Time',
            dividendsArray: [],
            chartErrorMsg: null,
            dataHolder: [],
            labelsHolder: [],
            timeFrameOptions: {
                'allTime': 'All Time',
                'yearToDate': 'YTD',
                'oneYear': '1 Year',
            }, 
            chartData: {
                labels: [],
                datasets: [
                    {
                        label: 'Dividends Received',
                        backgroundColor: "#e1f1fb",
                        borderWidth: 2,
                        borderRadius: 7,
                        borderSkipped: 'bottom',
                        borderColor: '#0091ff',
                        hoverBorderWidth: 2,
                        hoverBorderColor: '#0091ff',
                        data: []
                    }
                ]
            }, 
        }
    },
    computed: {
        indexes() {
            return this.$store.getters['indexes/dividendChart'];
        },
        dividendNames() {
            return this.$store.getters['dictionary/dividend'];
        },
        currencyNames() {
            return this.$store.getters['dictionary/currency'];
        },
        currentPortfolio() {
            return this.$store.getters['files/getCurrentPortfolio'];
        },
        totalDividends() {
            let total = 0;
            for(let i = 0; i < this.dividendsArray.length; i++) {
                total += this.dividendsArray[i].divAmt;
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
            console.log(theme);
            if(theme === 'dark') {
                this.chartData.datasets[0].backgroundColor = '#25343f';
                this.chartData.datasets[0].borderColor = '#0084ff';
            } else {
                this.chartData.datasets[0].backgroundColor = '#e1f1fb';
                this.chartData.datasets[0].borderColor = '#0091ff';
                this.chartData.datasets[0].hoverBorderColor = '#0091ff';
            }

            console.log(this.chartData);
        },
        loadData() {
            if(this.isThereData) {
                this.getDividends();
                this.isLoading = false;
            } else {
                this.isLoading = true;
            } 
        },
        timeFrameChange(e) {
            this.selectedTimeFrame = e.target.innerText
            this.isThereData ? this.getDividends() : null;
            this.timeFrameDataUpdate();
        },
        getDividends() {
            const data = this.currentPortfolio.accountFile;
            const dateIndex = this.indexes.dateIndex;
            const searchIndex = this.indexes.searchIndex;
            const currencyIndex = this.indexes.currencyIndex;
            const productIndex = this.indexes.productIndex;
            const dividendIndex = this.indexes.dividendIndex;
            const dividendNames = this.dividendNames;
            const currencyNames = this.currencyNames;

            this.dividendsArray = [];
            this.dataHolder = [];
            this.labelsHolder = [];

            for(let i = 0; i < data.length - 1; i++) {
                const validDividend = 
                    this.includesFromArray(dividendNames, data[i][searchIndex]) &&
                    data[i][currencyIndex] === "EUR" ||
                    this.includesFromArray(currencyNames, data[i][searchIndex]) &&
                    data[i][currencyIndex] === "EUR" &&
                    data[i][productIndex] === "";

                if(validDividend) {
                    let alreadyExists = false;
                    let date = data[i][dateIndex].slice(3, 10);
                    
                    let divAmt = this.cleanNumber(data[i][dividendIndex]);

                    // first time
                    if(this.dividendsArray.length === 0) {
                        this.dividendsArray.push({
                            date: date,
                            divAmt: divAmt,
                        });
                    } else {
                        // if already exists, find and add to existing
                        for(let j = 0; j < this.dividendsArray.length; j++) {
                            if(this.dividendsArray[j].date === date) {
                                this.dividendsArray[j].divAmt += divAmt;
                                alreadyExists = true;
                                break;
                            }
                        }
                        // if doesnt already exists, add new
                        if(!alreadyExists) {
                            this.dividendsArray.push({
                                date: date,
                                divAmt: divAmt,
                            });
                        }
                    }
                }
            }
            
            if(this.dividendsArray.length > 0) {
                // sort array by date if exists
                this.dividendsArray ? this.dividendsArray.sort((a, b) => {
                    return new Date(b.date) - new Date(a.date);
                }) : null;

                let firstDate = this.dividendsArray[0].date.split("-");
                let lastDate = this.dividendsArray[this.dividendsArray.length - 1].date.split("-");
                let newFirstDate = new Date(lastDate[1], lastDate[0]  -1)
                let newLastDate = new Date(firstDate[1], firstDate[0])

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
                        let dateFromArray = this.dividendsArray[x].date.split("-");
                        let newDateFromArray = new Date(dateFromArray[1], dateFromArray[0] -1).toLocaleDateString();

                        if (date === newDateFromArray) {
                            found = true;
                            let dividend = this.dividendsArray[x].divAmt;
                            this.dataHolder.push(dividend);
                        } 
                    }
            
                    // if not found push 0 aka null
                    if(!found) {
                        this.dataHolder.push(null);
                    }

                    // date to month and year only
                    date = this.splitDate(date);
                    date = date[1] + "-" + date[2];
                    this.labelsHolder.push(date)           
                }
            
                this.addMissingMonthsToChart();

                this.chartData.labels = this.labelsHolder;
                this.chartData.datasets[0].data = this.dataHolder;
            } else {
                this.chartData.labels = [];
                this.chartData.datasets[0].data = [];

                this.chartErrorMsg = "You haven't received any dividends yet.";
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
                }
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
                this.setOneYearData();
            }

            this.updateChart();

            // } else if (this.selectedTimeFrame === "threeyears") {
            //     console.log("threeyears");
            // } else if (this.selectedTimeFrame === "fiveyears") {
            //     console.log("fiveyears");
            // }
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
            // delete all dividends before this year
            for (let i = 0; i < this.dividendsArray.length; i++) {
                let dividendYear = this.dividendsArray[i].date.split("-")[1];
                if (dividendYear < currentYear) {
                    this.dividendsArray.splice(i, 1);
                    i--;
                }
            }
        },
        setOneYearData() {
            // get one year ago in MM-YYYY
            let currentYear = new Date().getFullYear();
            let currentMonth = new Date().getMonth() + 1;
            let yearAgo = new Date(currentYear - 1, currentMonth);

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
        },
        updateChart() {
            this.chartData.labels = this.labelsHolder;
            this.chartData.datasets[0].data = this.dataHolder;
        },
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

.dividendChartWrapper {
    padding: 2rem;
    padding-bottom: 0.1rem;
    background-color: var(--clr-very-light-blue);
    border-top-right-radius: var(--card-border-radius);
    border-bottom-left-radius: var(--card-border-radius);
    border-bottom-right-radius: var(--card-border-radius);
    box-shadow: var(--box-shadow-big);
}

.dividendChartContainer {
    margin-bottom: 2rem;
}

.dividendChartHeading {
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.dividendChartHeading p {
    text-align: right;
}

.dividendChart {
    width: 100%;
    height: 20rem;
    background-color: var(--clr-very-light-blue);
    border-radius: 0rem;
    margin-bottom: 2rem;
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
}

.timeFrame__btn {
    padding: 0.7rem 1.4rem;
    font-weight: 600;
    font-size: 1rem;
    margin-right: 0.25rem;
    background-color: var(--clr-light-blue);
    color: var(--clr-blue);
    transform: translateY(0px);
    border:none;
    border-radius: 0px;
    border-top-left-radius: var(--btn-radius);
    border-top-right-radius: var(--btn-radius);
    user-select: none;
}


.timeFrame__btn:hover {
    cursor: pointer;
    box-shadow: none;
    background-color: var(--clr-very-light-blue);
    color: var(--clr-blue);
    transform: translateY(0px);
}

.btnActive {
    background-color: var(--clr-very-light-blue);
    color: var(--clr-blue);
    transform: translateY(0px);
}

/* anims */
.slide-fade-enter-active {
  transition: all 0.15s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.15s ease-in;
}
.slide-fade-enter-from {
  transform: translateY(-15px);
  opacity: 0;
}

.slide-fade-leave-to {
    transform: translateY(15px);
    opacity: 0;
}


</style>
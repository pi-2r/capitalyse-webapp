<template>
    <section class="dividendChartContainer">
        <!-- time frame -->
                <section class="timeFrame">
                   
                    <!-- radios -->
                    <section class="timeFrame__buttons">
                        <button class="timeFrame__btn timeFrame__btn--active">All Time</button>
                        <button class="timeFrame__btn">YTD</button>
                        <button class="timeFrame__btn">1 Year</button>
                        <!-- <button class="timeFrame__btn" id="js--timeFrame__btn--pastThreeYears">3 Years</button>
                        <button class="timeFrame__btn" id="js--timeFrame__btn--pastFiveYears">5 Years</button> -->
                    </section>
                </section>
                
                <section class="dividendChartWrapper">
                    <section class="dividendChartHeading">
                        <h2>Dividend Payments</h2>
                        <p>
                            <span class="chartResultValue greenNumber">
                            €{{ totalDividends }}
                            </span>
                        </p>
                    </section>
                    <!-- <p>Enter your files to see the chart.</p> -->
                    <section class="dividendChart">
                        <BarChart 
                            :chart-data="chartData"
                            :chart-options="chartOptions"
                            :chart-id="chartId"
                            :dataset-id-key="datasetIdKey"
                            :css-classes="cssClasses"
                            :styles="styles"
                            :width="width"
                            :height="height"
                        /> 
                    
                    </section>
                </section>
    </section>
</template>

<script>
export default {
    data() {
        return {
            totalDividends: 0,
            chartData: {
                labels: [ ],
                datasets: [{
                    label: 'Dividends Received (EUR)',
                    data: [],
                    backgroundColor: "#e1f1fb",
                    borderWidth: 2,
                    borderRadius: 5,
                }],
            },
            chartOptions: {
                legend: {
               
                    position: 'bottom',
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                    x: {
                        beginAtZero: true,
                    },
                    
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                animation: {
                    duration: 0,
                },
                responsiveAnimationDuration: 0,
                responsive: true,
                maintainAspectRatio: false,
            },
            chartId: 'dividend-chart',
            datasetIdKey: 'label',
            width: 0,
            height: 300,
            cssClasses: '',
            styles: {},
            plugins: {},
        };
    },
}
</script>

<style scoped>


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



.chartResultValue {
    font-size: 1.5rem;
    font-weight: 500;
}

.timeFrame__btn {
    padding: 0.7rem 1.4rem;
    font-weight: 600;
    font-size: 1rem;
    margin-right: 0.25rem;
    background-color: var(--clr-light-blue);
    color: var(--clr-blue);
    transform: translateY(2px);
    border:none;
    border-radius: 0px;
    border-top-left-radius: var(--btn-radius);
    border-top-right-radius: var(--btn-radius);
}

.timeFrame__btn:hover {
    cursor: pointer;
    box-shadow: none;
    background-color: var(--clr-very-light-blue);
    color: var(--clr-blue);
    transform: translateY(0px);
}

.timeFrame__btn--active {
    background-color: var(--clr-very-light-blue);
    color: var(--clr-blue);
    transform: translateY(0px);
}
</style>
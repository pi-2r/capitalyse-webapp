<template>
<transition name="fade" mode="out-in">
  <Line :key="chartData.datasets[0].data"
    :chart-options="chartOptions"
    :chart-data="chartData"

    :width="width"
    :height="height"
  />
</transition>
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

export default {
  name: 'LineChart',
  components: { Line },
  data() {
    return {
        chartOptions: {
            scales: {
                yAxes: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.125)',
                        drawBorder: false,
                        borderDash: [4, 5],
                        display: true,
                    },
                    ticks: {
                        color: '#000',
                        callback: function(value) {
                        value = value.toFixed(2);
                        value = parseFloat(value);
                        // if more than 1000 change to k
                        if (value >= 1000) {
                            value = value / 1000 + 'K';
                        } else if (value >= 1000000) {
                            value = value / 1000000 + 'M';
                        }
                        return '€' + value.toString().replace('.', ",");
                        }
                    },
                    stacked: true,
                },
                xAxes: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.08)',
                        drawBorder: false,
                        display: false,
                    },
                    ticks: {
                        color: '#fff',
                    }
                },
            },
            animation: {
                duration: 950,
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    position: 'nearest',
                    mode: 'index',
                    intersect: false,
                    caretPadding: 5,
                    usePointStyle: true,
                    cornerRadius: 5,
                    displayColors: false,
                    titleFont: {weight: 'normal'},
                    titleColor: 'grey',
                    bodyColor: 'grey',
                    backgroundColor: 'rgb(260, 260, 260)',
                    borderColor: 'grey',
                    borderWidth: 1,
                    padding: 10,
                    enabled: true,
                    callbacks: {
                        title: function(value) {
                            const date = value[0].label;
                            const year = date.split('-')[1];
                            const month = date.split('-')[0];
                            const arrayOfMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                            return 'Date: ' + arrayOfMonths[month - 1] + ' ' + year;
                        },
                        label: function(value) {
                           return 'Total: €' + value.formattedValue; 
                        }
                    }
                }
            },
            elements: {
              point:{
                radius: 0
              },
            },
            responsive: true,
            maintainAspectRatio: false,
        } 
    }
  },
  props: {
    chartData: {
        required: true,
        type: Object,
        default: () => {
            return {
                labels: [],
                datasets: []
            }
        } 
    },
    height: {
      required: false,
      type: Number,
      default: 300
    },
    width: {
      required: false,
      type: Number,
      default: 400
    }
  },
  methods: {
    setTheme() {
      // pak de theme van localstorage en zet geef de juiste theme aan de chart
      const theme = localStorage.getItem('theme')

      if(theme === 'dark') {
        this.chartOptions.scales.yAxes.ticks.color = 'rgb(134, 134, 134)';
        this.chartOptions.scales.xAxes.ticks.color = 'rgb(134, 134, 134)';
        this.chartOptions.scales.yAxes.grid.color = 'rgb(67, 67, 67)';
        this.chartOptions.scales.xAxes.grid.color = 'rgb(67, 67, 67)';
        this.chartOptions.plugins.tooltip.backgroundColor = 'rgb(52, 52, 52)';
      } else {
        this.chartOptions.scales.yAxes.ticks.color = 'rgba(0, 0, 0, 0.5)';
        this.chartOptions.scales.xAxes.ticks.color = 'rgba(0, 0, 0, 0.5)';
      }
    }
  },
  created() {
    this.setTheme();
  }
  
}
</script>

<style scoped>
.fade-enter-active {
  transition: all .15s ease-out;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
    opacity: 0;
}

</style>
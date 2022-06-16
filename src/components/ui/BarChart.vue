<template>
<transition name="fade" mode="out-in">
  <Bar :key="chartData.datasets[0].data"
    :chart-options="chartOptions"
    :chart-data="chartData"

    :width="width"
    :height="height"
  />
</transition>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  data() {
    return {
      chartOptions: {
        scales: {
          yAxes: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.6)',
                drawBorder: false,
                display: false,
              },
              ticks: {
                color: '#fff',
                callback: function(value) {
                  // replace dot with comma
                  return '€' + value.toFixed(2).toString().replace('.', ",");
                }
              }
          },
          xAxes: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false,
                display: true,
                
              },
              ticks: {
                color: '#fff',
              }
          },
        },
        animation: {
            duration: 750,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            position: 'nearest',
            intersect: false,
            mode: 'index',
            cornerRadius: 10,
            usePointStyle: true,
            displayColors: false,
            titleFont: {weight: 'normal'},
            titleColor: '#0084ff',
            bodyColor: '#0084ff',
            backgroundColor: 'rgb(260, 260, 260)',
            borderColor: '#0084ff',
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
                return 'Dividends: €' + value.formattedValue;
              },
            }
          }
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
          datasets: [
            {
              label: '',
              backgroundColor: "#e1f1fb",
              borderWidth: 1,
              borderRadius: 1,
              borderSkipped: 'bottom',
              borderColor: '#0091ff',
              hoverBorderWidth: 2,
              hoverBorderColor: '#0091ff',
              data: []
            }
          ]
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
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
  props: {
    chartData: {
      required: true,
      type: Object,
      default: () => {
        return {
          labels: [],
          datasets: [
            {
              label: 'Dividends Received (EUR)',
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
    chartOptions: {
      type: Object,
      default: () => {
        return {
            scales: {
                xAxes: {
                  
                  display: true,
                  gridLines: {
                    display: false,
                    drawBorder: false
                  },

                },
                yAxes: {
                  display: true,
                  
                  ticks: {
                    beginAtZero: true,
                    callback: function(value) {
                      return '€' + value;
                    }
                  }
                }
           
               
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            animation: {
                duration: 1,
            },
            legend: {
                display: true,
                position: 'bottom',
            },
            responsiveAnimationDuration: 0,
            responsive: true,
            maintainAspectRatio: false,
        } 
      },
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
  
  
}
</script>

<style scoped>
.fade-enter-active {
  transition: all 0.15s ease-out;
}
.fade-leave-active {
  transition: all 0.05s ease-in;
}
.fade-enter-from {
  transform: translateY(10px);
  opacity: 0;
}

.fade-leave-to {
  transform: translateY(0px);
    opacity: 0;
}

</style>
<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"

    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  props: {
    chartId: {
      type: String,
      default: 'bar-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      chartData: {
        labels: [ ],
        datasets: [{
          label: 'label',
          data: [],
          backgroundColor: "#e1f1fb",
          borderWidth: 2,
          borderRadius: 5,
          borderSkipped: false,
          borderColor: '#0091ff',
          hoverBorderWidth: 2,
          hoverBorderColor: '#0091ff',
        }]
      },
      chartOptions: {
        scales: {
          y: {
              beginAtZero: true,
          },
          x: {
              beginAtZero: true,
          },
        },
        legend: {
            display: true,
            position: 'bottom',
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
      }
    }
  }
}
</script>
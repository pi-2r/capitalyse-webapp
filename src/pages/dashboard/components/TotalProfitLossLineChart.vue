<template>
  <transition name="fade" mode="out-in">
    <Line
      :key="chartData.datasets[0].data"
      :chart-options="chartOptions"
      :chart-data="chartData"
      :width="width"
      :height="height"
    />
  </transition>
</template>

<script>
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
} from "chart.js";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);
export default {
  name: "LineChart",
  components: { Line },
   props: {
    chartData: {
      required: true,
      type: Object,
      default: () => {
        return {
          labels: [],
          datasets: [],
        };
      },
    },
    currency: {
      default: 'EUR',
      required: false,
    },
    height: {
      required: false,
      type: Number,
      default: 300,
    },
    width: {
      required: false,
      type: Number,
      default: 400,
    },
  },
  data() {
    return {
      chartOptions: {
        scales: {
          yAxes: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.125)",
              drawBorder: false,
              borderDash: [4, 5],
              display: true,
            },
            ticks: {
              color: "#000",
              callback: function (value) {
                value = value.toFixed(2);
                value = parseFloat(value);
                // if more than 1000 change to k
                if (value >= 1000) {
                  value = value / 1000 + "K";
                } else if (value >= 1000000) {
                  value = value / 1000000 + "M";
                }
                return "€" + value.toString().replace(".", ",");
              },
            },
            stacked: true,
          },
          xAxes: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.08)",
              drawBorder: false,
              display: false,
            },
            ticks: {
              color: "#fff",
            },
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
            position: "nearest",
            mode: "index",
            intersect: false,
            caretPadding: 6,
            usePointStyle: true,
            cornerRadius: 10,
            displayColors: false,
            titleFont: { size: 13 },
            titleColor: "#bdbdbd",
            bodyFont: { weight: "bold", size: 15, color: "#0084ff" },
            bodyColor: "grey",
            backgroundColor: "rgb(260, 260, 260)",
            borderColor: "rgb(220, 220, 220)",
            borderWidth: 1,
            padding: 12,
            enabled: true,
            callbacks: {
              title: function (value) {
                if (value[0]) {
                  const date = value[0].label;
                  const year = date.split("-")[2];
                  const month = date.split("-")[1];
                  const day = date.split("-")[0];
                  const arrayOfMonths = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ];
                  return [`Week of ${day} ${arrayOfMonths[month - 1]} ${year}`];
                } else {
                  return null;
                }
              },
              label: function (value) {
                const numberFormatValue = Intl.NumberFormat("nl-nl", {
                  style: "currency",
                  currency: "EUR",
                }).format(value.raw);
                return numberFormatValue;
              },
            },
          },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
      currencyProps: this.currency,
    };
  },
 
  methods: {
    setTheme() {
      // pak de theme van localstorage en zet geef de juiste theme aan de chart
      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        this.chartOptions.scales.yAxes.ticks.color = "rgb(134, 134, 134)";
        this.chartOptions.scales.xAxes.ticks.color = "rgb(134, 134, 134)";
        this.chartOptions.scales.yAxes.grid.color = "rgb(67, 67, 67)";
        this.chartOptions.scales.xAxes.grid.color = "rgb(67, 67, 67)";
        this.chartOptions.plugins.tooltip.backgroundColor = "rgb(52, 52, 52)";
      } else {
        this.chartOptions.scales.yAxes.ticks.color = "rgba(0, 0, 0, 0.5)";
        this.chartOptions.scales.xAxes.ticks.color = "rgba(0, 0, 0, 0.5)";
      }
    },
  },
  beforeUpdate() {
    this.currencyProps = this.currency;
  },
  created() {
    this.setTheme();
  },
};
</script>

<style scoped>
.fade-enter-active {
  transition: all 0.15s ease-out;
}
.fade-enter-from {
  opacity: 0;
}
.fade-leave-to {
  opacity: 0;
}
</style>
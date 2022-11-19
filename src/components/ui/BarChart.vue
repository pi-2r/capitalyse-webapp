<template>
  <transition name="fade" mode="out-in">
    <Bar
      :key="chartData.datasets[0].data"
      :chart-options="chartOptions"
      :chart-data="chartData"
      :width="width"
      :height="height"
    />
  </transition>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "BarChart",
  components: { Bar },
  data() {
    return {
      chartOptions: {
        interaction: {
          mode: "index",
        },
        scales: {
          yAxes: {
            stacked: true,
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.5)",
              drawBorder: false,
              borderDash: [1, 7],
              display: true,
            },
            ticks: {
              color: "#fff",
              callback: function (value) {
                // replace dot with comma
                return Intl.NumberFormat("nl-nl", {
                  style: "currency",
                  currency: "EUR",
                }).format(value);
              },
            },
          },
          xAxes: {
            stacked: true,
            beginAtZero: true,
            grid: {
              drawBorder: false,
              display: false,
            },
            ticks: {
              color: "#fff",
              maxRotation: 30,
              callback: function (value, index) {
                const date = this.getLabelForValue(value);
                  const year = date.split("-")[1];
                const month = date.split("-")[0];
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
                // replace dot with comma
                return index % 2 === 0 ? [`${arrayOfMonths[month - 1]} ${year}`] : '       ';
              },
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
            filter: (tooltipItem) =>
              tooltipItem.dataset.data[tooltipItem.dataIndex] > 0,
            position: "nearest",
            mode: "index",
            intersect: false,
            caretPadding: 6,
            usePointStyle: true,
            cornerRadius: 10,
            displayColors: false,
            titleFont: { size: 13 },
            titleColor: "#bdbdbd",
            bodyFont: { size: 12, color: "#0084ff" },
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
                  const year = date.split("-")[1];
                  const month = date.split("-")[0];
                  const arrayOfMonths = [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ];
                  return [`${arrayOfMonths[month - 1]} ${year}`];
                } else {
                  return null;
                }
              },
              label: function (value) {
                if (value) {
                  return [
                    `${Intl.NumberFormat("nl-nl", {
                      style: "currency",
                      currency: "EUR",
                    }).format(value.raw)}  ⇢  ${value.dataset.label}`,
                  ];
                } else {
                  return null;
                }
              },
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    };
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
              label: "",
              backgroundColor: "#e1f1fb",
              borderWidth: 1,
              borderRadius: 1,
              borderSkipped: "bottom",
              borderColor: "#0091ff",
              hoverBorderWidth: 2,
              hoverBorderColor: "#0091ff",
              data: [],
            },
          ],
        };
      },
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
  methods: {
    setTheme() {
      // pak theme van localStorage en geef de juiste kleur aan de chart
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
<template>
  <ResultCard
    title="Most traded product"
    :resultValue="
      mostFreqTraded +
      ' (' +
      timesTraded +
      ' trade' +
      (timesTraded > 1 || timesTraded == 0 ? 's' : '') +
      ')'
    "
    :withBtn="false"
    :numberResult="false"
  />
</template>

<script>
import ResultCard from "@/components/dashboard/ResultCard.vue";

export default {
  components: {
    ResultCard,
  },
  props: {
    withBth: {
      type: Boolean,
      default: false,
    },
    mostFrequentlyTradedList: {
      default: null,
      required: true,
    },
  },
  computed: {
    portfolioId() {
      return this.$route.params.id;
    },
    isThereAnalyticsData() {
      return this.mostFrequentlyTradedList !== null;
    },
    mostFreqTraded() {
      return this.isThereAnalyticsData
        ? this.mostFrequentlyTradedList[0].name
        : "No result";
    },
    timesTraded() {
      return this.isThereAnalyticsData
        ? this.mostFrequentlyTradedList[0].count
        : 0;
    },
  },
};
</script>

<style scoped>
</style>
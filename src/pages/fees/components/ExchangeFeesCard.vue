<template>
  <ResultCard
    title="Exchange fees"
    :resultValue="totalExchangeFees"
    :withBtn="false"
  />
</template>

<script>
import ResultCard from "@/components/dashboard/ResultCard.vue";
import getTotalExchangeFeesMixin from "@/mixins/analytics/getTotalExchangeFees";

export default {
  mixins: [getTotalExchangeFeesMixin],
  components: {
    ResultCard,
  },
  props: {
    withBth: {
      type: Boolean,
      default: false,
    },
    totalExchangeFees: {
      required: true,
    }
  },
};
</script>

<style>
</style>
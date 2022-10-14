<template>
  <ResultCard
    title="Exchange fees"
    :resultValue="totalExchangeFees"
    :withBtn="false"
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
    totalExchangeFees: {
      required: true,
    }
  },
};
</script>

<style>
</style>
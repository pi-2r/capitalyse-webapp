<template>
  <ResultCard
    title="Total times traded"
    :resultValue="totalTradeCount + ' trades'"
    :to="toLink"
    btnText="View Trades"
    :withBtn="true"
    :numberResult="false"
    :largeBlueText="true"
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
    isDemo: {
      type: Boolean,
      default: false,
    },
    totalTradeCount: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      totTradeCount: 0,
    };
  },
  computed: {
    toLink() {
      if(this.isDemo) {
        return '/dashboard/demo/trading';
      } else {
        return `/dashboard/${this.portfolioId}/trading`;
      }
    },
    portfolioId() {
      return this.$route.params.id;
    },
  },
};
</script>

<style>
</style>
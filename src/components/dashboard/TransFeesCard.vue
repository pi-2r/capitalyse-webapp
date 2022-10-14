<template>
  <ResultCard
    title="Transaction fees"
    :resultValue="totalTransactionFees"
    :to="toLink"
    btnText="View Fees"
    :withBtn="true"
  />
</template>

<script>
import ResultCard from "@/components/dashboard/ResultCard.vue";

export default {
  components: {
    ResultCard,
  },
  props: {
    totalTransactionFees : {
      type: Number,
      require: true,
      default: 0,
    },
    withBth: {
      type: Boolean,
      default: false,
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      totTransFees: 0,
    };
  },
  computed: {
    toLink() {
      if(this.isDemo) {
        return '/dashboard/demo/fees';
      } else {
        return `/dashboard/${this.portfolioId}/fees`;
      }
    },
    portfolioId() {
      return this.$route.params.id;
    },
  },
};
</script>

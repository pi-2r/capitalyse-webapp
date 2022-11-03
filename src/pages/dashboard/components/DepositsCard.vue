<template>
  <ResultCard
    title="Total deposits"
    :resultValue="totalDeposits"
    :to="toLink"
    btnText="View Deposits"
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
    totalDeposits: {
      type: Number,
      required: true,
      default: 0,
    },
    withBth: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      totDeposits: 0,
    };
  },
  computed: {
    toLink() {
      if(this.isPublic === true) {
        return `/shared/${this.$route.params.uid}/${this.$route.params.pid}/deposits`
      } else {
        return `/dashboard/${this.portfolioId}/deposits`;
      }
    },
    portfolioId() {
      // id wordt gebruikt voor de link naar de deposits pagina
      return this.$route.params.id;
    },
    isThereAnalyticsData() {
      return this.totalDeposits !== 0
    },
  },
};
</script>
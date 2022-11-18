<template>
  <ResultCard
    :showTooltip="true"
    tooltipText="Total amount paid in transaction fees. Does not include AutoFX fees."
    title="Transaction fees"
    :resultValue="totalTransactionFees"
    :to="toLink"
    btnText="My Fees"
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
    isPublic: {
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
      if(this.isDemo === true) {
        return '/dashboard/demo/fees';
      } else if(this.isPublic === true) {
        return `/shared/${this.$route.params.uid}/${this.$route.params.pid}/fees`
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

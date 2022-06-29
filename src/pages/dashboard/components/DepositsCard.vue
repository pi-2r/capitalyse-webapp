<template>
  <ResultCard
    v-if="isDemo"
    title="Total Deposited"
    :resultValue="totDeposits"
    :to="'/dashboard/demo/deposits'"
    btnText="Deposits & Withdrawals"
    :withBtn="true"
  />
  <ResultCard
    v-else
    title="Total Deposited"
    :resultValue="totDeposits"
    :to="'/dashboard/' + portfolioId + '/deposits'"
    btnText="Deposits & Withdrawals"
    :withBtn="true"
  />
</template>
<script>
import ResultCard from "@/components/dashboard/ResultCard.vue";

import getTotalDepositsMixin from "@/mixins/analytics/getTotalDeposits";
import currencyMarkup from "@/mixins/helpers/currencyMarkup";

export default {
  mixins: [getTotalDepositsMixin, currencyMarkup],
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
  },
  data() {
    return {
      totDeposits: 0,
    };
  },
  computed: {
    portfolioId() {
      // id wordt gebruikt voor de link naar de deposits pagina
      return this.$route.params.id;
    },
    currentPortfolio() {
      return this.$store.getters["files/getCurrentPortfolio"];
    },
    isThereData() {
      return !!this.currentPortfolio.accountFile;
    },
  },
  watch: {
    isThereData() {
      // op het moment dat data veranderd, roep loadData aan
      this.loadData();
    },
  },
  methods: {
    loadData() {
      // runt alleen als de verandering in data betekende dat
      // er wél data nu is. berekent de totale deposits via een MIXIN en het accountFile
      if (this.isThereData) {
        this.totDeposits = this.currencyMarkup(
          this.getTotalDeposits(this.currentPortfolio.accountFile)
        );
      }
    },
  },
  created() {
    // als er al data is, kan er gelijk worden berekend
    this.loadData();
  },
};
</script>
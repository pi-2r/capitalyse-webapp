<template>
  <Header :isDemo="isDemo"></Header>
  <section class="container" v-if="!isLoading">
    <!-- <BackButton class="backButton" color="var(--clr-grey)" /> -->
    <Breadcrumbs
      v-if="isDemo"
      baseLink="/portfolios"
      baseLinkName="Portfolios"
      :secondLink="'/dashboard/demo'"
      :secondLinkName="'Demo'"
      thirdLink="#"
      thirdLinkName="Deposits & Withdrawals"
    />
    <Breadcrumbs
      v-else
      baseLink="/portfolios"
      baseLinkName="Portfolios"
      :secondLink="'/dashboard/' + this.$route.params.id"
      :secondLinkName="
        portfolioInfo.portfolioName ? portfolioInfo.portfolioName : ''
      "
      thirdLink="#"
      thirdLinkName="Deposits & Withdrawals"
    />

    <section class="titleAndBackButtonContainer">
      <h1>Deposits & Withdrawals</h1>
    </section>

    <section class="cardsContainer">
      <DepositsChart :chartDepositsProps="depositsAnalytics.chartDeposits" />
      <DepositsList :depositsList="depositsAnalytics.depositsList" />
    </section>
  </section>
  <section v-else>
    <LoadingOverlay/>
  </section>
</template>

<script>
import Breadcrumbs from "@/components/ui/Breadcrumbs.vue";
import Header from "@/components/layout/Header.vue";
// import BackButton from "@/components/ui/BackButton.vue";

import DepositsChart from "./components/DepositsChart.vue";
import DepositsList from "./components/DepositsList.vue";

export default {
  components: {
    Breadcrumbs,
    Header,
    // BackButton,
    DepositsChart,
    DepositsList,
  },
  props: {
    isDemo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
      depositsAnalytics: {
        chartDeposits: null,
        depositsList: null,
      },
      portfolioInfo: {
        portfolioName: null,
      },
    };
  },
  computed: {
    portfolioName() {
      return this.$store.getters["files/getCurrentPortfolioName"];
    },
    hasDepositsAnalytics() {
      let analytics = this.$store.getters["files/getAnalytics"];
      if (analytics.length > 0) {
        for (let i = 0; i < analytics.length; i++) {
          if (Object.keys(analytics[i]).includes(this.$route.params.id)) {
            if (
              analytics[i][this.$route.params.id].depositsAnalytics !==
              undefined
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    getDepositsAnalytics() {
      const analytics = this.$store.getters["files/getAnalytics"];
      for (let i = 0; i < analytics.length; i++) {
        if (Object.keys(analytics[i]).includes(this.$route.params.id)) {
          return analytics[i][this.$route.params.id].depositsAnalytics;
        }
      }
      return null;
    },
    getDemo() {
      return this.$store.getters['files/getDemo'];
    },
    hasPortfolios() {
      return this.$store.getters["files/hasPortfolios"];
    },
  },
  watch: {
    hasPortfolios() {
      this.getPortfolioInfo();
    },
    hasDepositsAnalytics() {
      this.loadData();
    },
    $route() {
      this.loadData();
    },
  },
  methods: {
    loadData() {
      if (this.isDemo === false) {
        if (this.hasDepositsAnalytics === true) {
          this.depositsAnalytics = this.getDepositsAnalytics;
          this.getPortfolioInfo();
          this.isLoading = false
        } else {
          this.$store.dispatch("files/fetchPortfolioAnalytics", {
            type: "deposits",
            portfolioId: this.$route.params.id,
          }).then(() => {
            this.isLoading = false
          });
        }
      } else {
        this.depositsAnalytics = this.getDemo.depositsAnalytics
        this.getDemoPortfolioInfo();
        this.isLoading = false
      }
    },
    getPortfolioInfo() {
      const portfolios = this.$store.getters["files/getPortfolios"];
      if (portfolios.length > 0) {
        for (let i = 0; i < portfolios.length; i++) {
          if (portfolios[i].id === this.$route.params.id) {
            this.portfolioInfo = portfolios[i];
          }
        }
      }
    },
    getDemoPortfolioInfo() {
      this.portfolioInfo = this.$store.getters['files/getDemoPortfolioInfo']
    },
  },
  created() {
    this.isLoading = true
    this.loadData();
  },
};
</script>

<style scoped>
.container {
  margin: 0 auto;
  margin-bottom: 4rem;
  margin-top: 3rem;
}

.backButton {
  margin-bottom: 1rem;
}

@media screen and (min-width: 400px) {
  .container {
    max-width: 92%;
  }
}

@media screen and (min-width: 650px) {
  .cardsContainer {
    grid-template-columns: 1fr 1fr;
  }

  .container {
    max-width: 90%;
  }
}

@media screen and (min-width: 1150px) {
  .cardsContainer {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .container {
    max-width: 1100px;
  }
}
</style>
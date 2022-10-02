<template>
  <Header :isDemo="isDemo"></Header>
  <section class="container" v-if="!isLoading">
    <!-- <BackButton class="backButton" color="var(--clr-grey)"/> -->

    <Breadcrumbs
      v-if="isDemo"
      baseLink="/portfolios"
      baseLinkName="Portfolios"
      :secondLink="'/dashboard/demo'"
      :secondLinkName="'Demo'"
      thirdLink="#"
      thirdLinkName="Fees & Costs"
    />
    <Breadcrumbs
      v-else
      baseLink="/portfolios"
      baseLinkName="Portfolios"
      :secondLink="'/dashboard/' + this.$route.params.id"
      :secondLinkName="portfolioInfo.portfolioName ? portfolioInfo.portfolioName : ''"
      thirdLink="#"
      thirdLinkName="Fees & Costs"
    />

    <section class="titleAndBackButtonContainer">
      <h1>Fees & Costs</h1>
    </section>

    <section class="cardsContainer">
      <TransFeesCard
        :withBtn="false"
        :totalTransactionFees="feesAnalytics.totalTransactionFees"
      />
      <ExchangeFeesCard :totalExchangeFees="feesAnalytics.totalExchangeFees" />
    </section>
    <!-- <FeesChart/> -->
  </section>
  <section v-else>
    <LoadingOverlay/>
  </section>
</template>

<script>
import Breadcrumbs from "@/components/ui/Breadcrumbs.vue";
import Header from "@/components/layout/Header.vue";
import TransFeesCard from "@/components/dashboard/TransFeesCard.vue";

import ExchangeFeesCard from "./components/ExchangeFeesCard.vue";
// import FeesChart from './components/FeesChart.vue';

export default {
  components: {
    Breadcrumbs,
    Header,
    TransFeesCard,
    ExchangeFeesCard,
    // FeesChart
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
      feesAnalytics: {
        totalExchangeFees: 0,
        totalTransactionFees: 0,
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
    hasFeesAnalytics() {
      let analytics = this.$store.getters["files/getAnalytics"];
      if (analytics.length > 0) {
        for (let i = 0; i < analytics.length; i++) {
          if (Object.keys(analytics[i]).includes(this.$route.params.id)) {
            if (
              analytics[i][this.$route.params.id].feesAnalytics !== undefined
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    getFeesAnalytics() {
      const analytics = this.$store.getters["files/getAnalytics"];
      for (let i = 0; i < analytics.length; i++) {
        if (Object.keys(analytics[i]).includes(this.$route.params.id)) {
          return analytics[i][this.$route.params.id].feesAnalytics;
        }
      }
      return null;
    },
    hasPortfolios() {
      return this.$store.getters["files/hasPortfolios"];
    },
  },
  watch: {
    hasPortfolios() {
      this.getPortfolioInfo();
    },
    hasFeesAnalytics() {
      this.loadData();
    },
    $route() {
      this.loadData();
    },
  },
  methods: {
    getPortfolioInfo() {
      const portfolios = this.$store.getters["files/getPortfolios"];
      if (portfolios.length > 0) {
        for (let i = 0; i < portfolios.length; i++) {
          if (portfolios[i].id === this.$route.params.id) {
            this.portfolioInfo = portfolios[i]
          }
        }
      }
    },
    loadData() {
      if (this.isDemo === false) {
        if (this.hasFeesAnalytics === true) {
          this.feesAnalytics = this.getFeesAnalytics;
          this.getPortfolioInfo()
          this.isLoading = false
        } else {
          this.$store.dispatch("files/fetchPortfolioAnalytics", {
            type: "fees",
            portfolioId: this.$route.params.id,
          }).then(() => {
            this.isLoading = false
          });
        }
      }
    },
  },
  created() {
    this.isLoading = true
    this.loadData();
  },
};
</script>

<style scoped>
.backButton {
  margin-bottom: 1rem;
}

.container {
  margin: 0 auto;
  margin-bottom: 4rem;
  margin-top: 3rem;
}

.cardsContainer {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
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
  .container {
    max-width: 1100px;
  }
}
</style>
<template>
  <Header :isDemo="isDemo"></Header>
  <section class="container" v-if="!isLoading">

    <Breadcrumbs
      baseLink="/portfolios"
      baseLinkName="Portfolios"
      :secondLink="this.isDemo ? '/dashboard/demo' : '/dashboard/' + this.$route.params.id"
      :secondLinkName="portfolioInfo.portfolioName"
      thirdLink="#"
      thirdLinkName="Fees & Costs"
    />

    <section class="titleAndBackButtonContainer">
      <BackButton />
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
import BackButton from "@/components/ui/BackButton.vue";

import ExchangeFeesCard from "./components/ExchangeFeesCard.vue";
// import FeesChart from './components/FeesChart.vue';

export default {
  components: {
    Breadcrumbs,
    Header,
    BackButton,
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
    getDemo() {
      return this.$store.getters['files/getDemo'];
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
    getDemoPortfolioInfo() {
      this.portfolioInfo = this.$store.getters['files/getDemoPortfolioInfo']
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
      } else {
        this.feesAnalytics = this.getDemo.feesAnalytics
        this.getDemoPortfolioInfo();
        this.isLoading = false
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
.titleAndBackButtonContainer {
  display: flex;
  align-items: center;
}

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
<template>
  <Header/>
  <section class="container" v-if="!isLoading">
    <SharedPortfolioIcon
      :displayName="dividendsAnalytics.sharedPortfolioOwner.displayName"
      :email="dividendsAnalytics.sharedPortfolioOwner.email"
      v-if="isPublic"
    />
     <Breadcrumbs
      baseLink="/portfolios"
      baseLinkName="Portfolios"
      :secondLink="
        this.isPublic
          ? `/shared/${this.$route.params.uid}/${this.$route.params.pid}`
          : '/dashboard/' + this.$route.params.id
      "
      :secondLinkName="
        this.isPublic
          ? dividendsAnalytics.portfolioMetadata.portfolioName
          : portfolioInfo.portfolioName
      "
      thirdLink="#"
      thirdLinkName="Dividends"
    />

    <section class="titleAndBackButtonContainer">
      <BackButton />
      <h1>Dividends</h1>
    </section>

     <DividendChart
        :hideTimeFrameBtns="false"
        :chartDividendsProps="dividendsAnalytics.chartDividends"
        class="dividendChartDashboard"
      />

    <section class="cardsContainer">
      <ResultCard
        title="Total dividends"
        :resultValue="dividendsAnalytics.totalDividends"
        :withBtn="false"
        colorType="greenRed"
      />

       <ResultCard
        :showTooltip="true"
        tooltipText="This shows the average dividends received per month in the past."
        title="Avg received per month"
        :resultValue="dividendsAnalytics.averageDividendsPerMonth"
        :withBtn="false"
          colorType="greenRed"
      />
      
      <ResultCard
        :showTooltip="true"
        tooltipText="Yield to date is the total of received dividends as a percentage of your total investments. (total dividends ÷ total invested × 100)"
        title="Yield to date"
        :isPercentage="true"
        :resultValue="dividendsAnalytics.dividendYieldToDate"
        :withBtn="false"
      />

    </section>

    <DividendsList
      :dividendsList="dividendsAnalytics.dividendsList"
      :isLoading="isLoading"
    />
    <!-- <FeesChart/> -->
  </section>
  <section v-else>
    <LoadingOverlay />
  </section>
</template>

<script>
import SharedPortfolioIcon from "@/components/ui/SharedPortfolioIcon.vue";
import DividendChart from '@/components/ui/DividendChart.vue'
import ResultCard from "@/components/dashboard/ResultCard.vue";
import Breadcrumbs from "@/components/ui/Breadcrumbs.vue";
import Header from "@/components/layout/Header.vue";
import BackButton from "@/components/ui/BackButton.vue";
import DividendsList from "@/components/ui/DividendsList.vue";

// import FeesChart from './components/FeesChart.vue';

export default {
  components: {
    Breadcrumbs,
    ResultCard,
    DividendsList,
    SharedPortfolioIcon,
    DividendChart,
    Header,
    BackButton,
    // FeesChart
  },
  props: {
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
      dividendsAnalytics: {
        totalDividends: 0,
        dividendYieldToDate: 0,
        chartDividends: null,
        averageDividendsPerMonth: 0,
        dividendsList: null,
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
    hasDividendsAnalytics() {
      let analytics = this.$store.getters["files/getAnalytics"];
      if (analytics.length > 0) {
        for (let i = 0; i < analytics.length; i++) {
          if (Object.keys(analytics[i]).includes(this.$route.params.id)) {
            if (
              analytics[i][this.$route.params.id].dividendsAnalytics !==
              undefined
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    getDividendsAnalytics() {
      const analytics = this.$store.getters["files/getAnalytics"];
      for (let i = 0; i < analytics.length; i++) {
        if (Object.keys(analytics[i]).includes(this.$route.params.id)) {
          return analytics[i][this.$route.params.id].dividendsAnalytics;
        }
      }
      return null;
    },
    hasSharedDividendsAnalytics() {
      let sharedAnalytics = this.$store.getters["files/getSharedAnalytics"];
      if (sharedAnalytics.length > 0) {
        for (let i = 0; i < sharedAnalytics.length; i++) {
          if (
            Object.keys(sharedAnalytics[i]).includes(this.$route.params.pid)
          ) {
            if (
              sharedAnalytics[i][this.$route.params.pid].dividendsAnalytics !==
              undefined
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    getSharedDividendsAnalytics() {
      if (this.isPublic === true) {
        const sharedAnalytics = this.$store.getters["files/getSharedAnalytics"];
        for (let i = 0; i < sharedAnalytics.length; i++) {
          if (
            Object.keys(sharedAnalytics[i]).includes(this.$route.params.pid)
          ) {
            return sharedAnalytics[i][this.$route.params.pid]
              .dividendsAnalytics;
          }
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
    hasDividendsAnalytics() {
      if (this.hasDividendsAnalytics === true) {
        this.loadData();
      }
    },
    hasSharedDividendsAnalytics() {
      if (this.hasSharedDividendsAnalytics === true) {
        this.loadData();
      }
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
            this.portfolioInfo = portfolios[i];
          }
        }
      }
    },
    loadData() {
      if (!this.isPublic) {
        if (this.hasDividendsAnalytics === true) {
          this.dividendsAnalytics = this.getDividendsAnalytics;
          this.getPortfolioInfo();
          this.isLoading = false;
        } else {
          this.$store
            .dispatch("files/fetchPortfolioAnalytics", {
              type: "dividends",
              portfolioId: this.$route.params.id,
            })
            .then(() => {
              this.isLoading = false;
            });
        }
      } else {
        if (this.hasSharedDividendsAnalytics === true) {
          this.dividendsAnalytics = this.getSharedDividendsAnalytics;
          this.isLoading = false;
        } else {
          this.$store
            .dispatch("files/fetchSharedPortfolioAnalytics", {
              type: "dividends",
              userId: this.$route.params.uid,
              portfolioId: this.$route.params.pid,
            })
            .then(() => {
              this.isLoading = false;
            });
        }
      }
    },
  },
  created() {
    this.isLoading = true;
    this.loadData();
  },
};
</script>

<style scoped>
.dividendChartDashboard {
  margin-bottom: 3rem;
}

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
  margin-bottom: 3rem;
}

@media screen and (min-width: 650px) {
  .cardsContainer {
    grid-template-columns: 1fr 1fr;
  }
}

@media screen and (min-width: 1150px) {
  .cardsContainer {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media screen and (min-width: 400px) {
  .container {
    max-width: 92%;
  }
}

@media screen and (min-width: 650px) {
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
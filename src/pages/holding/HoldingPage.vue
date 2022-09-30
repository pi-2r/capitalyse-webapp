<template>
  <Header :isDemo="isDemo"></Header>
  <section class="container">
    <!-- <BackButton class="backButton" color="var(--clr-grey)"/> -->

    <Breadcrumbs
      v-if="isDemo"
      baseLink="/portfolios"
      baseLinkName="Portfolios"
      :secondLink="'/dashboard/demo'"
      secondLinkName="Demo"
      thirdLink="#"
      :thirdLinkName="holdingName"
    />
    <Breadcrumbs
      v-else
      baseLink="/portfolios"
      baseLinkName="Portfolios"
      :secondLink="'/dashboard/' + this.$route.params.id"
      :secondLinkName="portfolioName ? portfolioName : ''"
      thirdLink="#"
      :thirdLinkName="holdingName"
    />

    <section class="titleAndBackButtonContainer">
      <h1>{{holdingName}}</h1>
      <p>{{$route.params.holdingId}}</p>
    </section>
   
    <HoldingInfoCards :isin="isin" />

    <!-- <DividendChart :hideTimeFrameBtns="false" class="dividendChartDashboard" /> -->
  </section>
</template>

<script>
import Breadcrumbs from "@/components/ui/Breadcrumbs.vue";
import Header from "@/components/layout/Header.vue";
// import BackButton from "@/components/ui/BackButton.vue";
import HoldingInfoCards from "./components/HoldingInfoCards.vue";
// import DividendChart from "@/components/ui/DividendChart.vue";

import getHoldingName from "@/mixins/analytics/getHoldingName.js";

export default {
  mixins: [getHoldingName],
  components: {
    Breadcrumbs,
    Header,
    // DividendChart,
    HoldingInfoCards,
    // BackButton,
    // FeesChart
  },
  data() {
    return {
      holdingName: "",
    };
  },
  props: {
    isDemo: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isin() {
      return this.$route.params.holdingId;
    },
    portfolioName() {
      return this.$store.getters["files/getCurrentPortfolioName"];
    },
    hasHoldingAnalytics() {
      let analytics = this.$store.getters["files/getAnalytics"];
      if (analytics.length > 0) {
        for (let i = 0; i < analytics.length; i++) {
          if (Object.keys(analytics[i]).includes(this.isin)) {
            if (
              analytics[i][this.$route.params.id].holdingAnalytics[this.isin] !== undefined
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    getHoldingAnalytics() {
      const analytics = this.$store.getters["files/getAnalytics"];
      for (let i = 0; i < analytics.length; i++) {
        if (Object.keys(analytics[i]).includes(this.$route.params.id)) {
          return analytics[i][this.$route.params.id].holdingAnalytics[this.isin];
        }
      }
      return null;
    },
    hasPortfolios() {
      return this.$store.getters["files/hasPortfolios"];
    },
  },
  watch: {
    hasHoldingAnalytics() {
      this.loadData();
    },
    $route() {
      this.loadData();
    },
  },
  methods: {
    loadData() {
      if (this.isDemo === false) {
        if (this.hasHoldingAnalytics === true) {
          console.log("fetching from holding page");
          this.holdingAnalytics = this.getHoldingAnalytics;
        } else {
          this.$store.dispatch("files/fetchPortfolioAnalytics", {
            type: "holdings",
            isin: this.isin,
            portfolioId: this.$route.params.id,
          });
        }
      }
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style scoped>
.titleAndBackButtonContainer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.backButton {
  margin-bottom: 1rem;
}

.container {
  margin: 0 auto;
  margin-bottom: 4rem;
  margin-top: 3rem;
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
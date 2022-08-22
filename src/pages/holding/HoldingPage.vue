<template>
  <Header :isDemo="isDemo"></Header>
  <section class="container">
    <!-- <BackButton class="backButton" color="var(--clr-grey)"/> -->

    <Breadcrumbs
      v-if="isDemo"
      baseLink="/portfolios"
      baseLinkName="Portfolios"
      :secondLink="'/dashboard/demo'"
      :secondLinkName="'Demo'"
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
    currentPortfolio() {
      return this.$store.getters["files/getCurrentPortfolio"];
    },
    isThereData() {
      return (
        !!this.currentPortfolio.accountFile &&
        !!this.currentPortfolio.portfolioFile &&
        !!this.currentPortfolio.transactionsFile
      );
    },
    hasCurrentPortfolio() {
      const portfolios = this.$store.getters["files/getPortfolios"];
      for (let i = 0; i < portfolios.length; i++) {
        if (portfolios[i].id === this.$route.params.id) {
          return true;
        }
      }
      return false;
    },
    hasCurrentFiles() {
      const portfolios = this.$store.getters["files/getPortfolios"];
      let hasFiles = false;
      portfolios.forEach((portfolio) => {
        if (portfolio.id === this.$route.params.id) {
          if (portfolio.portfolioFile && portfolio.transactionsFile && portfolio.accountFile) {
            hasFiles = true;
          }
        }
      });
      return hasFiles;
    },
    hasPortfolios() {
      return this.$store.getters["files/hasPortfolios"];
    },
  },
  watch: {
    hasPortfolios() {
      this.loadData();
    },
    isThereData() {
      this.start();
    },
    $route() {
      this.loadData();
    },
  },
  methods: {
    start() {
      if(this.isThereData) {
          this.holdingName = this.getHoldingName(
          this.currentPortfolio.portfolioFile,
          this.isin
        );
      }
    },
    loadData() {
      if (this.isDemo === false) {
        if (!this.hasCurrentFiles && this.hasCurrentPortfolio) {
          this.$store.dispatch(
            "files/fetchOnePortfolio",
            this.$route.params.id
          );
        }

        if (this.hasCurrentPortfolio) {
          this.setCurrentPortfolio(this.$route.params.id);
        }
      } else if (this.isDemo === true) {
        this.$store.dispatch("files/setDemoAsCurrentPortfolio");
      }
    },
    setCurrentPortfolio(id) {
      this.$store.dispatch("files/setCurrentPortfolio", id);
    },
    resetCurrentPortfolio() {
      this.$store.dispatch("files/resetCurrentPortfolio");
    },
  },
  created() {
    this.loadData();
    this.start();
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
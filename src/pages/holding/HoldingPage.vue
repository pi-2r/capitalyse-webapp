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
      thirdLinkName="HOLDING_NAME"
    />
    <Breadcrumbs
      v-else
      baseLink="/portfolios"
      baseLinkName="Portfolios"
      :secondLink="'/dashboard/' + this.$route.params.id"
      :secondLinkName="portfolioName ? portfolioName : ''"
      thirdLink="#"
      thirdLinkName="HOLDING_NAME"
    />

    <section class="titleAndBackButtonContainer">
      <h1>HOLDING_NAME</h1>
      <p>({{$route.params.holdingId}})</p>
    </section>

    <section class="cardsContainer">
      <HoldingProfitLossCard :isin="isin" />

      <DetailedResultCard
        title="Position value"
        :resultValue="1000"
        :subResultValue="15"
        subResultValuePostfix="%"
      />
      <DetailedResultCard
        title="Transaction fees"
        :resultValue="-3.5"
        :subResultValue="0.9"
        subResultValuePostfix="%"
        colorType="greenRed"
      />
    </section>

    <DividendChart :hideTimeFrameBtns="false" class="dividendChartDashboard" />
  </section>
</template>

<script>
import Breadcrumbs from "@/components/ui/Breadcrumbs.vue";
import Header from "@/components/layout/Header.vue";
// import BackButton from "@/components/ui/BackButton.vue";
import DetailedResultCard from "@/components/ui/DetailedResultCard.vue";
import HoldingProfitLossCard from "./components/HoldingProfitLossCard.vue";
import DividendChart from "@/components/ui/DividendChart.vue";

export default {
  components: {
    Breadcrumbs,
    Header,
    DetailedResultCard,
    DividendChart,
    HoldingProfitLossCard,
    // BackButton,
    // FeesChart
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
          if (portfolio.portfolioFile && portfolio.transactionsFile) {
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
    $route() {
      this.loadData();
    },
  },
  methods: {
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

.cardsContainer {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  margin-bottom: 3rem;
}

@media screen and (min-width: 400px) {
  .container {
    max-width: 92%;
  }
}

@media screen and (min-width: 650px) {
  .cardsContainer {
    grid-template-columns: 1fr 1fr 1fr;
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
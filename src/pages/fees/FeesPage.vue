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
      thirdLinkName="Fees & Costs"
    />
    <Breadcrumbs
      v-else
      baseLink="/portfolios"
      baseLinkName="Portfolios"
      :secondLink="'/dashboard/' + this.$route.params.id"
      :secondLinkName="(portfolioName ? portfolioName : '')"
      thirdLink="#"
      thirdLinkName="Fees & Costs"
    />

    <section class="titleAndBackButtonContainer">
      <h1>Fees & Costs</h1>
    </section>

    <section class="cardsContainer">
      <TransFeesCard :withBtn="false" />
      <ExchangeFeesCard />
    </section>
    <!-- <FeesChart/> -->
  </section>
</template>

<script>
import Breadcrumbs from "@/components/ui/Breadcrumbs.vue";
import Header from "@/components/layout/Header.vue";
// import BackButton from "@/components/ui/BackButton.vue";
import TransFeesCard from "@/components/dashboard/TransFeesCard.vue";

import ExchangeFeesCard from "./components/ExchangeFeesCard.vue";
// import FeesChart from './components/FeesChart.vue';

export default {
  components: {
    Breadcrumbs,
    Header,
    TransFeesCard,
    ExchangeFeesCard,
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
          if (portfolio.accountFile && portfolio.transactionsFile) {
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
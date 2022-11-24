<template>
  <Header />
  <section class="container" v-if="!isLoading">
    <SharedPortfolioIcon
      :displayName="diversificationAnalytics.sharedPortfolioOwner.displayName"
      :email="diversificationAnalytics.sharedPortfolioOwner.email"
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
          ? diversificationAnalytics.portfolioMetadata.portfolioName
          : portfolioInfo.portfolioName
      "
      thirdLink="#"
      thirdLinkName="Diversification"
    />

    <section class="titleAndBackButtonContainer">
      <BackButton />
      <h1>Diversification</h1>
    </section>

    <section class="cardsContainer">
      <DiverisificationCard
        title="Holdings"
        :pieChartData="diversificationAnalytics.pieChartHoldings"
      />
      <DiverisificationCard
        title="Sectors"
        :pieChartData="diversificationAnalytics.pieChartSectors"
        disclaimer="Please note that ETF's and index funds will be grouped together."
      />
      <DiverisificationCard
        title="Industries"
        :pieChartData="diversificationAnalytics.pieChartIndustries"
        disclaimer="Please note that ETF's and index funds will be grouped together."
      />
      <DiverisificationCard
        title="Countries"
        :pieChartData="diversificationAnalytics.pieChartCountries"
        disclaimer="Please note that this tracks the country where the company is headquartered."
      />
      <DiverisificationCard
        title="Currencies"
        :pieChartData="diversificationAnalytics.pieChartCurrencies"
        disclaimer="Please note that this chart represents the currencies your holdings trade in."
      />
    </section>
  </section>
  <section v-else>
    <LoadingOverlay />
  </section>
</template>
<script>
import SharedPortfolioIcon from "@/components/ui/SharedPortfolioIcon.vue";
import BackButton from "@/components/ui/BackButton.vue";
import DiverisificationCard from "./components/DiversificationCard.vue";
import Breadcrumbs from "@/components/ui/Breadcrumbs.vue";

export default {
  props: {
    isPublic: {
      type: Boolean,
      default: false,
    },
    showTooltip: {
      default: false,
      type: Boolean,
    },
  },
  components: {
    DiverisificationCard,
    BackButton,
    Breadcrumbs,
    SharedPortfolioIcon,
  },
  data() {
    return {
      isLoading: false,
      diversificationAnalytics: {
        pieChartHoldings: null,
        pieChartSectors: null,
        pieChartIndustries: null,
        pieChartCountries: null,
        pieChartCurrencies: null,
      },
      portfolioInfo: {
        portfolioName: null,
      },
    };
  },
  computed: {
    hasDiversificationAnalytics() {
      let analytics = this.$store.getters["files/getAnalytics"];
      if (analytics.length > 0) {
        for (let i = 0; i < analytics.length; i++) {
          if (Object.keys(analytics[i]).includes(this.$route.params.id)) {
            if (
              analytics[i][this.$route.params.id].diversificationAnalytics !==
              undefined
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    getDiversificationAnalytics() {
      const analytics = this.$store.getters["files/getAnalytics"];
      for (let i = 0; i < analytics.length; i++) {
        if (Object.keys(analytics[i]).includes(this.$route.params.id)) {
          return analytics[i][this.$route.params.id].diversificationAnalytics;
        }
      }
      return null;
    },
    hasSharedDiversificationAnalytics() {
      let sharedAnalytics = this.$store.getters["files/getSharedAnalytics"];
      if (sharedAnalytics.length > 0) {
        for (let i = 0; i < sharedAnalytics.length; i++) {
          if (
            Object.keys(sharedAnalytics[i]).includes(this.$route.params.pid)
          ) {
            if (
              sharedAnalytics[i][this.$route.params.pid]
                .diversificationAnalytics !== undefined
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    getSharedDiversificationAnalytics() {
      if (this.isPublic === true) {
        const sharedAnalytics = this.$store.getters["files/getSharedAnalytics"];
        for (let i = 0; i < sharedAnalytics.length; i++) {
          if (
            Object.keys(sharedAnalytics[i]).includes(this.$route.params.pid)
          ) {
            return sharedAnalytics[i][this.$route.params.pid]
              .diversificationAnalytics;
          }
        }
      }
      return null;
    },
    hasPortfolios() {
      return this.$store.getters["files/hasPortfolios"];
    },
  },
  methods: {
    loadData() {
      if (!this.isPublic) {
        if (this.hasDiversificationAnalytics === true) {
          this.diversificationAnalytics = this.getDiversificationAnalytics;
          this.getPortfolioInfo();
          this.isLoading = false;
        } else {
          this.$store
            .dispatch("files/fetchPortfolioAnalytics", {
              type: "diversification",
              portfolioId: this.$route.params.id,
            })
            .then(() => {
              this.isLoading = false;
            });
        }
      } else if (this.isPublic) {
        if (this.hasSharedDiversificationAnalytics === true) {
          this.diversificationAnalytics =
            this.getSharedDiversificationAnalytics;
          this.isLoading = false;
        } else {
          this.$store
            .dispatch("files/fetchSharedPortfolioAnalytics", {
              type: "diversification",
              userId: this.$route.params.uid,
              portfolioId: this.$route.params.pid,
            })
            .then(() => {
              this.isLoading = false;
            });
        }
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
  
  },
  watch: {
    hasPortfolios() {
      this.getPortfolioInfo();
    },
    hasDiversificationAnalytics() {
      if (this.hasDiversificationAnalytics === true) {
        this.loadData();
      }
    },
    hasSharedDiversificationAnalytics() {
      if (this.hasSharedDiversificationAnalytics === true) {
        this.loadData();
      }
    },
    $route() {
      this.loadData();
    },
  },
  created() {
    this.isLoading = true;
    this.loadData();
  },
};
</script>
<style scoped>
.titleAndBackButtonContainer {
  display: flex;
  align-items: center;
}

.container {
  min-height: 100vh;
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
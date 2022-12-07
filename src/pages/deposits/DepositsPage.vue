<template>
  <Header />
  <section class="container" v-if="!isLoading">
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
          ? depositsAnalytics.portfolioMetadata.portfolioName
          : portfolioInfo.portfolioName
      "
      thirdLink="#"
      thirdLinkName="Deposits"
    />

    <section class="titleAndBackButtonContainer">
      <BackButton />
      <h1>Deposits & Withdrawals</h1>
    </section>

    <section class="cardsContainer">
      <DepositsChart
        :chartDepositsProps="depositsAnalytics.chartDeposits"
        :currency="depositsAnalytics.depositsList[0]?.currency"
      />
      <DepositsList :depositsList="depositsAnalytics.depositsList" />
    </section>
  </section>
  <section v-else>
    <LoadingOverlay />
  </section>
</template>

<script>
import Breadcrumbs from "@/components/ui/Breadcrumbs.vue";
import Header from "@/components/layout/Header.vue";
import BackButton from "@/components/ui/BackButton.vue";

import DepositsChart from "./components/DepositsChart.vue";
import DepositsList from "./components/DepositsList.vue";

export default {
  components: {
    Breadcrumbs,
    Header,
    BackButton,
    DepositsChart,
    DepositsList,
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
    hasSharedDepositsAnalytics() {
      let sharedAnalytics = this.$store.getters["files/getSharedAnalytics"];
      if (sharedAnalytics.length > 0) {
        for (let i = 0; i < sharedAnalytics.length; i++) {
          if (
            Object.keys(sharedAnalytics[i]).includes(this.$route.params.pid)
          ) {
            if (
              sharedAnalytics[i][this.$route.params.pid].depositsAnalytics !==
              undefined
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    getSharedDepositsAnalytics() {
      if (this.isPublic === true) {
        const sharedAnalytics = this.$store.getters["files/getSharedAnalytics"];
        for (let i = 0; i < sharedAnalytics.length; i++) {
          if (
            Object.keys(sharedAnalytics[i]).includes(this.$route.params.pid)
          ) {
            return sharedAnalytics[i][this.$route.params.pid].depositsAnalytics;
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
    hasDepositsAnalytics() {
      if (this.hasDepositsAnalytics === true) {
        this.loadData();
      }
    },
    hasSharedDepositsAnalytics() {
      if (this.hasSharedDepositsAnalytics === true) {
        this.loadData();
      }
    },
    $route() {
      this.loadData();
    },
  },
  methods: {
    loadData() {
      if (!this.isPublic) {
        if (this.hasDepositsAnalytics === true) {
          this.depositsAnalytics = this.getDepositsAnalytics;
          this.getPortfolioInfo();
          this.isLoading = false;
        } else {
          this.$store
            .dispatch("files/fetchPortfolioAnalytics", {
              type: "deposits",
              portfolioId: this.$route.params.id,
            })
            .then(() => {
              this.isLoading = false;
            });
        }
      } else if (this.isPublic) {
        if (this.hasSharedDepositsAnalytics === true) {
          this.depositsAnalytics = this.getSharedDepositsAnalytics;
          this.isLoading = false;
        } else {
          this.$store
            .dispatch("files/fetchSharedPortfolioAnalytics", {
              type: "deposits",
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
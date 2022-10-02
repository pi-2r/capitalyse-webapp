<template>
  <Header :isDemo="isDemo"></Header>

  <section class="container" v-if="!isLoading">
    <!-- <BackButton to="/" class="backButton" color="var(--clr-grey)" /> -->
    <section class="head">
      <section>
        <Breadcrumbs
          baseLink="/portfolios"
          baseLinkName="Portfolios"
          secondLink="#"
          :secondLinkName="
            !isDemo ? (portfolioInfo.portfolioName ? portfolioInfo.portfolioName : '') : 'Demo'
          "
        />
        <section>
          <section class="titleAndBackButtonContainer">
            <h1 v-if="!isDemo">{{ portfolioInfo.portfolioName }}</h1>
            <h1 v-else>Portfolio Demo</h1>
          </section>
        </section>
      </section>
      <section class="head__rightSection">
        <section class="header__rightSection-dates">
          <p class="startDate">
            Portfolio: {{ homeAnalytics.startDate ? homeAnalytics.startDate : "--/--/--" }}
          </p>
          <p class="startDate">
            Uploaded: {{ portfolioInfo.addedAt ? portfolioInfo.addedAt : "--/--/--" }}
          </p>
        </section>
        <!-- <section class="head__rightSection-icon">
          <Icon
            @click="openThreeDots"
            class="head_"
            icon="entypo:dots-three-vertical"
            height="18"
          />
        </section> -->
      </section>
    </section>

    <section>
      <PortfolioCards
        :totalProfitLoss="homeAnalytics.totalProfitLoss"
        :totalProfitLossPercentage="homeAnalytics.totalProfitLossPercentage"
        :totalCash="homeAnalytics.totalCash"
        :totalInvested="homeAnalytics.totalInvested"
        :totalInvestedPercentage="homeAnalytics.totalInvestedPercentage"
        :totalBalance="homeAnalytics.totalBalance"
      />

      <section class="holdingsContainer">
        <HoldingsPieChartCards
          :pieChartCurrencies="homeAnalytics.pieChartCurrencies"
          :pieChartHoldings="homeAnalytics.pieChartHoldings"
        />
      </section>

      <section class="cardsContainer">
        <DepositsCard
          :isDemo="isDemo"
          :totalDeposits="homeAnalytics.totalDeposits"
        />
        <TransFeesCard
          :isDemo="isDemo"
          :totalTransactionFees="homeAnalytics.totalTransactionFees"
        />
        <TradeCountCard
          :isDemo="isDemo"
          :totalTradeCount="homeAnalytics.totalTradeCount"
        />
      </section>

      <DividendChart
        :hideTimeFrameBtns="false"
        :chartDividendsProps="homeAnalytics.chartDividends"
        class="dividendChartDashboard"
      />

      <HoldingsList
        :isDemo="isDemo"
        :holdingsList="homeAnalytics.holdingsList"
      />
    </section>
  </section>
  <LoadingOverlay v-else/>
</template>

<script>
// import { Icon } from "@iconify/vue";

import Header from "@/components/layout/Header.vue";
import Breadcrumbs from "@/components/ui/Breadcrumbs.vue";
import TransFeesCard from "@/components/dashboard/TransFeesCard.vue";
// import BackButton from "@/components/ui/BackButton.vue";

import firebaseDateMixin from "@/mixins/helpers/dateToWords.js";

import DividendChart from "@/components/ui/DividendChart.vue";
import DepositsCard from "./components/DepositsCard.vue";
import TradeCountCard from "./components/TradeCountCard.vue";
import PortfolioCards from "./components/PortfolioCards.vue";
import HoldingsPieChartCards from "./components/HoldingsPieChartCards.vue";
import HoldingsList from "./components/HoldingsList.vue";

export default {
  mixins: [firebaseDateMixin],
  name: "Dashboard",
  components: {
    DividendChart,
    DepositsCard,
    TradeCountCard,
    TransFeesCard,
    Header,
    Breadcrumbs,
    // BackButton,
    PortfolioCards,
    // Icon,
    HoldingsPieChartCards,
    HoldingsList,
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
      accountAge: "",
      portfolioInfo: {
        portfolioName: null,
        startDate: null,
      },
      homeAnalytics: {
        totalProfitLoss: 0,
        totalProfitLossPercentage: 0,
        totalInvested: 0,
        totalInvestedPercentage: 0,
        totalBalance: 0,
        totalCash: 0,
        totalTradeCount: 0,
        totalTransactionFees: 0,
        chartDividends: null,
        holdingsList: null,
        pieChartCurrencies: null,
        pieChartHoldings: null,
        startDate: null,
      },
    };
  },
  computed: {
    hasHomeAnalytics() {
      let analytics = this.$store.getters["files/getAnalytics"];
      if (analytics.length > 0) {
        for (let i = 0; i < analytics.length; i++) {
          if (Object.keys(analytics[i]).includes(this.$route.params.id)) {
            if (
              analytics[i][this.$route.params.id].homeAnalytics !== undefined
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    getHomeAnalytics() {
      const analytics = this.$store.getters["files/getAnalytics"];
      for (let i = 0; i < analytics.length; i++) {
        if (Object.keys(analytics[i]).includes(this.$route.params.id)) {
          return analytics[i][this.$route.params.id].homeAnalytics;
        }
      }
      return null;
    },
    hasFirebaseTime() {
      return !!this.portfolioInfo.addedAt?._seconds && !!this.portfolioInfo.addedAt?._nanoseconds
    },
  },
  watch: {
    hasHomeAnalytics() {
      if (this.hasHomeAnalytics === true) {
        this.loadData();
      }
    },
    hasFirebaseTime() {
      console.log('hsafirebasetime', this.hasFirebaseTime);
      if(this.hasFirebaseTime === true) {
        this.convertFirebaseTime();
      }
    },
    // wanneer de route veranderd, laad opnieuw data in
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
    openThreeDots() {
      window.alert("Coming soon!");
    },
    convertFirebaseTime() {
      // als de addedAt nog in de seconds en nanoseconds object format staat
      if (this.portfolioInfo.addedAt._seconds && this.portfolioInfo.addedAt._nanoseconds) {
        const firebaseDateTime = new Date(
          this.portfolioInfo.addedAt._seconds * 1000 +
            this.portfolioInfo.addedAt._nanoseconds / 1000000
        );
        const firebaseDate = firebaseDateTime.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        const firebaseTime = firebaseDateTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        this.portfolioInfo.addedAt = firebaseDate + " " + firebaseTime;
        // wanneer deze in een leesbaar formaat staat
      }
    },
    loadData() {
      if (this.isDemo === false) {
        if (this.hasHomeAnalytics === true) {
          console.log("fetching from dashboard page");
          this.homeAnalytics = this.getHomeAnalytics;
          this.getPortfolioInfo();
          this.isLoading = false
        } else {
          this.$store.dispatch("files/fetchPortfolioAnalytics", {
            type: "home",
            portfolioId: this.$route.params.id,
          }).then(() => {
            this.isLoading = false
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
.dashboardSpinner {
  height: 10rem;
}

.holdingsContainer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 3rem;
}

.titleAndBackButtonContainer {
  margin-bottom: 0;
}

.backButton {
  margin-bottom: 1rem;
}

.startDate {
  color: var(--clr-grey);
  font-size: 0.75rem;
  text-align: right;
}

.upload {
  margin-bottom: 2.5rem;
}

.head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
}

.head__rightSection {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.head__rightSection-icon {
  display: flex;
  align-items: center;
  border-radius: 2rem;
  color: var(--clr-grey);
}

.head__rightSection-icon:hover {
  cursor: pointer;
  color: var(--clr-blue);
}

.dividendChartDashboard {
  margin-bottom: 3rem;
}

.holdingsPieChartDashboard {
  margin-bottom: 3rem;
}

.cardsContainer {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  margin-bottom: 3rem;
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

@media screen and (max-width: 700px) {
  .head {
    flex-direction: column;
  }

  .head__rightSection {
    margin-top: 1rem;
  }

  .header__rightSection-dates {
    order: 2;
  }

  .header__rightSection-dates p {
    text-align: left;
  }

  .head__rightSection-icon {
    order: 1;
  }

  .holdingsContainer {
    grid-template-columns: 1fr;
  }
}
</style>
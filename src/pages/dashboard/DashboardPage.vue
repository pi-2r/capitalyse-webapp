<template>
  <Header />

  <section class="container" v-if="!isLoading">
    <!-- <BackButton to="/" class="backButton" color="var(--clr-grey)" /> -->
    <section class="head">
      <section>
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
              ? homeAnalytics?.portfolioMetadata?.portfolioName
              : portfolioInfo?.portfolioName || 'Portfolio'
          "
        />
        <section>
          <section class="titleAndBackButtonContainer">
            <h1>
              {{
                portfolioInfo?.portfolioName ||
                homeAnalytics?.portfolioMetadata?.portfolioName
              }}
            </h1>
          </section>
        </section>
      </section>

      <section class="head__rightSection" v-if="!isPublic">
        <Tooltip height="25px" color="var(--clr-grey)" icon="ic:outline-info">
          Uploaded on:
          {{ portfolioInfo.addedAt ? portfolioInfo.addedAt : "--/--/--" }}
          <br /><br />
          We automatically update stock prices, dividends & recalibrate
          diversification daily 2-3 hours after market close.
        </Tooltip>

        <!-- <router-link :to="'/portfolios/' + this.$route.params.id + '/update'">
            <Tooltip
              height="25px"
              color="var(--clr-grey)"
              icon="material-symbols:add-circle-outline-rounded"
            >
              Update transactions, fees, deposits & untrackable dividends
            </Tooltip>
          </router-link> -->

        <router-link :to="'/portfolios/' + this.$route.params.id + '/update'">
          <Icon
            icon="material-symbols:add-circle-outline-rounded"
            height="25"
            class="head__rightSection-icon"
          />
        </router-link>

        <router-link :to="'/dashboard/' + this.$route.params.id + '/settings'">
          <Icon
            icon="ci:settings"
            height="25"
            class="head__rightSection-icon"
          />
        </router-link>
      </section>
    </section>

    <section>
      <!-- <TotalProfitLossChart
        :chartGainProps="homeAnalytics.totalProfitLossChart"
      /> -->

      <PortfolioCards
        :totalProfitLoss="homeAnalytics.totalProfitLoss"
        :totalProfitLossPercentage="homeAnalytics.totalProfitLossPercentage"
        :totalCash="homeAnalytics.totalCash"
        :totalInvested="homeAnalytics.totalInvested"
        :totalInvestedPercentage="homeAnalytics.totalInvestedPercentage"
        :totalBalance="homeAnalytics.totalBalance"
      />

      <!-- 
      <section class="holdingsContainer">
        <HoldingsPieChartCards
          :isPublic="isPublic"
          :pieChartSectors="homeAnalytics.pieChartSectors"
          :pieChartHoldings="homeAnalytics.pieChartHoldings"
          :pieChartIndustries="homeAnalytics.pieChartIndustries"
        />
      </section> -->
      <HoldingsList
        :isPublic="isPublic"
        :holdingsList="homeAnalytics.holdingsList.holdings"
      />

      <RealisedHoldingsList
        :isPublic="isPublic"
        :realisedHoldingsList="homeAnalytics.holdingsList.sold"
      />

      <DividendChart
        :withBtn="true"
        :hideTimeFrameBtns="true"
        :isHomePage="true"
        :chartDividendsProps="homeAnalytics.chartDividends"
        class="dividendChartDashboard"
        :isPublic="isPublic"
        :showTooltip="true"
        title="Past year dividends"
        tooltipText="Dividend payments are automatically added the day of payout. If you think there's missing payments, please add a portfolio with new files."
      />

      <section class="cardsContainer">
        <DepositsCard
          :showTooltip="true"
          tooltipText="Net amount deposited and withdrawn into and from your DEGIRO account."
          :isPublic="isPublic"
          :totalDeposits="homeAnalytics.totalDeposits"
        />
        <TransFeesCard
          :isPublic="isPublic"
          :totalTransactionFees="homeAnalytics.totalTransactionFees"
        />
        <TradeCountCard
          :isPublic="isPublic"
          :totalTradeCount="homeAnalytics.totalTradeCount"
        />
      </section>

      <DiversificationCard
        title="Holdings"
        :pieChartData="homeAnalytics.pieChartHoldings"
        :showBtn="true"
        :isPublic="isPublic"
      />
     
    </section>

    <Footer />

     <NotificationBar
        type="warning"
        v-if="homeAnalytics.unsupportedHoldingsAmount > 0"
      >
        {{homeAnalytics.unsupportedHoldingsAmount}} unsupported {{ homeAnalytics.unsupportedHoldingsAmount > 1 ? 'securities' : 'security' }} found. 
        All unsupported securities are excluded from calculations.
      </NotificationBar>
  </section>
  <LoadingOverlay
    text="Loading analytics.. This might take a few seconds."
    v-else
  />
</template>

<script>
import { Icon } from "@iconify/vue";

import Header from "@/components/layout/Header.vue";
import Breadcrumbs from "@/components/ui/Breadcrumbs.vue";
import TransFeesCard from "@/components/dashboard/TransFeesCard.vue";
// import BackButton from "@/components/ui/BackButton.vue";
import DiversificationCard from "@/components/ui/DiversificationCard.vue";
import DividendChart from "@/components/ui/DividendChart.vue";
import DepositsCard from "./components/DepositsCard.vue";
import TradeCountCard from "./components/TradeCountCard.vue";
import PortfolioCards from "./components/PortfolioCards.vue";
// import HoldingsPieChartCards from "./components/HoldingsPieChartCards.vue";
import HoldingsList from "./components/HoldingsList.vue";
import RealisedHoldingsList from "./components/RealisedHoldingsList.vue";
import Tooltip from "@/components/ui/Tooltip.vue";
import NotificationBar from "@/components/ui/NotificationBar.vue";
// import TotalProfitLossChart from "./components/TotalProfitLossChart.vue";

export default {
  name: "Dashboard",
  components: {
    NotificationBar,
    DividendChart,
    // TotalProfitLossChart,
    DiversificationCard,
    Tooltip,
    RealisedHoldingsList,
    DepositsCard,
    TradeCountCard,
    TransFeesCard,
    Header,
    Breadcrumbs,
    // BackButton,
    Icon,
    PortfolioCards,
    // Icon,
    // HoldingsPieChartCards,
    HoldingsList,
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
      accountAge: "",
      portfolioInfo: {
        portfolioName: null,
        startDate: null,
      },
      homeAnalytics: {
        totalProfitLoss: 0,
        totalProfitLossChart: [],
        totalProfitLossPercentage: 0,
        totalInvested: 0,
        totalInvestedPercentage: 0,
        totalBalance: 0,
        totalCash: 0,
        totalTradeCount: 0,
        totalTransactionFees: 0,
        chartDividends: null,
        holdingsList: {
          holdings: [],
          sold: [],
        },
        pieChartCurrencies: null,
        pieChartHoldings: null,
        startDate: null,
        portfolioNotFound: false,
        hasAnyUnsupportedHoldings: false,
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
    hasSharedHomeAnalytics() {
      let sharedAnalytics = this.$store.getters["files/getSharedAnalytics"];
      if (sharedAnalytics.length > 0) {
        for (let i = 0; i < sharedAnalytics.length; i++) {
          if (
            Object.keys(sharedAnalytics[i]).includes(this.$route.params.pid)
          ) {
            if (
              sharedAnalytics[i][this.$route.params.pid].homeAnalytics !==
              undefined
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    getSharedHomeAnalytics() {
      if (this.isPublic === true) {
        const sharedAnalytics = this.$store.getters["files/getSharedAnalytics"];
        for (let i = 0; i < sharedAnalytics.length; i++) {
          if (
            Object.keys(sharedAnalytics[i]).includes(this.$route.params.pid)
          ) {
            return sharedAnalytics[i][this.$route.params.pid].homeAnalytics;
          }
        }
      }
      return null;
    },
    hasFirebaseTime() {
      return (
        !!this.portfolioInfo.addedAt?._seconds &&
        !!this.portfolioInfo.addedAt?._nanoseconds
      );
    },
    hasPortfolios() {
      return this.$store.getters["files/hasPortfolios"];
    },
  },
  watch: {
    hasPortfolios() {
      this.getPortfolioInfo();
    },
    hasSharedHomeAnalytics() {
      if (this.hasSharedHomeAnalytics === true) {
        this.loadData();
      }
    },
    hasHomeAnalytics() {
      if (this.hasHomeAnalytics === true) {
        this.loadData();
      }
    },
    hasFirebaseTime() {
      if (this.hasFirebaseTime === true) {
        this.convertFirebaseTime();
      }
    },
    // wanneer de route veranderd, laad opnieuw data in
    $route() {
      if (this.$route.params.id === undefined) return;

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
    openThreeDots() {
      window.alert("Coming soon!");
    },
    convertFirebaseTime() {
      // als de addedAt nog in de seconds en nanoseconds object format staat
      if (
        this.portfolioInfo.addedAt._seconds &&
        this.portfolioInfo.addedAt._nanoseconds
      ) {
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
      if (!this.isPublic) {
        if (this.hasHomeAnalytics === true) {
          this.homeAnalytics = this.getHomeAnalytics;
          this.getPortfolioInfo();
          this.isLoading = false;
        } else {
          this.$store
            .dispatch("files/fetchPortfolioAnalytics", {
              type: "home",
              portfolioId: this.$route.params.id,
            })
            .then(() => {
              this.sendTo404IfNotExists();
              this.isLoading = false;
            })
            .catch((e) => {
              console.log(e);
            });
        }
      } else if (this.isPublic) {
        if (this.hasSharedHomeAnalytics === true) {
          this.homeAnalytics = this.getSharedHomeAnalytics;
          this.isLoading = false;
        } else {
          this.$store
            .dispatch("files/fetchSharedPortfolioAnalytics", {
              type: "home",
              userId: this.$route.params.uid,
              portfolioId: this.$route.params.pid,
            })
            .then(() => {
              this.sendTo404IfNotExists();
              this.isLoading = false;
            });
        }
      }
    },
    sendTo404IfNotExists() {
      if (this.hasHomeAnalytics === false) {
        this.$router.replace("/404");
      }
    },
    setLatestPortfolioId() {
      // to local storage
      localStorage.setItem("lastPortfolioId", this.$route.params.id);
    },
  },
  created() {
    this.isLoading = true;
    this.loadData();
    this.setLatestPortfolioId();
  },
};
</script>

<style scoped>
.privateBtns {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
.header__rightSection-dates {
  display: flex;
  align-items: center;
  justify-content: center;
}
.sharedPortfolioOwnerText {
  color: var(--clr-grey);
  font-weight: 300;
}

.dashboardSpinner {
  height: 10rem;
}

.holdingsContainer {
  display: grid;
  grid-template-columns: 1fr;
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
  transition: 0.2s all;
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
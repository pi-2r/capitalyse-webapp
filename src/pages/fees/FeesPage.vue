<template>
  <Header />
  <section class="container" v-if="!isLoading">
    <SharedPortfolioIcon
      :displayName="feesAnalytics.sharedPortfolioOwner.displayName"
      :email="feesAnalytics.sharedPortfolioOwner.email"
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
          ? feesAnalytics.portfolioMetadata.portfolioName
          : portfolioInfo.portfolioName
      "
      thirdLink="#"
      thirdLinkName="Fees & Costs"
    />

    <section class="titleAndBackButtonContainer">
      <BackButton />
      <h1>Fees & Costs</h1>
    </section>

      <FeesChart :chartFeesProps="feesAnalytics.chartFees" />

    <section class="cardsContainer">
      <TransFeesCard
        :withBtn="false"
        :totalTransactionFees="feesAnalytics.totalTransactionFees"
      />
    
      <ExchangeFeesCard :totalExchangeFees="feesAnalytics.totalExchangeFees" />

       <ResultCard
        :showTooltip="true"
        tooltipText="Taxes on transactions in financial instruments in BE, FR, GR, IT, ES, IR & UK. 
          Look up 'Financial Transaction Tax DEGIRO' for more information."
        title="Financial transaction tax"
        :resultValue="feesAnalytics.totalFTTFees"
        :withBtn="false"
      />

      <ResultCard
        :showTooltip="true"
        tooltipText="Taxes on transactions in financial instruments in IR, HK & GB. Look up 'Stamp duty fees DEGIRO' for more information."
        title="Stamp duty fees"
        :resultValue="feesAnalytics.totalStampDutyFees"
        :withBtn="false"
      />
     
      <ResultCard
        :showTooltip="true"
        tooltipText="Portfolios maintaining positions in American Depository Receipts (ADRs) are subject to periodic fees intended to compensate the agent bank providing custodial services on behalf of the ADR. These services typically, include inventorying the foreign stocks underlying the ADR and managing all registration, compliance and record-keeping services."
        title="ADR/GDR Pass-through fees"
        :resultValue="feesAnalytics.totalADRPassThroughFees"
        :withBtn="false"
      />

        <ResultCard
        :showTooltip="true"
        tooltipText="Takes all your transactions and calculates the average transaction fee per trade."
        title="Avg transaction fee per trade"
        :resultValue="feesAnalytics.avgTransactionFeePerTrade"
        :withBtn="false"
      />
    </section>
  </section>

  <section v-else>
    <LoadingOverlay />
  </section>
</template>

<script>
import SharedPortfolioIcon from "@/components/ui/SharedPortfolioIcon.vue";
import ResultCard from "@/components/dashboard/ResultCard.vue";
import Breadcrumbs from "@/components/ui/Breadcrumbs.vue";
import Header from "@/components/layout/Header.vue";
import TransFeesCard from "@/components/dashboard/TransFeesCard.vue";
import BackButton from "@/components/ui/BackButton.vue";

import ExchangeFeesCard from "./components/ExchangeFeesCard.vue";
import FeesChart from "./components/FeesChart.vue";

export default {
  components: {
    Breadcrumbs,
    ResultCard,
    Header,
    BackButton,
    TransFeesCard,
    SharedPortfolioIcon,
    ExchangeFeesCard,
    FeesChart,
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
      feesAnalytics: {
        totalExchangeFees: 0,
        totalTransactionFees: 0,
        chartFees: [],
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
    getFeesAnalytics() {
      const analytics = this.$store.getters["files/getAnalytics"];
      for (let i = 0; i < analytics.length; i++) {
        if (Object.keys(analytics[i]).includes(this.$route.params.id)) {
          return analytics[i][this.$route.params.id].feesAnalytics;
        }
      }
      return null;
    },
    hasSharedFeesAnalytics() {
      let sharedAnalytics = this.$store.getters["files/getSharedAnalytics"];
      if (sharedAnalytics.length > 0) {
        for (let i = 0; i < sharedAnalytics.length; i++) {
          if (
            Object.keys(sharedAnalytics[i]).includes(this.$route.params.pid)
          ) {
            if (
              sharedAnalytics[i][this.$route.params.pid].feesAnalytics !==
              undefined
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    getSharedFeesAnalytics() {
      if (this.isPublic === true) {
        const sharedAnalytics = this.$store.getters["files/getSharedAnalytics"];
        for (let i = 0; i < sharedAnalytics.length; i++) {
          if (
            Object.keys(sharedAnalytics[i]).includes(this.$route.params.pid)
          ) {
            return sharedAnalytics[i][this.$route.params.pid].feesAnalytics;
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
    hasFeesAnalytics() {
      if (this.hasFeesAnalytics === true) {
        this.loadData();
      }
    },
    hasSharedFeesAnalytics() {
      if (this.hasSharedFeesAnalytics === true) {
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
        if (this.hasFeesAnalytics === true) {
          this.feesAnalytics = this.getFeesAnalytics;
          this.getPortfolioInfo();
          this.isLoading = false;
        } else {
          this.$store
            .dispatch("files/fetchPortfolioAnalytics", {
              type: "fees",
              portfolioId: this.$route.params.id,
            })
            .then(() => {
              this.isLoading = false;
            });
        }
      } else {
        if (this.hasSharedFeesAnalytics === true) {
          this.feesAnalytics = this.getSharedFeesAnalytics;
          this.isLoading = false;
        } else {
          this.$store
            .dispatch("files/fetchSharedPortfolioAnalytics", {
              type: "fees",
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
.feesChart {
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
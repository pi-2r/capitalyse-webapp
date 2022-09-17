<template>
  <Header :isDemo="isDemo"></Header>

  <section class="container">
    <!-- <BackButton to="/" class="backButton" color="var(--clr-grey)" /> -->
    <section class="head">
      <section>
        <Breadcrumbs
          baseLink="/portfolios"
          baseLinkName="Portfolios"
          secondLink="#"
          :secondLinkName="
            !isDemo ? (portfolioName ? portfolioName : '') : 'Demo'
          "
        />
        <section>
          <section class="titleAndBackButtonContainer">
            <h1 v-if="!isDemo">{{ portfolioName }}</h1>
            <h1 v-else>Portfolio Demo</h1>
          </section>
        </section>
      </section>
      <section class="head__rightSection">
        <section class="header__rightSection-dates">
          <p class="startDate">
            Portfolio: {{ accountAge ? accountAge : "--/--/--" }}
          </p>
          <p class="startDate">
            Uploaded: {{ addedAt ? addedAt : "--/--/--" }}
          </p>
        </section>
        <section class="head__rightSection-icon">
          <Icon
            @click="openThreeDots"
            class="head_"
            icon="entypo:dots-three-vertical"
            height="18"
          />
        </section>
      </section>
    </section>
    
    <section >
      <PortfolioCards />

      

      <section class="holdingsContainer">
        <HoldingsPieChartCards />
      </section>

      <section class="cardsContainer">
        <DepositsCard :isDemo="isDemo" />
        <TransFeesCard :isDemo="isDemo" />
        <TradingVolCard :isDemo="isDemo" />
      </section>

      <DividendChart
        :hideTimeFrameBtns="false"
        class="dividendChartDashboard"
      />

      <HoldingsList/>
    </section>
    
  </section>
</template>

<script>
import { Icon } from "@iconify/vue";

import Header from "@/components/layout/Header.vue";
import Breadcrumbs from "@/components/ui/Breadcrumbs.vue";
import TransFeesCard from "@/components/dashboard/TransFeesCard.vue";
// import BackButton from "@/components/ui/BackButton.vue";

import firebaseDateMixin from "@/mixins/helpers/dateToWords.js";

import DividendChart from "@/components/ui/DividendChart.vue";
import DepositsCard from "./components/DepositsCard.vue";
import TradingVolCard from "./components/TradingVolCard.vue";
import PortfolioCards from "./components/PortfolioCards.vue";
import HoldingsPieChartCards from "./components/HoldingsPieChartCards.vue";
import HoldingsList from './components/HoldingsList.vue';

export default {
  mixins: [firebaseDateMixin],
  name: "Dashboard",
  components: {
    DividendChart,
    DepositsCard,
    TradingVolCard,
    TransFeesCard,
    Header,
    Breadcrumbs,
    // BackButton,
    PortfolioCards,
    Icon,
    HoldingsPieChartCards,
    HoldingsList
  },
  props: {
    isDemo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      accountAge: "",
      addedAt: null,
    };
  },
  computed: {
    portfolioName() {
      return this.$store.getters["files/getCurrentPortfolioName"];
    },
    hasCurrentPortfolio() {
      // pakt alle portfolios van store en kijkt met het id van de url of de goede in de store zit
      const portfolios = this.$store.getters["files/getPortfolios"];
      for (let i = 0; i < portfolios.length; i++) {
        if (portfolios[i].id === this.$route.params.id) {
          return true;
        }
      }
      return false;
    },
    hasCurrentFiles() {
      // pakt alle portfolios van storekijkt of elke file van het juiste portfolio in de store zit
      const portfolios = this.$store.getters["files/getPortfolios"];
      let hasFiles = false;

      portfolios.forEach((portfolio) => {
        if (portfolio.id === this.$route.params.id) {
          if (
            portfolio.accountFile &&
            portfolio.transactionsFile &&
            portfolio.portfolioFile
          ) {
            hasFiles = true;
          }
        }
      });
      return hasFiles;
    },
    hasPortfolios() {
      return this.$store.getters["files/hasPortfolios"];
    },
    files() {
      return this.$store.getters["files/getCurrentPortfolio"];
    },
  },
  watch: {
    hasPortfolios() {
      this.loadData();
    },
    // dit werkt wanneer je gelijk van de ene naar de andere portfolio gaat
    files() {
      if (this.hasCurrentFiles) {
        this.calculateStartAndEndDates();
        this.convertFirebaseTime();
      }
    },
    // dit werkt wanneer je nieuw op de pagina komt
    hasCurrentFiles() {
      if (this.hasCurrentFiles) {
        this.calculateStartAndEndDates();
        this.convertFirebaseTime();
      }
    },
    // wanneer de route veranderd, laad opnieuw data in
    $route() {
      this.loadData();
    },
  },
  methods: {
    // drie puntjes op het dashboard
    openThreeDots() {
      window.alert("Coming soon!");
    },
    // dit is de functie die de start en einddatum berekent
    calculateStartAndEndDates() {
      const today = new Date();
      // accountfile is nodig om de startdatum te bepalen
      const accountFile = this.files.accountFile;

      // pakt eerste gebeurtenis de datum daarvan en maakt er een datum object van
      let startDate = accountFile[accountFile.length - 2][0];
      startDate = new Date(
        startDate.split("-")[2],
        startDate.split("-")[1] - 1,
        startDate.split("-")[0]
      );
      // dagen maanden en jaren om er zo een zin van te maken
      let days = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
      let months = Math.floor(days / 30);
      const years = Math.floor(months / 12);

      // maakt er een zin van
      if (years > 0) {
        this.accountAge =
          years +
          " year" +
          (years > 1 ? "s" : "") +
          " and " +
          (months - years * 12) +
          " month" +
          (months - years * 12 > 1 ? "s" : "");
      } else if (months > 0) {
        this.accountAge =
          months +
          " month" +
          (months > 1 ? "s" : "") +
          " and " +
          (days - months * 30) +
          " day" +
          (days - months * 30 > 1 ? "s" : "");
      } else {
        this.accountAge = days + " day" + (days > 1 ? "s" : "");
      }
    },
    convertFirebaseTime() {
      // als de addedAt nog in de seconds en nanoseconds object format staat
      if (this.files.addedAt.seconds && this.files.addedAt.nanoseconds) {
        const firebaseDateTime = new Date(
          this.files.addedAt.seconds * 1000 +
            this.files.addedAt.nanoseconds / 1000000
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
        this.addedAt = firebaseDate + " " + firebaseTime;
        // wanneer deze in een leesbaar formaat staat
      } else {
        this.addedAt = this.files.addedAt;
      }
    },
    loadData() {
      if (this.isDemo === false) {
        // if doesnt have current portfolio's files, but has current portfolio's meta-data
        if (!this.hasCurrentFiles && this.hasCurrentPortfolio) {
          this.$store.dispatch(
            "files/fetchOnePortfolio",
            this.$route.params.id
          );
        }

        // if has current portfolio's meta-data
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

    if (this.hasCurrentFiles) {
      this.calculateStartAndEndDates();
      this.convertFirebaseTime();
    }
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
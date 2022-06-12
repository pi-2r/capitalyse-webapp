<template>
  <Header></Header>

  <section class="container">
    <section class="head">
      <section>
        <Breadcrumbs
          baseLink="/portfolios"
          baseLinkName="My Portfolios"
          secondLink="#"
          :secondLinkName="'Dashboard ' + (portfolioName ? portfolioName : '')"
        />
        <section>
          <section class="titleAndBackButtonContainer">
            <BackButton />
            <h1>Dashboard {{ portfolioName }}</h1>
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
            color="var(--clr-grey)"
            height="18"
          />
        </section>
      </section>
    </section>

    <PortfolioCards />

    <DividendChart class="dividendChartDashboard" />

    <section class="cardsContainer">
      <DepositsCard :isDemo="isDemo"/>
      <TransFeesCard :isDemo="isDemo"/>
      <TradingVolCard :isDemo="isDemo"/>
    </section>
  </section>
</template>

<script>
import { Icon } from "@iconify/vue";

import Header from "@/components/layout/Header.vue";
import Breadcrumbs from "@/components/ui/Breadcrumbs.vue";
import TransFeesCard from "@/components/dashboard/TransFeesCard.vue";
import BackButton from "@/components/ui/BackButton.vue";

import firebaseDate from "@/mixins/helpers/dateToWords.js";

import DividendChart from "./components/DividendChart.vue";
import DepositsCard from "./components/DepositsCard.vue";
import TradingVolCard from "./components/TradingVolCard.vue";
import PortfolioCards from "./components/PortfolioCards.vue";

export default {
  mixins: [firebaseDate],
  name: "Dashboard",
  components: {
    DividendChart,
    DepositsCard,
    TradingVolCard,
    TransFeesCard,
    Header,
    Breadcrumbs,
    BackButton,
    PortfolioCards,
    Icon,
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
    files() {
      return this.$store.getters["files/getCurrentPortfolio"];
    },
  },
  watch: {
    hasPortfolios() {
      this.loadData();
    },
    hasCurrentFiles() {
      this.calculateStartAndEndDates();
      this.convertFirebaseTime();
    },
  },
  methods: {
    openThreeDots() {
      window.alert("Coming soon!");
    },
    calculateStartAndEndDates() {
      const today = new Date();
      const accountFile = this.files.accountFile;

      let startDate = accountFile[accountFile.length - 2][0];
      startDate = new Date(
        startDate.split("-")[2],
        startDate.split("-")[1] - 1,
        startDate.split("-")[0]
      );
      let days = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
      let months = Math.floor(days / 30);
      const years = Math.floor(months / 12);

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
      } else {
        this.addedAt = this.files.addedAt;
      }
    },
    loadData() {
      if (this.isDemo === false) {
        if (!this.hasCurrentFiles && this.hasCurrentPortfolio) {
          this.$store.dispatch(
            "files/fetchOnePortfolio",
            this.$route.params.id
          );
        } else if (!this.hasCurrentPortfolio) {
          this.$store.dispatch("files/fetchAllPortfolios");
        }

        if (this.hasCurrentPortfolio) {
          this.setCurrentPortfolio(this.$route.params.id);
        }
      } else if (this.isDemo === true) {
        this.$store.commit("files/setDemoAsCurrentPortfolio");
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
.titleAndBackButtonContainer {
  margin-bottom: 0;
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
}

.head__rightSection-icon:hover {
  cursor: pointer;
  background-color: var(--clr-very-light-blue);
}

.dividendChartDashboard {
  margin-bottom: 3rem;
}

.cardsContainer {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
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

@media screen and (min-width: 1050px) {
  .cardsContainer {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .container {
    max-width: 1000px;
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
}
</style>
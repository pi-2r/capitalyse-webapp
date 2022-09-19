<template>
  <section>
    <h2 class="addPortfolioCardTitle">(1/2) Export from DEGIRO</h2>
    <p class="addPortfolioCardDesc">
      For each file, click ‘Get file’  
      <Icon icon="akar-icons:arrow-right" class="descIcon" /> Login to DEGIRO 
      <Icon icon="akar-icons:arrow-right" class="descIcon" /> <span class="degiroExportButton">Click '<Icon icon="icons8:download" class="descIcon" />Export</span>' on the right 
      <Icon icon="akar-icons:arrow-right" class="descIcon" /> Click 'CSV'
    </p>

    <section class="exportFiles__fileCards">
      <section
        class="exportFiles__fileCard"
        :class="{ hasClicked__cardStyle: hasClickedPortfolioFile }"
      >
        <section class="exportFiles__fileCard-fileName">
          <Icon
            v-if="hasClickedPortfolioFile"
            icon="ci:download-done"
            class="doneIcon"
          />
          <Icon v-else icon="akar-icons:download" class="downloadIcon" />
          <span>Portfolio.csv</span>
        </section>
        <section class="exportFiles__fileCard-btnSection">
          <a
            href="https://trader.degiro.nl/staging-trader/#/portfolio"
            target="_blank"
            class="exportFiles__fileCard-getBtn"
            :class="{ hasClicked__cardStyle: hasClickedPortfolioFile }"
            @click="clickedCard('portfolio')"
          >
            <Icon icon="akar-icons:link-out" class="downloadIcon" />
            Get file
          </a>
        </section>
      </section>

      <section
        class="exportFiles__fileCard"
        :class="{ hasClicked__cardStyle: hasClickedAccountFile }"
      >
        <section class="exportFiles__fileCard-fileName">
          <Icon
            v-if="hasClickedAccountFile"
            icon="ci:download-done"
            class="doneIcon"
          />
          <Icon v-else icon="akar-icons:download" class="downloadIcon" />
          <span>Account.csv</span>
        </section>
        <section class="exportFiles__fileCard-btnSection">
          <a
            :href="accountLink"
            target="_blank"
            class="exportFiles__fileCard-getBtn"
            :class="{ hasClicked__cardStyle: hasClickedAccountFile }"
            @click="clickedCard('account')"
          >
            <Icon icon="akar-icons:link-out" class="downloadIcon" />
            Get file
          </a>
        </section>
      </section>

      <section
        class="exportFiles__fileCard"
        :class="{ hasClicked__cardStyle: hasClickedTransactionsFile }"
      >
        <section class="exportFiles__fileCard-fileName">
          <Icon
            v-if="hasClickedTransactionsFile"
            icon="ci:download-done"
            class="doneIcon"
          />
          <Icon v-else icon="akar-icons:download" class="downloadIcon" />
          <span>Transactions.csv</span>
        </section>
        <section class="exportFiles__fileCard-btnSection">
          <a
            :href="transactionsLink"
            target="_blank"
            class="exportFiles__fileCard-getBtn"
            :class="{ hasClicked__cardStyle: hasClickedTransactionsFile }"
            @click="clickedCard('transactions')"
          >
            <Icon icon="akar-icons:link-out" class="downloadIcon" />
            Get file
          </a>
        </section>
      </section>
    </section>
    <section class="btnSection">
      <section class="btnSection__btns">
        <Button v-if="!hasClickedAllFiles" class="secondary" @click="next('skip')">Skip</Button>
        <Button class="nextBtn" :class="{ hasClickedAll__btnStyle: hasClickedAllFiles }" @click="next()">
          Next
          <Icon icon="akar-icons:arrow-right" class="downloadIcon" :class="{ nextArrowWiggle: hasClickedAllFiles }"/>
        </Button>
      </section>
    </section>
  </section>
</template>
<script>
import { Icon } from "@iconify/vue";

export default {
  data() {
    return {
      hasClickedPortfolioFile: false,
      hasClickedAccountFile: false,
      hasClickedTransactionsFile: false,
    };
  },
  components: {
    Icon,
  },
  computed: {
    hasClickedAllFiles() {
      if (
        this.hasClickedPortfolioFile &&
        this.hasClickedAccountFile &&
        this.hasClickedTransactionsFile
      ) {
        return true;
      } else {
        return false;
      }
    },
    accountLink() {
      // maakt link met de correcte einddatum
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      const date = yyyy + "-" + mm + "-" + dd;

      return `https://trader.degiro.nl/staging-trader/#/account-overview?fromDate=2000-01-01&toDate=${date}&aggregateCashFunds=true&currency=Alle`;
    },
    transactionsLink() {
      // maakt link met de correcte einddatum
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      const date = yyyy + "-" + mm + "-" + dd;

      return `https://trader.degiro.nl/staging-trader/#/transactions?fromDate=2000-01-01&toDate=${date}&aggregateCashFunds=true&currency=Alle`;
    },
  },
  methods: {
    next(type) {
      if(this.hasClickedAllFiles || type === 'skip') {
        this.$emit('next');

        this.hasClickedPortfolioFile = false;
        this.hasClickedAccountFile = false;
        this.hasClickedTransactionsFile = false;
      }
    },
    clickedCard(card) {
      if (card === "portfolio") {
        this.hasClickedPortfolioFile = true;
      } else if (card === "transactions") {
        this.hasClickedTransactionsFile = true;
      } else if (card === "account") {
        this.hasClickedAccountFile = true;
      }
    },
  },
};
</script>
<style scoped>
.nextArrowWiggle {
   animation: wiggleArrow 0.75s infinite;
}

.degiroExportButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.secondary {
  border: none;
  padding-right: 0.5rem;
  font-weight: 400;
  color: var(--clr-grey);
  font-size: 0.95rem;
}
.secondary:hover {
  box-shadow: none;
  text-decoration: underline;
}
.btnSection {
  display: flex;
  justify-content: flex-end;
}
.hasClickedAll__btnStyle {
  background-color: var(--clr-blue) !important;
  cursor: pointer !important;
}
.nextBtn {
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 0.5rem;
  background-color: var(--clr-medium-light-grey);
  cursor: default;
  font-size: 1.1rem;
  padding: 0.75rem 1rem;
  box-shadow: none;
}
.nextBtn:hover {
  box-shadow: none;
}

.hasClicked__cardStyle {
  background-color: rgba(0, 128, 0, 0.15) !important;
  border-color: rgba(0, 128, 0, 0.15) !important;
  color: var(--clr-green) !important;
}

.exportFiles__fileCard-getBtn {
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  font-size: 1rem;
  padding: 0.75rem;
  margin: 0;
  border-radius: var(--btn-radius);
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  color: var(--clr-blue);
  font-weight: 500;
  transition: 0.2s all;
  border: 1px solid transparent;
}
.exportFiles__fileCard-getBtn:hover {
  background-color: var(--clr-light-blue);
  border: 1px solid var(--clr-blue);
  cursor: pointer;
}
.exportFiles__fileCard-btnSection {
  padding-left: 0;
}
.btnSection__btns {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}
.downloadIcon {
  transform: scale(1.1);
}
.doneIcon {
  transform: scale(1.4);
}
.exportFiles__fileCards {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.exportFiles__fileCard {
  transition: 0.2s all;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--clr-light-grey);
  border-radius: var(--btn-radius);
  color: var(--clr-grey);
  background-color: var(--clr-white);
}
.exportFiles__fileCard-fileName {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.75rem;
  padding-right: 0;
  gap: 0.5rem;
}

.addPortfolioCardTitle {
  font-size: 1.4rem;
  margin-bottom: 1rem;
}

.addPortfolioCardDesc {
  margin-top: 0.5rem;
  color: var(--clr-grey);
  font-size: 0.9rem;
}

@keyframes wiggleArrow {
  0% {
    transform: translateX(-2px);
  }
  50% {
    transform: translateX(2px);
  }
  100% {
    transform: translateX(-2px);
  }
}
</style>
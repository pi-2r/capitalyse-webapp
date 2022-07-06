<template>
  <section class="addPortfolioHelp">
    <h2>Need some help?</h2>

    <ExpandingCard :id="0">
      <h3 class="contentTitle">
        Easy Export
        <span class="contentTitleThin">
          <Icon
            icon="fluent:checkmark-12-filled"
            color="var(--clr-green)"
            height="17"
          />
          Faster method
        </span>
      </h3>
      <p>
        For each file, click the "Export" button in the top right, then select
        "CSV".
      </p>
      <p>
        <a
          href="https://trader.degiro.nl/staging-trader/#/portfolio"
          target="_blank"
          >Portfolio File</a
        >
        <br />
        <a :href="transactionsLink" target="_blank">Transactions File</a>
        <br />
        <a :href="accountLink" target="_blank">Account File</a>
      </p>
      <h3 class="contentTitle">
        Manual Export
        <span class="contentTitleThinWorseMethod">
          <Icon icon="akar-icons:info" color="orange" height="17" />
          Slower method
        </span>
      </h3>
      <p>
        If you wish to manually export the files, follow
        <a
          target="_blank"
          href="https://capitalyse.app/support/export-degiro-files"
        >
          our guide.</a
        >
      </p>
    </ExpandingCard>
  </section>
</template>
<script>
import { Icon } from "@iconify/vue";
import ExpandingCard from '@/components/ui/ExpandingCard.vue';

export default {
  components: {
    ExpandingCard,
    Icon,
  },
  computed: {
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
};
</script>
<style scoped>
.addPortfolioHelp {
  margin-top: 4rem;
}

.addPortfolioHelp h2 {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.contentTitle {
  margin-bottom: 0.4rem;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.contentTitle:last-of-type {
  margin-top: 2rem;
}
.contentTitleThin {
  background-color: rgba(0, 128, 0, 0.1);
  padding: 0.2rem;
  padding-left: 0.4rem;
  padding-right: 0.4rem;
  border-radius: 5px;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--clr-green);
  display: inline-flex;
  gap: 0.3rem;
  justify-content: center;
  align-items: center;
}
.contentTitleThinWorseMethod {
  background-color: rgba(207, 167, 9, 0.1);
  padding: 0.2rem;
  padding-left: 0.4rem;
  padding-right: 0.4rem;
  border-radius: 5px;
  font-weight: 600;
  font-size: 0.85rem;
  color: orange;
  display: inline-flex;
  gap: 0.3rem;
  justify-content: center;
  align-items: center;
}

.content p {
  color: var(--clr-dark-grey);
  margin-bottom: 1rem;
  font-size: 0.875rem;
  line-height: 1.15rem;
}
.content p:nth-last-child(1) {
  margin-bottom: 0;
}

a {
  color: #00a8ff;
}
</style>
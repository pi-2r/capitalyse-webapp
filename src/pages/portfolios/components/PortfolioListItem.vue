<template >
  <td class="portfolioNameTd">
    <router-link class="portfolioName" :to="'/dashboard/' + portfolio.id">
      {{ portfolio.portfolioName }}
      <Icon
        class="portfolioName__icon"
        icon="fa6-solid:arrow-right"
        color="var(--clr-blue)"
        height="13"
      />
    </router-link>
  </td>
  <td align="right" class="dateAdded">
    {{ dateToWords(portfolio.addedAt) }}
  </td>
  <td align="right" class="fileSize">{{ totalFileSize }} KB</td>
  <td class="actionsTd">
    <!-- update and edit -->
    <router-link :to="'/portfolios/' + portfolio.id + '/update'">
      <Icon
        icon="material-symbols:add-circle-outline-rounded"
        color="var(--clr-medium-light-grey-2)"
        height="20"
        class="actionBtn"
      />
    </router-link>
    <!-- <Icon icon="ci:edit"  height="22" color="orange" class="actionBtn"/> -->
    <!-- 
    <Icon
      icon="bxs:trash"
      height="20"
      class="actionBtn"
    /> -->
  </td>
</template>

<script>
import { Icon } from "@iconify/vue";

import dateToWords from "@/mixins/helpers/dateToWords";

export default {
  mixins: [dateToWords],
  components: {
    Icon,
  },
  props: {
    portfolio: {
      type: Object,
      required: true,
    },
  },
  computed: {
    totalDataPoints() {
      return this.portfolio.length;
    },
    transactionsFileSize() {
      return this.portfolio.transactionsFileSize
        ? Math.floor(this.portfolio.transactionsFileSize)
        : 0;
    },
    accountFileSize() {
      return this.portfolio.accountFileSize
        ? Math.floor(this.portfolio.accountFileSize)
        : 0;
    },
    portfolioFileSize() {
      return this.portfolio.portfolioFileSize
        ? Math.floor(this.portfolio.portfolioFileSize)
        : 0;
    },
    totalFileSize() {
      return (
        this.portfolioFileSize +
        this.transactionsFileSize +
        this.accountFileSize
      );
    },
  },
  methods: {
    openPortfolio(id) {
      this.$router.push(`/portfolios/${id}`);
    },
  },
};
</script>

<style scoped>
.actionsTd {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 0;
  padding-left: 0rem;
}

.actionsTd a {
  display: flex;
  align-items: center;
  justify-content: center;
}

.actionBtn {
  margin-left: 0.5rem;
  transition: 0.3s all;
  border-radius: 1000rem;
}
.actionsTd:hover .actionBtn {
  cursor: pointer;
  color: var(--clr-blue);
}

.dateAdded {
  padding-left: 0;
}
.portfolioNameTd {
  padding-right: 0;
}

.actionBtn:hover {
  cursor: pointer;
  color: var(--clr-red);
}

.portfolioName {
  color: var(--clr-blue);
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.portfolioName:hover {
  cursor: pointer;
}

.portfolioName:hover .portfolioName__icon {
  transform: translateX(3px);
}

.portfolioName__icon {
  margin-left: 0.35rem;
  transition: 0.15s all;
}

td {
  padding: 1rem 1.5rem;
  background-color: transparent;
  color: var(--clr-grey);
  font-size: 0.9rem;
}

.slide-fade-enter-active {
  transition: all 0.1s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.1s ease-in;
}
.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

@media screen and (max-width: 600px) {
  .fileSize {
    display: none;
  }
}
</style>
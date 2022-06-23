<template >
  <td class="portfolioNameTd">
    <router-link class="portfolioName" :to="'/dashboard/' + portfolio.id">
      {{ portfolio.portfolioName }}
      <Icon
        class="portfolioName__icon"
        icon="charm:arrow-right"
        color="var(--clr-blue)"
        height="15"
      />
    </router-link>
  </td>
  <td class="dateAdded">
    {{ dateToWords(portfolio.addedAt) }}
  </td>
  <td class="fileSize">{{ totalFileSize }} KB</td>
  <td class="actionsTd">
    <!-- update and edit -->
    <!-- <Icon icon="fluent:new-16-filled" color="var(--clr-blue)" height="22" class="actionBtn"/> -->
    <!-- <Icon icon="ci:edit"  height="22" color="orange" class="actionBtn"/> -->

    <Icon
      icon="bxs:trash"
      color="var(--clr-red)"
      height="20"
      class="actionBtn"
      @click="$emit('toggleDeletePopup', portfolio.id)"
    />
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
  emits: ["toggleDeletePopup"],
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
  padding-left: 0;
}

.actionBtn {
  margin-left: 0.5rem;
  transition: 0.3s all;
  border-radius: 1000rem;
}

.actionBtn:hover {
  cursor: pointer;
  background-color: var(--clr-very-light-grey);
  transform: scale(1.06);
}

.portfolioName {
  color: var(--clr-blue);
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.portfolioName:hover {
  cursor: pointer;
}

.portfolioName:hover .portfolioName__icon {
  transform: translateX(3px);
}

.portfolioName__icon {
  margin-left: 0.35rem;
  transition: 0.2s all;
}

td {
  padding: 1.1rem 1.5rem;
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
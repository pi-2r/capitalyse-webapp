<template>
  <td class="name">
     <router-link class="holdingName" :to="'/dashboard/' + portfolioId + '/holdings/' + holding.isin">
      {{ holding.name }}
      <Icon
        class="holdingName__icon"
        icon="fa6-solid:arrow-right"
        color="var(--clr-blue)"
        height="13"
      />
    </router-link>
    
  </td>
  <td class="u-align-right">
    {{ holding.amount }}
  </td>
  <td class="u-align-right">
    €{{ 
        parseFloat(holding.totalValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
     }}
  </td>
</template>
<script>
import { Icon } from "@iconify/vue";

export default {
  components: {
    Icon,
  },
  props: {
    holding: {
      type: Object,
      required: true,
    },
  },
  computed: {
    portfolioId() {
      return this.$route.id;
    }
  }
}
</script>
<style scoped>
.holdingName {
  color: var(--clr-blue);
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.2rem;
} 
.holdingName:hover {
  cursor: pointer;
}
.holdingName:hover .holdingName__icon {
  transform: translateX(3px);
}

.holdingName__icon {
  margin-left: 0.35rem;
  transition: 0.15s all;
}

.u-align-right {
  text-align: right;
}

.name {
  font-weight: 500;
}

td {
  padding: 1rem 1.75rem;
  background-color: transparent;
  color: var(--clr-grey);
  font-weight: 400;
  font-size: 0.9rem;
}

@media screen and (max-width: 650px) {
  td {
    padding: 0.9rem 1.5rem;
  }

  td:nth-child(2) {
    display: none;
  }
}
</style>
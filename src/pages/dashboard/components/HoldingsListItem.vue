<template>
  <td>
    <span class="holdingName cutText">
        {{ holding.name }}
        <Icon
          class="holdingName__icon"
          icon="fa6-solid:arrow-right"
          color="var(--clr-blue)"
          height="13"
        />
    </span>
    <br />
    <span class="secondary">
    {{ holding.isin }}  &#183; {{ holding.exchange }} &#183; {{ holding.code}}  &#183; {{ holding.type }}
    </span>
  </td>
  <td class="number">
    {{ holding.count }}
  </td>
  
  <td class="number">
    <span v-if="holding.costBasis > 0">
      {{
        Intl.NumberFormat("nl-nl", {
          style: "currency",
          currency: "EUR",
        }).format(holding.costBasis)
      }}
    </span>
    <span v-else> No data </span>
    <br />
    <span class="secondary" v-if="holding.costBasis > 0">
      {{
        Intl.NumberFormat("nl-nl", {
          style: "currency",
          currency: "EUR",
        }).format(holding.avgBuyPrice)
      }}
    </span>
  </td>
  <td class="number">
    <span>
      {{
        Intl.NumberFormat("nl-nl", {
          style: "currency",
          currency: "EUR",
        }).format(holding.value)
      }}
    </span>
    <br />
    <span class="secondary" v-if="holding.localCurrency !== 'EUR'">
      {{
        Intl.NumberFormat("nl-nl", {
          style: "currency",
          currency: holding.localCurrency,
        }).format(holding.localValue)
      }}
    </span>
  </td>
  <td
    class="number"
    :class="{ sellRedNumber: !isGain, buyGreenNumber: isGain }"
  >
    <span v-if="holding.costBasis > 0">
      {{
        Intl.NumberFormat("nl-nl", {
          style: "currency",
          currency: "EUR",
        }).format(holding.gain)
      }}
    </span>
    <br v-if="holding.costBasis > 0" />
    <span
      class="secondary"
      :class="{ sellRedNumber: !isGain, buyGreenNumber: isGain }"
      v-if="holding.costBasis > 0"
    >
      {{
        Intl.NumberFormat("nl-nl", {
          style: "percent",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(holding.gainPercentage)
      }}
    </span>
    <span v-else> No data </span>
  </td>

  <td class="number">
    <span :class="{ buyGreenNumber: hasDividend }">
      {{
        Intl.NumberFormat("nl-nl", {
          style: "currency",
          currency: "EUR",
        }).format(holding.totalDividends)
      }}
    </span>
  </td>

  <td class="number">
    <span>
      {{
        Intl.NumberFormat("nl-nl", {
          style: "percent",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(holding.weight)
      }}
    </span>
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
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    date() {

      // make month words and remove zero in front of days
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      let day = this.holding.date.split("-")[0];
      // remove 0 in front of day
      if (day.charAt(0) === "0") {
        day = day.slice(1);
      }
      let month = this.holding.date.split("-")[1];
      month = monthNames[month - 1];
      let year = this.holding.date.split("-")[2];

      return `${day} ${month} ${year}`;
    },
    hasDividend() {
      return this.holding.totalDividends > 0;
    },
    isGain() {
      return this.holding.gain >= 0;
    },
    fee() {
      if (this.holding.transactionFee != null) {
        return this.holding.transactionFee;
      } else {
        return null;
      }
    },
   
  },
};
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

.cutText {
  line-height: 1.075rem;
  width: 19rem;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.secondary {
  font-size: 0.8rem;
  color: var(--clr-medium-light-grey-2);
}

.number {
  text-align: right;
}

.buyOrSell {
  font-weight: 500;

  border-radius: var(--btn-radius);
  padding: 0.35rem 0.5rem;
  text-align: center;
}

.buyGreen {
  color: var(--clr-green);
  background-color: rgba(0, 128, 0, 0.1);
}

.buyGreenNumber {
  color: var(--clr-green);
}
.sellRedNumber {
  color: var(--clr-red);
}

.sellRed {
  color: var(--clr-red);
  background-color: rgba(128, 0, 0, 0.1);
}

td {
  padding: 0.65rem 0.65rem;
  background-color: transparent;
  color: var(--clr-dark-grey);
  font-weight: 400;
  font-size: 0.9rem;
}

td:nth-of-type(1) {
  padding-left: 1.75rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
td:nth-last-child(1) {
  padding-right: 1.75rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
</style>
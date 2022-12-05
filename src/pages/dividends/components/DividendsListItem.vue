<template>
  <td>
    <span class="buyOrSell" :class="{ buyGreen: isBuy, sellRed: !isBuy }">
      {{ dividend.total > 0 ? "Dividend" : "Dividend" }}
    </span>
  </td>
  <td>
    <span>
      {{ date }}
    </span>
  </td>
  <td>
    <span class="cutText">
      <!-- <router-link :to="'/dashboard/' + this.$route.params.id + '/holdings/' + dividend.isin"> -->
      {{ dividend.name }}
      <!-- </router-link> -->
    </span>
    <br />
    <span class="secondary">
      {{ dividend.description }} &#183; {{ dividend.isin }}
    </span>
  </td>
  <td class="number" v-if="dividend.dividendTax !== 0 && dividend.dividendTax !== null">
    {{
      Intl.NumberFormat("nl-nl", {
        style: "currency",
        currency: dividend.dividendTaxCurrency || 'USD',
      }).format(dividend.dividendTax)
    }}
  </td>
  <td class="number" v-else-if="dividend.dividendTax === 0 || dividend.dividendTax == null"></td>

   <td class="number">
    {{
      Intl.NumberFormat("nl-nl", {
        style: "currency",
        currency: dividend.localTotalCurrency || 'USD',
      }).format(dividend.localTotal - dividend.dividendTax)
    }}
  </td>
 
  <td class="number" v-if="dividend.total !== 0">
    <span :class="{ buyGreenNumber: isBuy, sellRedNumber: !isBuy }">
      {{
        Intl.NumberFormat("nl-nl", {
          style: "currency",
          currency: dividend.currency,
        }).format(dividend.total)
      }}
    </span>
    <br />
    <span class="secondary" :class="{ greenNumberSec: isBuy, redNumberSec: !isBuy }" v-if="dividend.localCurrency !== 'EUR'">
       {{
        Intl.NumberFormat("nl-nl", {
          style: "currency",
          currency: dividend.localCurrency,
        }).format(dividend.localTotal)
      }}
    </span>
  </td>
  <td class="number" v-if="dividend.total === 0"> </td>
</template>
<script>
export default {
  props: {
    dividend: {
      type: Object,
      required: true,
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

      let day = this.dividend.date.split("-")[0];
      // remove 0 in front of day
      if (day.charAt(0) === "0") {
        day = day.slice(1);
      }
      let month = this.dividend.date.split("-")[1];
      month = monthNames[month - 1];
      let year = this.dividend.date.split("-")[2];

      return `${day} ${month} ${year}`;
    },
    isBuy() {
      return this.dividend.total > 0;
    },
    fee() {
      if (this.dividend.transactionFee != null) {
        return this.dividend.transactionFee;
      } else {
        return null;
      }
    },
  },
};
</script>
<style scoped>
.greenNumberSec {
  font-size: 0.8rem;
  color: rgba(0, 128, 0, 0.5) !important;
}
.redNumberSec {
  font-size: 0.8rem;
  color: rgba(218, 106, 104, 0.5) !important;
}

.cutText {
  line-height: 1.1rem;
  width: 13rem;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.secondary {
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
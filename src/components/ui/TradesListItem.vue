<template>
  <td>
    <span class="buyOrSell" :class="{ buyGreen: isBuy, sellRed: !isBuy }">
      {{ trade.total > 0 ? "Sell" : "Buy" }}
    </span>
  </td>
  <td>
    <span>

    {{ date }}
    </span>
    <br />
    <span class="secondary">
      {{ trade.time }}
    </span>
  </td>
  <td>
    <span class="cutText">
      <!-- <router-link :to="'/dashboard/' + this.$route.params.id + '/holdings/' + trade.isin"> -->
      {{ trade.name }}
      <!-- </router-link> -->
    </span>
    <br />
    <span class="secondary">
      {{ trade.isin }} &#183; {{ trade.exchange }} &#183; {{ trade.ogCurrency }}
    </span>
  </td>
  <td class="number">
    {{ trade.count }}
  </td>
  <td class="number">
    {{
        Intl.NumberFormat("nl-nl", {
          style: "currency",
          currency: trade.ogCurrency,
        }).format(trade.price)
      }}
  </td>

   <td class="number">
       <span :class="{ sellRedNumber: fee < 0 }">
      {{
        Intl.NumberFormat("nl-nl", {
          style: "currency",
          currency: "EUR",
        }).format(fee)
      }}
       </span>
  </td>

  <td class="number">
    <span :class="{ buyGreenNumber: isBuy, sellRedNumber: !isBuy }">
      {{
        Intl.NumberFormat("nl-nl", {
          style: "currency",
          currency: "EUR",
        }).format(total)
      }}
    </span>
  </td>

 
</template>
<script>

export default {
  props: {
    trade: {
      type: Object,
      required: true,
    },
  },
  computed: {
    total() {
      if(this.trade.total < 0) {
        return this.trade.total * -1;
      }
      return this.trade.total
    },
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
      let day = this.trade.date.split("-")[0];
      // remove 0 in front of day
      if (day.charAt(0) === "0") {
        day = day.slice(1);
      }
      let month = this.trade.date.split("-")[1];
      month = monthNames[month - 1];
      let year = this.trade.date.split("-")[2];

      return `${day} ${month} ${year}`;
    },
    isBuy() {
      return this.trade.total < 0;
    },
    fee() {
      if(this.trade.transactionFee != null) {
        return this.trade.transactionFee
      } else {
        return null
      }
    }
  },
};
</script>
<style scoped>
.cutText {
  line-height: 1.1rem;
  width: 18rem;
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
  padding-top:  .75rem;
  padding-bottom: .75rem;
}
td:nth-last-child(1) {
  padding-right: 1.75rem;
  padding-top:  .75rem;
  padding-bottom: .75rem;
}

</style>
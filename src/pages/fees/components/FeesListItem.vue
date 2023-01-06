<template>
  <td>
    <span class="buyOrSell" :class="{ buyGreen: isBuy, sellRed: !isBuy }">
      {{ typeText }}
    </span>
  </td>
  <td>
    <span>
      {{ date }}
    </span>
    <br />
    <span class="secondary">
      {{ fee.time }}
    </span>
  </td>
  <td>
    <span class="cutText">
      <!-- <router-link :to="'/dashboard/' + this.$route.params.id + '/holdings/' + fee.isin"> -->
      {{ fee.desc }}
      <!-- </router-link> -->
    </span>
  </td>
 
  <td class="number" v-if="fee.amount !== 0">
    <span :class="{ buyGreenNumber: isBuy, sellRedNumber: !isBuy }">
      {{
        Intl.NumberFormat("nl-nl", {
          style: "currency",
          currency: fee.currency,
        }).format(fee.amount)
      }}
    </span>
  </td>
  <td class="number" v-if="fee.amount === 0">No data</td>
</template>
<script>
export default {
  props: {
    fee: {
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

      let day = this.fee.dateAsString.split("-")[0];
      // remove 0 in front of day
      if (day.charAt(0) === "0") {
        day = day.slice(1);
      }
      let month = this.fee.dateAsString.split("-")[1];
      month = monthNames[month - 1];
      let year = this.fee.dateAsString.split("-")[2];

      return `${day} ${month} ${year}`;
    },
    isBuy() {
      return this.fee.amount > 0;
    },
    typeText() {
      if(this.fee.type === 'transaction-fee') {
        return 'Transaction'
      } else if(this.fee.type === 'adr-gdr-fee') {
        return 'ADR/GDR'
      } else if(this.fee.type === 'stamp-duty-fee') {
        return 'Stamp Duty'
      } else if(this.fee.type === 'ftt-fee') {
        return 'Fin. Trans. Tax'
      } else if(this.fee.type === 'exchange-fee') {
        return 'Connection'
      } else {
        return 'Other Fee'
      }
    }
  },
};
</script>
<style scoped>
.cutText {
  line-height: 1.1rem;
  max-width: 35rem;
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
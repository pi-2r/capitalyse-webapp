<template>
  <td>
    <span
      class="depOrWith"
      :class="{ depositGreen: !isDeposit, withdrawalRed: isDeposit }"
    >
      {{ deposit.amount > 0 ? "Deposit" : "Withdrawal" }}
    </span>
  </td>
  <td>
    <span>
      {{ date }}
    </span>
    <br />
    <span class="secondary">
      {{ deposit.time }}
    </span>
  </td>
  <td>
    <span>
      {{ deposit.description }}
    </span>
    <br />
    <span class="secondary">
      {{ deposit.currency }}
    </span>
  </td>
  <td></td>
  <td
    class="number"
    :class="{ depositGreenNumber: !isDeposit, withdrawalRedNumber: isDeposit }"
  >
      <span >
        {{
          Intl.NumberFormat("nl-nl", {
            style: "currency",
            currency: "EUR",
          }).format(deposit.convertedAmount)
        }}
      </span>
      <br v-if="deposit.currency !== 'EUR'"/>
      <span class="secondary" :class="{ depositGreenNumberSec: !isDeposit, withdrawalRedNumberSec: isDeposit }" v-if="deposit.currency !== 'EUR'">
        {{ depositAmount }}
      </span>
  </td>
</template>
<script>
export default {
  props: {
    deposit: {
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
      let day = this.deposit.date.split("-")[0];
      // remove 0 in front of day
      if (day.charAt(0) === "0") {
        day = day.slice(1);
      }
      let month = this.deposit.date.split("-")[1];
      month = monthNames[month - 1];
      let year = this.deposit.date.split("-")[2];

      return `${day} ${month} ${year}`;
    },
    isDeposit() {
      return this.deposit.amount < 0;
    },
    depositAmount() {
      let amount;
      try {
        amount =
          Intl.NumberFormat("nl-nl", {
            style: "currency",
            currency: this.deposit.currency,
          }).format(this.deposit.amount) || " ";
      } catch (e) {
        amount =
          this.deposit.currency +
          " " +
          Intl.NumberFormat("nl-nl").format(this.deposit.amount);
      }

      return amount;
    },
  },
};
</script>
<style scoped>
.secondary {
  color: var(--clr-medium-light-grey-2);
}

.number {
  text-align: right;
}

.depositGreen {
  color: var(--clr-green);
  background-color: rgba(0, 128, 0, 0.1);
}

.depositGreenNumber {
  color: var(--clr-green);
}
.withdrawalRedNumber {
  color: var(--clr-red);
}
.depositGreenNumberSec {
  font-size: 0.8rem;
  color: rgba(0, 128, 0, 0.5);
}
.withdrawalRedNumberSec {
  font-size: 0.8rem;
  color: rgba(218, 106, 104, 0.5);
}

.withdrawalRed {
  color: var(--clr-red);
  background-color: rgba(128, 0, 0, 0.1);
}
.depOrWith {
  font-weight: 500;
  border-radius: var(--btn-radius);
  padding: 0.35rem 0.5rem;
  text-align: center;
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
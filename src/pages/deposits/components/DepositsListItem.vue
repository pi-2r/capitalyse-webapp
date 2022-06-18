<template>
  <td>
    {{ date }}
  </td>
  <td>
    {{ deposit.amount > 0 ? "Deposit" : "Withdrawal" }}
  </td>

  <td
    class="number"
    :class="{ depositGreen: isDeposit, withdrawalRed: !isDeposit }"
  >
    {{ depositAmount }}
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
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
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
    depositAmount() {
      let amount = this.deposit.amount;
      amount = amount.toFixed(2);
      amount = amount.replace(".", ",");
      return "€" + amount;
    },
    isDeposit() {
      return this.deposit.amount > 0;
    },
  },
};
</script>
<style scoped>
.number {
  text-align: right;
}

.depositGreen {
  color: var(--clr-green);
}

.withdrawalRed {
  color: var(--clr-red);
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
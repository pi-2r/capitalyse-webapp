<template>
  <section class="listSection__itemContent">
    <section
      class="weightBar"
      :style="[{ width: dynamicWidth + '%' }, { backgroundColor: bgColor }]"
    ></section>
    <section class="name cutText">
      {{ name }}
    </section>
    <section class="perc">
      {{ listItemNumber }}
    </section>
  </section>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dataset: {
      type: Object,
      required: true,
    },
    labels: {
      type: Array,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    listItemNrType: {
      type: String,
      required: true,
      default: "percent",
    },
  },
  computed: {
    listItemNumber() {
      console.log(this.listItemNrType);
      if (this.listItemNrType === "percent") {
        return Intl.NumberFormat("nl-nl", {
          style: "percent",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(this.amount / this.diversificationTotal);
      } else if (this.listItemNrType === "amount") {
        return Intl.NumberFormat("nl-nl", {
          style: "currency",
          currency: "EUR",
        }).format(this.amount);
      } else if (this.listItemNrType === "amountAndPercent") {
        return (
          Intl.NumberFormat("nl-nl", {
            style: "percent",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(this.amount / this.diversificationTotal) +
          " (" +
          Intl.NumberFormat("nl-nl", {
            style: "currency",
            currency: "EUR",
          }).format(this.amount) +
          ")"
        );
      }
      return 0;
    },
    diversificationTotal() {
      let tot = 0;
      for (let i = 0; i < this.dataset.datasets[0].data.length; i++) {
        const nr = this.dataset.datasets[0].data[i];
        tot += nr;
      }
      return tot;
    },
    biggestItemSize() {
      return this.dataset.datasets[0].data[0];
    },
    dynamicWidth() {
      const biggestItemSize = this.biggestItemSize;
      const amt = this.amount;
      const perc = (amt / biggestItemSize) * 100 + 4;
      return perc.toFixed(2);
    },
    bgColor() {
      return this.dataset.datasets[0].backgroundColor[this.index] + "45";
    },
  },
};
</script>
<style scoped>
.perc {
  color: var(--clr-grey);
}
.name {
  padding-left: 0.4rem;
  z-index: 2;
  font-weight: 500;
}
.cutText {
  line-height: 1.2rem;
  width: 15rem;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.weightBar {
  position: absolute;
  left: -0.5rem;
  background-color: #129bc921;
  padding: 1.2rem;
  padding-left: 0;
  padding-right: 0;
  z-index: 1;
  max-width: 104%;
  width: 104%;
  border-radius: var(--btn-radius);
}
.listSection__itemContent {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
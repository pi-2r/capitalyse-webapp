<template>
  <Card class="expandingCard">
    <button
      class="collapsible"
      @click="toggleCollapsible(id)"
    >
      How do I export files from DEGIRO?
    </button>
    <section class="content">
      <slot></slot>
    </section>
  </Card>
</template>

<script>
import Card from "@/components/ui/Card.vue";

export default {
  components: {
    Card,
  },
  props: {
    // requires a unique id for each collapsible
    // its the number of the collapisble in the html in order to match the right one
    id: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  methods: {
    toggleCollapsible() {
      // toggle de collapsible uitleg blokken dmv id van de html
      const collapsible = document.querySelectorAll(".collapsible")[this.id];
      const content = document.querySelectorAll(".content")[this.id];
      collapsible.classList.toggle("active");
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        content.style.padding = "0 1rem";
        content.style.borderBottom = "none";
      } else {
        content.style.maxHeight = "calc(" + content.scrollHeight + "px + 2rem)";
        content.style.padding = "1rem";
        content.style.borderBottom = "1px solid var(--clr-light-grey)";
      }
    },
  }
};
</script>
<style scoped>
.expandingCard {
  border: none;
}

.collapsible {
  background-color: var(--clr-very-light-blue);
  border-radius: var(--card-border-radius);
  color: var(--clr-black);
  cursor: pointer;
  padding: 1rem;
  width: 100%;
  border: 1px solid var(--clr-light-grey);
  text-align: left;
  outline: none;
  font-size: 1rem;
}

.collapsible:after {
  content: "\002B";
  color: var(--clr-dark-grey);
  font-weight: bold;
  float: right;
  margin-left: 5px;
}


.active {
  border-radius: var(--card-border-radius);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom: none;
}

.content {
  padding: 0 1rem;
  max-height: 0;
  overflow: hidden;
  border-radius: var(--card-border-radius);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  transition: all 0.3s ease-out;
  background-color: var(--clr-very-light-blue);
  margin-bottom: 0.75rem;
  border: 1px solid var(--clr-light-grey);
  border-top: none;
  border-bottom: none;
}
</style>
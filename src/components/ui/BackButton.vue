<template>
  <Icon
    icon="charm:arrow-left"
    @click="goBack"
    color="var(--clr-black)"
    height="27"
    class="backBtn"
  />
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
  components: {
    Icon,
  },
  props: {
    toHome: {
      type: Boolean,
      default: false,
    },
    to: {
      type: String,
      default: "",
    },
  },
  methods: {
    goBack() {
      if (this.to != "") {
        // als de 'to' prop er is, ga dan naar de meegegeven pagina
        if(this.to != 'other') {
          this.$router.push(this.to);
        }
      } else {
        // als de 'to' props er niet is, ga dan dit lijstje af
        if (this.toHome) {
          window.location.href = "https://www.capitalyse.app";
        } else if (window.history.length > 1) {
          this.$router.go(-1);
        } else {
          this.$router.push("/");
        }
      }
    },
  },
};
</script>

<style scoped>
.backBtn {
  margin-right: 0.1rem;
  cursor: pointer;
  transition: 0.15s all;
}

.backBtn:hover {
  transform: translateX(-2px);
}
</style>
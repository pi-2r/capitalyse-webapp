<template>
  <Icon
    icon="charm:arrow-left"
    @click="goBack"
    color="var(--clr-black)"
    height="25"
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
        } else if (window.history.length > 2) {
          this.$router.go(-1);
        } else {
          if(this.$route.params.id != undefined) {
            this.$router.push("/portfolio/" + this.$route.params.id);
          } else if (this.$route.params.uid != undefined && this.$route.params.pid != undefined) {
            this.$router.push("/shared/" + this.$route.params.uid + "/" + this.$route.params.pid);
          } else {
            this.$router.push("/");
          }
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
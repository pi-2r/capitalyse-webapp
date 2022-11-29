<template>
  <section class="live-dot__wrapper">
    <Tooltip icon="carbon:dot-mark" color="orange" class="live-dot">{{liveDotText}}</Tooltip>
  </section>
</template>
<script>
import Tooltip from "@/components/ui/Tooltip.vue";

export default {
  components: {
    Tooltip,
  },
  props: {
    liveDotText: {
      type: String,
      default: "Capitalyse uses EOD (End-of-day) data for stock quotes. Updates every day at 3AM.",
    },
  }
};
</script>
<style scoped>
.live-dot__wrapper {
  display: flex;
  align-items: center;
}
</style>
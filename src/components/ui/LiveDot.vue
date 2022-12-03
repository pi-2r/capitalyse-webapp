<template>
  <section class="live-dot__wrapper">
    <Tooltip icon="carbon:dot-mark" color="orange" class="live-dot">{{text}}</Tooltip>
    <!-- <div class="blob orange"></div> -->
  </section>
</template>
<script>
import Tooltip from "@/components/ui/Tooltip.vue";

export default {
  components: {
    Tooltip,
  },
  props: {
    text: {
      type: String,
      default: "Capitalyse uses EOD (End-of-day) data for stock quotes. Updates every day at 3AM.",
    },
  }
};
</script>
<style scoped>
.blob {
  background: black;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
  margin: 10px;
  height: 0.5rem;
  width: 0.5rem;
  transform: scale(1);
  animation: pulse-black 3s infinite;
}

.blob.orange {
  background: rgba(255, 121, 63, 1);
  box-shadow: 0 0 0 0 rgba(255, 121, 63, 1);
  animation: pulse-orange 3s infinite;
}

@keyframes pulse-orange {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 121, 63, 0.7);
  }
   70% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 121, 63, 0.7);
  }
  
  99% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(255, 121, 63, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 121, 63, 0);
  }
}


@keyframes pulse-black {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  }
  70% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  }
  99% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}


.live-dot__wrapper {
  display: flex;
  align-items: center;
}
</style>
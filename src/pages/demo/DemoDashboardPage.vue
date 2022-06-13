<template>
  <DemoOverlay />
  <DashboardPage :isDemo="true" />
</template>
<script>
import DashboardPage from '@/pages/dashboard/DashboardPage.vue';
import DemoOverlay from '@/pages/demo/components/DemoOverlay.vue';

export default {
  components: {
    DashboardPage,
    DemoOverlay
  },
}
</script>
<template >
    <Icon icon="akar-icons:arrow-left" @click="goBack" color="var(--clr-blue)" height="28" class="backBtn"/>
</template>
<script>
import { Icon } from '@iconify/vue';

export default {
    components: {
        Icon
    },
    props: {
        toHome: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        goBack() {
            if(this.toHome) {
                this.$router.push('/');
            } else if(window.history.length > 1 ) {
                this.$router.go(-1);
            } else {
                this.$router.push('/');
            }
        }
    }
}
</script>
<style scoped>
.backBtn {
  margin-right: 0.5rem;
  cursor: pointer;
  transition: 0.2s all;
}

.backBtn:hover {
  transform: translateX(-1px);
}
</style>
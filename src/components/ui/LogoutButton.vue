<template>
    <section class="logoutWrapper">
        <Icon icon="ic:baseline-log-out" class="logout" @click="logoutUser" color="var(--clr-red)" height="25" />
        <!-- <LogoutIcon @click="logoutUser" class="logout"/> -->
    </section>
</template>

<script>
// import LogoutIcon from '../../../node_modules/vue-material-design-icons/Logout.vue';
import { Icon } from '@iconify/vue';

export default {
    components: {
		Icon,
	},
    methods: {
        logoutUser() {
            this.$store.dispatch('logout');
            this.$router.replace("/login");
        }
    }
}
</script>

<style scoped>
.logout {
    display: inline-block;
    color: var(--clr-red);
    transition: 0.2s all;
}

.logout:hover {
    cursor: pointer;
}
</style>
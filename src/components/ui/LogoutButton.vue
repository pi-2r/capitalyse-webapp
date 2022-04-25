<template>
    <section class="logoutWrapper">
        <Icon icon="ic:baseline-log-out" class="logout" @click="logoutUser" color="var(--clr-red)" height="30" />
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

.logoutWrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}

.logout {
    display: inline-block;
    color: var(--clr-red);
    transition: 0.2s all;

}

.logout:hover {
    cursor: pointer;
    transform: scale(1.1);
}
</style>
<template>
    <section class="logoutWrapper">
  
        <LogoutIcon @click="logoutUser" class="logout"/>
    </section>
</template>

<script>
import LogoutIcon from '../../../node_modules/vue-material-design-icons/Logout.vue';

export default {
    components: {
        LogoutIcon,
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
    transform: scale(1.25);
}

.logout:hover {
    cursor: pointer;
  
}
</style>
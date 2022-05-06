<template>
    <button class="logoutWrapper"  @click="logoutUser">
        <Icon icon="ic:baseline-log-out" class="logout" color="var(--clr-red)" height="18" />
        Log out
        <!-- <LogoutIcon @click="logoutUser" class="logout"/> -->
    </button>
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
    width: 9rem;
    justify-content: center;
    gap: 0.5rem;
    align-items: center;
    padding: 0.5rem;
    border-radius: var(--btn-radius);
    transition: 0.2s all;
    background-color: rgba(255, 0, 0, 0.05);
    border: none; 
    color: var(--clr-red);
    font-size: 1.1rem;  
}

.logoutWrapper:hover {
    cursor: pointer;
    background-color: rgba(255, 0, 0, 0.075);
}	

.logout {
    display: inline-block;
    color: var(--clr-red);
    transition: 0.2s all;
}

.logout:hover {
    cursor: pointer;
}
</style>
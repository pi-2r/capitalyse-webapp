<template>
 
    <td>
        {{ portfolio.file[0][0] }}
    </td>
    
    <td>
        {{totalDataPoints}}
    </td>

    <td>
        <router-link to="/dashboard">
            <Icon icon="bi:arrow-right-square-fill" color="var(--clr-blue)" height="30" />
        </router-link>
        <!-- <button @click="openPortfolio(portfolio.id)">Open</button> -->
    </td>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
    components: {
        Icon,
    },
    props: {
        portfolio: {
            type: Object,
            required: true,
        },
    },
    methods: {
        openPortfolio(id) {
            this.$router.push(`/portfolios/${id}`);
        },
    },
    computed: {
        totalDataPoints() {
            return this.portfolio.length;
        },
    }
}
</script>

<style scoped>
td {
    padding: 0.5rem;
}


</style>
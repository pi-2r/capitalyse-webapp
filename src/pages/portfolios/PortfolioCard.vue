<template>
    <td>
        <router-link class="portfolioName" :to="'/dashboard/' + portfolio.id">
            {{ portfolio.portfolioName }}
        </router-link>
    </td>
    <td>
        {{portfolio.addedAt}}
    </td>
    <td class="td__number">
      X Transactions
    </td>
    <td class="td__number">
      X Events
    </td>
    <td class="threeDotsWrapper">
        <router-link to="/portfolios">
            <Icon icon="bi:three-dots-vertical" color="var(--clr-black)" height="16" class="threeDots"/>
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
.portfolioName {
    color: var(--clr-blue);
    font-weight: bold;
    text-decoration: none;
}

.portfolioName:hover {
    cursor: pointer;
    text-decoration: underline;
}

td {
    padding: 1rem 2rem;
    background-color: transparent;
    color: var(--clr-grey);
    font-weight: 400;
}

.td__number {
    text-align: right;
}

.threeDotsWrapper {
    width: 1px;
    padding: 1rem;
}

.threeDots {
    transition: 0.2s all;
}
</style>
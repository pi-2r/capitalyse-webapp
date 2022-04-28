<template >
    
    <td class="portfolioNameTd">
        <router-link class="portfolioName" :to="'/dashboard/' + portfolio.id">
            {{ portfolio.portfolioName }}
        </router-link>
    </td>
    <td>
        {{ portfolio.addedAt }}
    </td>
    <td >
        {{ transactionsFileSize }}
    </td>
    <td >
        {{ accountFileSize }} 
    </td>
    <td class="actionsTd">
        <Icon icon="fluent:new-16-filled" color="var(--clr-blue)" height="22" class="actionBtn"/>
        <Icon icon="ci:edit"  height="22" color="orange" class="actionBtn"/>
        <Icon icon="ant-design:delete-filled" color="var(--clr-red)" height="22" class="actionBtn" @click="$emit('deletePortfolio', portfolio.id)"/>
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
        transactionsFileSize() {
            return this.portfolio.transactionsFileSize ? Math.floor(this.portfolio.transactionsFileSize) + ' KB' : 'No data';
        },
        accountFileSize() {
            return this.portfolio.accountFileSize ? Math.floor(this.portfolio.accountFileSize) + ' KB' : 'No data';
        },
    },
}
</script>

<style scoped>
.actionsTd {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 0;
    padding-left: 0;
    height: 100%;
}

.actionBtn {
    margin-left: 0.5rem;
    transition: 0.2s all;
    border-radius: 1000rem;

}

.actionBtn:hover {
    cursor: pointer;
    background-color: rgb(248, 248, 248);
}

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


.slide-fade-enter-active {
  transition: all 0.15s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.15s ease-in;
}
.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}

</style>
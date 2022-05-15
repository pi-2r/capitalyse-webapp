<template>
    <ResultCard 
        title="Total Deposited" 
        :resultValue="totDeposits" 
        :to="'/dashboard/' + portfolioId + '/deposits'"
        btnText="My Deposits"
        :withBtn="true"
    />
</template>
<script>
import ResultCard from './ResultCard.vue';


import getTotalDepositsMixin from '../../mixins/analytics/getTotalDeposits';

export default {
    mixins: [getTotalDepositsMixin],

    components: {
        ResultCard
    },
    props: {
        withBth: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            totDeposits: 0,
        }
    },
    computed: {
        portfolioId() {
            return this.$route.params.id;
        },
        currentPortfolio() {
            return this.$store.getters['files/getCurrentPortfolio'];
        },
        isThereData() {
            return !!this.currentPortfolio.accountFile;
        }
    },
    watch: {
        isThereData() {
            this.loadData();
        }
    },
    methods: {
        loadData() {
            if(this.isThereData) {
                this.totDeposits = this.getTotalDeposits(this.currentPortfolio.accountFile);
            }
        },
    },
    async created() {
        this.loadData();
    },
}
</script>

<style>


</style>
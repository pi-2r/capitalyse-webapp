<template>
    <ResultCard 
        title="Total Deposits" 
        :resultValue="totDeposits" 
        :to="'/dashboard/' + portfolioId + '/deposits'"
        btnText="My Deposits"
        withBtn
    />
</template>
<script>
import ResultCard from './ResultCard.vue';

import cleanNumberMixin from '../../mixins/cleanNumber';
import includesFromArrayMixin from '../../mixins/includesFromArray';
import getTotalDepositsMixin from '../../mixins/analytics/getTotalDeposits';

export default {
    mixins: [cleanNumberMixin, includesFromArrayMixin, getTotalDepositsMixin],

    components: {
        ResultCard
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
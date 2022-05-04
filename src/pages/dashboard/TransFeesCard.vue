<template>
    <ResultCard 
        title="Total Transaction Fees" 
        :resultValue="totTransFees" 
        :to="'/dashboard/'+ portfolioId + '/fees'" 
        btnText="Fees and Costs"
        withBtn
    />
</template>

<script>
import ResultCard from './ResultCard.vue';

import cleanNumberMixin from '../../mixins/cleanNumber';
import includesFromArrayMixin from '../../mixins/includesFromArray';
import getTotalTransactionsFeesMixin from '../../mixins/analytics/getTotalTransactionsFees';

export default {
    mixins: [cleanNumberMixin, includesFromArrayMixin, getTotalTransactionsFeesMixin],
    components: {
        ResultCard
    },
    data() {
        return {
            totTransFees: 0,
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
            return !!this.currentPortfolio.transactionsFile;
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
                this.totTransFees = this.getTotalTransactionsFees(this.currentPortfolio.transactionsFile);
            }
        },
    },
    created() {
        this.loadData();
    }
}
</script>

<style>
    
</style>
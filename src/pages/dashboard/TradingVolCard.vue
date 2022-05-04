<template>
    <ResultCard 
        title="Total Trading Volume" 
        :resultValue="totTradingVol" 
        :to="'/dashboard/' + portfolioId + '/trading'" 
        btnText="Trading Details"
        withBtn
    />
</template>

<script>
import ResultCard from './ResultCard.vue';

import getTotalTradingVolumeMixin from '../../mixins/analytics/getTotalTradingVolume';

export default {
    mixins: [getTotalTradingVolumeMixin],
    components: {
        ResultCard
    },
    data() {
        return {
            totTradingVol: 0,
        }
    },
    watch: {
        isThereData() {
            this.loadData();
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
    methods: {
        loadData() {
            if(this.isThereData) {
                this.totTradingVol = this.getTotalTradingVolume(this.currentPortfolio.transactionsFile);
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
<template>
    <ResultCard 
        title="Most Times Traded Overall" 
        :resultValue="mostFreqTraded + ' (' + timesTraded + ' time' + ((timesTraded > 1 || timesTraded == 0) ? 's' : '')  + ')'" 
        :withBtn="false"
        :numberResult="false"
    />
</template>

<script>
import ResultCard from '../ResultCard.vue';

import getMostFrequentlyTraded from '../../../mixins/analytics/getMostFrequentlyTraded.js';

export default {
    mixins: [getMostFrequentlyTraded],
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
            mostFreqTradedList: [],
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
        },
        mostFreqTraded() {
            if(this.isThereData) {
                return this.mostFreqTradedList ? this.mostFreqTradedList[0][0] : 'No data';
            }
            return 'No data';
        },
        timesTraded() {
            if(this.isThereData) {
                return this.mostFreqTradedList ? this.mostFreqTradedList[0][1] : 0;
            }
            return 0;
        }
    },
    methods: {
        loadData() {
            if(this.isThereData) {
                this.mostFreqTradedList = this.getMostFrequentlyTraded(this.currentPortfolio.transactionsFile);
            }
        },
    },
    created() {
        this.loadData();
    }
}
</script>

<style scoped>

</style>
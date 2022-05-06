<template>
    <ResultCard 
        title="Most Traded Product Overall" 
        :resultValue="mostFreqTraded + ' (' + timesTraded + ' times)'" 
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
                return this.mostFreqTradedList ? this.mostFreqTradedList[0][1] : 'No data';
            }
            return 'No data';
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
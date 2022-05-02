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

export default {
    mixins: [cleanNumberMixin, includesFromArrayMixin],

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
        depositIndexes() {
            return this.$store.getters['indexes/deposits'];
        },
        currentPortfolio() {
            return this.$store.getters['files/getCurrentPortfolio'];
        },
        depositNames() {
            return this.$store.getters['dictionary/deposit'];
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
                this.totDeposits = this.getTotalDeposits();
            }
        },
        getTotalDeposits() {
            let data = this.currentPortfolio.accountFile;
            const names = this.depositNames;
            const searchIndex = this.depositIndexes.searchIndex;
            const depositIndex = this.depositIndexes.depositIndex;
            let tot = 0;

            for(let i = 0; i < data.length; i++) {
                if(data[i][searchIndex]) {                
                    if(this.includesFromArray(names, data[i][searchIndex])) {
                        let nr = this.cleanNumber(data[i][depositIndex]);
                        if(nr > 0) {
                            tot += nr;
                        }
                    }
                }
            }
            tot = tot.toLocaleString('en-US');
            return tot;
        },
    },
    async created() {
        this.loadData();
    },
}
</script>

<style>


</style>
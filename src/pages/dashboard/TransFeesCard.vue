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

export default {
    mixins: [cleanNumberMixin, includesFromArrayMixin],
    props: {
        portfolioId: {
            type: String,
            required: true,
        }
    },
    components: {
        ResultCard
    },
    data() {
        return {
            totTransFees: 0,
        }
    },
    computed: {
        transactionsIndexes() {
            return this.$store.getters['indexes/transactions'];
        },
        transactionsFile() {
            return this.$store.getters['files/transactionsFile'];
        },
        isThereData() {
            return !!this.transactionsFile;
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
                this.totTransFees = this.getTotalTransactionsFees();
            }
        },
        getTotalTransactionsFees() {
            const data = this.transactionsFile;
            const searchIndex = this.transactionsIndexes.searchIndex;
            let tot = 0;

            for(let i = 0; i < data.length -1; i++) {
                if(data[i][searchIndex] && data[i][searchIndex] !== "" &&
                data[i][searchIndex]) {
                    let nr = parseFloat(data[i][searchIndex]);
                    tot += nr;
                }
            }
            tot = parseFloat(tot).toLocaleString('en-US');
            return tot;
        },
    },
    created() {
        this.loadData();
    }
}
</script>

<style>
    
</style>
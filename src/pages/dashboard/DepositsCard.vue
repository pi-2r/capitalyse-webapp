<template>
    <ResultCard 
        title="Total Deposits" 
        :resultValue="totDeposits" 
        to="/dashboard/deposits" 
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
        depositIndexes() {
            return this.$store.getters['indexes/deposits'];
        },
        accountFile() {
            return this.$store.getters['files/accountFile'];
        },
        depositNames() {
            return this.$store.getters['dictionary/deposit'];
        },
        isThereData() {
            return !!this.accountFile;
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
            let data = this.accountFile;
            const names = this.depositNames;
            const searchIndex = this.depositIndexes.searchIndex;
            const depositIndex = this.depositIndexes.depositIndex;
            let tot = 0;

            for(let i = 0; i < data.length; i++) {
                if(data[i][searchIndex]) {                
                    if(this.includesFromArray(names, data[i][searchIndex])) {
                        let nr = this.cleanNumber(data[i][depositIndex]);
                        nr < 0 ? (nr = nr * -1) : nr;
                        tot += nr;
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
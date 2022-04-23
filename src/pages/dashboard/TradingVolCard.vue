<template>
    <ResultCard 
        title="Total Trading Volume" 
        :resultValue="totTradingVol" 
        to="/dashboard/trading" 
        btnText="Trading Details"
        withBtn
    />
</template>

<script>
import ResultCard from './ResultCard.vue';

export default {
    components: {
        ResultCard
    },
    data() {
        return {
            totTradingVol: 0,
        }
    },
    computed: {
        tradingVolumeIndexes() {
            return this.$store.getters['indexes/tradingVolume'];
        },
        transactionsFile() {
            return this.$store.getters['files/transactionsFile'];
        },
        isThereData() {
            return this.transactionsFile;
        }
    },
    methods: {
        loadData() {
            if(this.isThereData) {
                this.totTradingVol = this.getTotalTradingVolume();
            }
        },
        getTotalTradingVolume() {
            const data = this.transactionsFile;
            const searchIndex = this.tradingVolumeIndexes.searchIndex;
            let vol = 0;
            let tot = 0;
            
            for(let i = 0; i < data.length -1; i++) {
                if(data[i][searchIndex] !== "") {
                    vol = parseFloat(data[i][searchIndex]);
                    vol < 0 ? vol = vol * -1 : vol;
                    tot += vol;
                }
            }
            tot = parseFloat(tot).toLocaleString('en-US');
            return tot;
        },
    },
    mounted() {
        this.loadData();
    }
}
</script>

<style>
    
</style>
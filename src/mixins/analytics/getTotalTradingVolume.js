export default {
    data() {
        return {
            names: {
                eur: 'EUR',
            },
        }
    },
    computed: {
        searchIndex() {
            return this.$store.getters['indexes/tradingVolume'].searchIndex
        },
        currencyIndex() {
            return this.$store.getters['indexes/tradingVolume'].currencyIndex
        },
    },
    methods: {
        getTotalTradingVolume(data) {
            const searchIndex = this.searchIndex;
            const currencyIndex = this.currencyIndex;

            let vol = 0;
            let tot = 0;
            
            for (let i = 0; i < data.length; i++) {
                
                if (data[i][searchIndex] !== "" && data[i][currencyIndex] === this.names.eur) {

                    vol = parseFloat(data[i][searchIndex]);
                    
                    vol < 0 ? vol = vol * -1 : vol;
                    tot += vol;
                }
            }

            tot = tot.toFixed(2);
            tot = parseFloat(tot).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})

            return tot;
        },
    }
}
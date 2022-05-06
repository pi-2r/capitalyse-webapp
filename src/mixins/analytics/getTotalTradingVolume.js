

export default {
    methods: {
        getTotalTradingVolume(data) {
            const searchIndex = this.$store.getters['indexes/tradingVolume'].searchIndex;

            let vol = 0;
            let tot = 0;
            
            for (let i = 0; i < data.length - 1; i++) {

                if (data[i][searchIndex] !== "") {

                    vol = parseFloat(data[i][searchIndex]);
                    
                    vol < 0 ? vol = vol * -1 : vol;
                    tot += vol;
                }
            }

            tot = tot.toFixed(2)
            tot = parseFloat(tot).toLocaleString('en-US');

            return tot;
        },
    }
}
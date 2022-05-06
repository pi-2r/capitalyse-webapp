export default {
    methods: {
        getTotalTransactionsFees(data) {
            const searchIndex = this.$store.getters['indexes/transactions'].searchIndex;
            
            let tot = 0;

            for (let i = 0; i < data.length - 1; i++) {
                
                if (data[i][searchIndex] && data[i][searchIndex] !== "" &&
                    data[i][searchIndex]) {
                    
                    let nr = parseFloat(data[i][searchIndex]);
                    
                    tot += nr;
                }
            }

            tot = tot.toFixed(2);
            tot = parseFloat(tot).toLocaleString('en-US');

            return tot;
        },
    }
}
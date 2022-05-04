export default {
    methods: {
        getTotalDeposits(data) {
            const names = this.$store.getters['dictionary/deposit'];

            const indexes = this.$store.getters['indexes/deposits'];
            const searchIndex = indexes.searchIndex;
            const depositIndex = indexes.depositIndex;

            let tot = 0;

            for (let i = 0; i < data.length; i++) {
                
                if (data[i][searchIndex]) {         
                    
                    if (this.includesFromArray(names, data[i][searchIndex])) {
                        
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
    }
}
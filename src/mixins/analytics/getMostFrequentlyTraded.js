export default {
    computed: {
        indexes() {
            return this.$store.getters['indexes/tradingFrequency'];
        }
    },
    methods: {
        getMostFrequentlyTraded(data) {
            const searchIndex = this.indexes.searchIndex;
            let products = [];
            let scoreboard = [];

            for (let i = 0; i < data.length - 1; i++) {
                products.push(data[i][searchIndex]);
            }
            // add to scoreboard if not exists, and count number of times it occurs
            for (let i = 0; i < products.length; i++) {
                let alreadyExists = false;
                // if product is not yet in scoreboard, add it to scoreboard and set count to + 1
                for (let j = 0; j < scoreboard.length; j++) {
                    if (scoreboard[j][0] === products[i]) {
                        alreadyExists = true;       
                    }
                }
                if (!alreadyExists) {
                    scoreboard.push([products[i], products.filter((v) => v === products[i]).length]);
                }            
            }
            scoreboard.sort((a, b) => {
                return b[1] - a[1];
            });

            return scoreboard;
        }
    }
}
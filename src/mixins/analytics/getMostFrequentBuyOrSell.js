export default {
    data() {
        return {
            names: {
                buy: 'buy',
                sell: 'sell',
            }
        }
    },
    computed: {
        indexes() {
            return this.$store.getters['indexes/tradingFrequency'];
        }
    },
    methods: {
        getMostFrequentBuyOrSell(data, buyOrSell) {
            const searchIndex = this.indexes.searchIndex;
            const buyOrSellIndex = this.indexes.buyOrSellIndex;
            let products = [];
            let scoreboard = [];

            // filter data to only include buys or sells
            for (let i = 0; i < data.length - 1; i++) {
                if (data[i][buyOrSellIndex] !== "Aantal") {
                    if (buyOrSell === this.names.buy && parseFloat(data[i][buyOrSellIndex]).toFixed(2) > 0) {
                        products.push(data[i][searchIndex]);
                    } else if (buyOrSell === this.names.sell && parseFloat(data[i][buyOrSellIndex]).toFixed(2) < 0) {
                        products.push(data[i][searchIndex]);
                    }
                }
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
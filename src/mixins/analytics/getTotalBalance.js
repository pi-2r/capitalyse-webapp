import cleanNumber from "../cleanNumber";

export default {
    mixins: [cleanNumber],
    computed: {
        indexes() {
            return this.$store.getters['indexes/portfolio'];
        },
    },
    methods: {
        getTotalBalance(data) {
            const eurTotalIndex = this.indexes.eurTotalIndex;
            let total = 0;

            for (let i = 0; i < data.length; i++) {
                if (data[i][0] !== '') {

                    let amount = this.cleanNumber(data[i][eurTotalIndex]);

                    total += amount;
                }
            }


            return total;
        }
    }
}
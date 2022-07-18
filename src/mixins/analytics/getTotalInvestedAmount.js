import cleanNumber from "../helpers/cleanNumber";

export default {
    mixins: [cleanNumber],
    computed: {
        indexes() {
            return this.$store.getters['indexes/portfolio'];
        },
    },
    methods: {
        getTotalInvestedAmount(data) {
            const eurTotalIndex = this.indexes.eurTotalIndex;
            let total = 0;

            // loop door data heen
            // als er data is op de eerste en tweede kolom
            // voeg deze toe aan de total
            // deze check is nodig omdat de eerste kolom checkt of
            // deze data niet leeg is en de tweede kolom checkt of deze
            // data wel echt een ISIN nummer heeft, hier wordt cash dus niet meegeteld
            for (let i = 0; i < data.length; i++) {
                if (data[i][1] !== '' && data[i][0] !== '') {
                    console.log(data[i]);
                    let amount = this.cleanNumber(data[i][eurTotalIndex]);
                    total += amount;
                }
            }

            return total;
        }
    }
}
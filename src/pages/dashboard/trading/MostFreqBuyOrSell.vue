<template>
    <section class="cardWrapper">
        <Button class="secondary toggleBuySellBtn" @click="toggleBuySell">
            <Icon icon="heroicons-outline:switch-horizontal" color="var(--clr-blue)" height="25" />        
        </Button>
        <section>
            <ResultCard class="card"
                :title="title"
                :resultValue="mostFreqTraded + ' (' + timesTraded + ' time' + (timesTraded > 1 ? 's' : '') + ')'" 
                :withBtn="false"
                :numberResult="false"
            />
        </section>
    </section>
</template>

<script>
import ResultCard from '../ResultCard.vue';
import getMostFrequentBuyOrSell from '../../../mixins/analytics/getMostFrequentBuyOrSell.js';

import { Icon } from '@iconify/vue';

export default {
    mixins: [getMostFrequentBuyOrSell],
    components: {
        ResultCard,
        Icon
    },
    props: {
        withBth: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            mostFreqBuyOrSellList: [],
            buyOrSell: 'buy',
        }
    },
    watch: {
        isThereData() {
            this.loadData();
        },
        buyOrSell() {
            this.loadData();
        }
    },
    computed: {
        portfolioId() {
            return this.$route.params.id;
        },
        currentPortfolio() {
            return this.$store.getters['files/getCurrentPortfolio'];
        },
        isThereData() {
            return !!this.currentPortfolio.transactionsFile;
        },
        mostFreqTraded() {
            if(this.isThereData) {
                return this.mostFreqBuyOrSellList ? this.mostFreqBuyOrSellList[0][0] : 'No data';
            }
            return 'No data';
        },
        timesTraded() {
            if(this.isThereData) {
                return this.mostFreqBuyOrSellList ? this.mostFreqBuyOrSellList[0][1] : '0';
            }
            return '0';
        },
        title() {
            if(this.isThereData) {
                return this.buyOrSell === 'buy' ? 'Most Times Bought' : 'Most Times Sold';
            }
            return 'No data';
        }
    },
    methods: {
        toggleBuySell() {
            this.buyOrSell = this.buyOrSell === 'buy' ? 'sell' : 'buy';
        },
        loadData() {
            if(this.isThereData) {
                if(this.buyOrSell === "buy") {
                    this.mostFreqBuyOrSellList = this.getMostFrequentBuyOrSell(this.currentPortfolio.transactionsFile, 'buy');
                } else if (this.buyOrSell === "sell") {
                    this.mostFreqBuyOrSellList = this.getMostFrequentBuyOrSell(this.currentPortfolio.transactionsFile, 'sell');
                }
            }
        },
    },
    created() {
        this.loadData();
    }
}
</script>

<style scoped>
.toggleBuySellBtn {
    position: absolute;
    padding: 0.4rem 0.5rem; 
    right: 0.5rem;
    top: 0.5rem;
    font-size: 0.8rem;
    font-weight: 600;    
    text-transform: uppercase;
    border: none;
    box-shadow: none;
    background-color: transparent;  
}

.toggleBuySellBtn:hover {
    cursor: pointer;
    box-shadow: none;
    background-color: rgba(218, 237, 255, 0.333);
}

.card {
    box-shadow: none;
    padding: 0;
    height: 100%;	
    grid-gap: 0;
}


.cardWrapper {
    position: relative;
    width: 100%;
    background-color: var(--clr-very-light-blue);
    display: flex;
    justify-content: center;
    border-radius: var(--card-border-radius);
    box-shadow: var(--box-shadow-big);

}





</style>
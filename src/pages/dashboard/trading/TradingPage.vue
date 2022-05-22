<template>
    <Header/>
    <section class="container">
        <Breadcrumbs 
            baseLink="/portfolios"
            baseLinkName="My Portfolios"
            :secondLink="'/dashboard/' + this.$route.params.id"
            :secondLinkName="'Dashboard ' + (portfolioName ? portfolioName : '')"
            thirdLink="#"
            thirdLinkName="Trading"
        />

        <section class="titleAndBackButtonContainer">
            <BackButton/>
            <h1>Trading</h1>
        </section>
        
        <section class="cardsContainer">
            <MostFreqBuyOrSell/>
            <MostFreqTradedCard/>
        </section>
    </section>
</template>

<script>
import Breadcrumbs from '../../../components/ui/Breadcrumbs.vue';
import Header from '../../../components/layout/Header.vue';

import BackButton from '../../../components/ui/BackButton.vue';
import MostFreqTradedCard from './MostFreqTradedCard.vue';
import MostFreqBuyOrSell from './MostFreqBuyOrSell.vue';

export default {
    components: {
        Breadcrumbs,
        Header,
        MostFreqTradedCard,
        MostFreqBuyOrSell,
        BackButton
    },
    computed: {
        portfolioName() {
            return this.$store.getters['files/getCurrentPortfolioName'];
        },
        hasCurrentPortfolio() {
            const portfolios = this.$store.getters['files/getPortfolios'];
            for(let i = 0; i < portfolios.length; i++) {
                if(portfolios[i].id === this.$route.params.id) {
                    return true;
                }
            }
            return false;
        },
        hasCurrentFiles() {
            const portfolios = this.$store.getters['files/getPortfolios'];
            let hasFiles = false;
            portfolios.forEach(portfolio => {
                if(portfolio.id === this.$route.params.id) {
                    if(portfolio.accountFile && portfolio.transactionsFile) {
                        hasFiles = true;
                    }
                }
            });
            return hasFiles;
        },
        hasPortfolios() {
            return this.$store.getters['files/hasPortfolios'];
        }
    },
    watch: {
        hasPortfolios() {
            this.loadData();
        }
    },
    methods: {
        loadData() {
            if(!this.hasCurrentFiles && this.hasCurrentPortfolio) {
                this.$store.dispatch('files/fetchOnePortfolio', this.$route.params.id);
            } else if (!this.hasCurrentPortfolio) {
                this.$store.dispatch('files/fetchAllPortfolios');
            }

            if(this.hasCurrentPortfolio) {
                this.setCurrentPortfolio(this.$route.params.id);
            }
        },
        setCurrentPortfolio(id) {
            this.$store.dispatch('files/setCurrentPortfolio', id);
        },
        resetCurrentPortfolio() {
            this.$store.dispatch('files/resetCurrentPortfolio');
        }
    },
    created() {
        this.loadData();
    } 
}
</script>

<style scoped>
.container {
    margin: 0 auto;
    margin-bottom: 4rem;
    margin-top: 3rem;
}

.cardsContainer {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
}

@media screen and (min-width: 400px) {
    .container {
        max-width: 92%;
    }
    
}

@media screen and (min-width: 650px) {
    .cardsContainer {
        grid-template-columns: 1fr 1fr;
    }

    .container {
        max-width: 90%;
    }
}

@media screen and (min-width: 1050px) {
   

    .container {
        max-width: 1000px;
    }
}
</style>
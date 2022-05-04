<template>
  <Header></Header>
    <section class="container" >
        <Breadcrumbs 
            baseLink="/portfolios"
            baseLinkName="My Portfolios" 
            secondLink="#"
            :secondLinkName="'Dashboard ' + portfolioName"
        />
        <section class="head">
            <h1>Dashboard {{ portfolioName }}</h1>
        </section>

        <DividendChart/>

        <section class="cardsContainer">
            <DepositsCard />
            <TradingVolCard />
            <TransFeesCard />
        </section>
        
    </section>
</template>

<script>
import Header from '../../components/layout/Header.vue';
import DividendChart from './DividendChart.vue';
import Breadcrumbs from '../../components/ui/Breadcrumbs.vue';
import DepositsCard from './DepositsCard.vue';
import TradingVolCard from './TradingVolCard.vue';
import TransFeesCard from './TransFeesCard.vue';

export default {
    name: 'Dashboard',
    components: {
        DividendChart,
        DepositsCard,
        TradingVolCard,
        TransFeesCard,
        Header,
        Breadcrumbs
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
            let hasFiles = false
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
                console.log('no portfolio');
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
.upload {
 margin-bottom: 2.5rem;
}

h1 {
    margin-bottom: 1rem;
}

.head {
    display: flex;
    justify-content: space-between;
    align-items: center; 
    margin-bottom: 2rem;
}

.cardsContainer {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 2rem;
}

.container {
     margin: 0 auto;
     margin-bottom: 4rem;
     margin-top: 3rem;
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
    .cardsContainer {
        grid-template-columns: 1fr 1fr 1fr;
    }

    .container {
        max-width: 1000px;
    }

}

</style>
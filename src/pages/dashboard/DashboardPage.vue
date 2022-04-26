<template>
  <Header></Header>
    <section class="container" >
        <Breadcrumbs 
            baseLink="/portfolios"
            baseLinkName="My Portfolios" 
            secondLink="/dashboard"
            secondLinkName="Dashboard"
        />
        <section class="head">
            <h1>Dashboard</h1>
            <LogoutButton/>
        </section>


        <DividendChart/>

        <section class="cardsContainer">
            <DepositsCard/>
            <TradingVolCard />
            <TransFeesCard />
        </section>
        
    </section>
</template>

<script>
import Header from '../../components/layout/Header.vue';
import DividendChart from '../../components/dashboard/DividendChart.vue';
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
        isThereData() {
            return this.$store.getters['files/hasDashboardPortfolio'];
        },
    },
    watch: {
        isThereData() {
            this.loadData();
        }
    },
    methods: {
   
    },
    created() {
        console.log(this.$route.params.id);
        if(!this.isThereData) {         
            this.$store.dispatch('files/fetchOnePortfolio', {
                id: this.$route.params.id
            });
        } else if(this.isThereData) {
            // if route id is different from store id, fetch new data
            if(this.$route.params.id !== this.$store.getters['files/getDashboardPortfolio'].id) {
                this.$store.dispatch('files/fetchOnePortfolio', {
                    id: this.$route.params.id
                });
            }
        }
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
        max-width: 95%;
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
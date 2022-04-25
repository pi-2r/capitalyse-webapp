<template>
    <section class="container">
        <section class="head">
            <h1>Dashboard</h1>
            <LogoutButton/>
        </section>

        <section class="upload">
            <Button link to="/upload">Upload Files</Button>
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

import DividendChart from '../../components/dashboard/DividendChart.vue';

import DepositsCard from './DepositsCard.vue';
import TradingVolCard from './TradingVolCard.vue';
import TransFeesCard from './TransFeesCard.vue';

import LogoutButton from '../../components/ui/LogoutButton.vue';

export default {
    name: 'Dashboard',
    components: {
        DividendChart,
        DepositsCard,
        TradingVolCard,
        TransFeesCard,
        LogoutButton,
    },
    computed: {
        isThereData() {
            return this.$store.getters['files/hasFiles'];
        },
 
    },
    created() {
        if(!this.isThereData) {
            console.log('No data in store');
         
            this.$store.dispatch('files/fetchCSVData')
        }
    }
}
</script>

<style scoped>
.upload {
 margin-bottom: 2.5rem;
}

h1 {
    margin-bottom: 2rem;
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
     margin-top: 2rem;
     margin-bottom: 2rem;
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
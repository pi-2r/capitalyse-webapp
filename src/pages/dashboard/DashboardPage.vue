<template>
    <section class="container">
        <h1>Dashboard</h1>

        <DividendChart/>

        <section class="cardsContainer">
            <ResultCard title="Total Deposits" :resultValue="0" to="/dashboard/deposits" btnText="My Deposits"/>
            <ResultCard title="Total Transaction Fees" :resultValue="0" to="/dashboard/deposits" btnText="Fees and Costs"/>
            <ResultCard title="Total Trading Volume" :resultValue="0" to="/dashboard/deposits" btnText="Trading Details"/>
        </section>
        
    </section>
</template>

<script>
import DividendChart from '../../components/dashboard/DividendChart.vue';
import ResultCard from './ResultCard.vue';

export default {
    name: 'Dashboard',
    components: {
        DividendChart,
        ResultCard
    }
}
</script>

<style scoped>
h1 {
    margin-bottom: 2rem;
}



.cardsContainer {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 2rem;
}



@media screen and (min-width: 650px) {
    .cardsContainer {
        grid-template-columns: 1fr 1fr;
    }
}

@media screen and (min-width: 1050px) {
    .cardsContainer {
        grid-template-columns: 1fr 1fr 1fr;
    }
}
    
    

</style>
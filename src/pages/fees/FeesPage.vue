<template>
    <Header/>
    <section class="container">
        <Breadcrumbs 
            baseLink="/portfolios"
            baseLinkName="My Portfolios" 
            :secondLink="'/dashboard/' + this.$route.params.id"
            secondLinkName="Dashboard"    
            thirdLink="#"
            thirdLinkName="Fees and Costs"
        />

        <h1>Fees and Costs</h1>
        
        <section class="cardsContainer">
            
        </section>
    </section>
</template>

<script>
import Breadcrumbs from '../../components/ui/Breadcrumbs.vue';
import Header from '../../components/layout/Header.vue';

export default {
   components: {
        Breadcrumbs,
        Header
   }
}
</script>

<style scoped>
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
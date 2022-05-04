<template>
    <Header/>
    <section class="container">
        <Breadcrumbs 
            baseLink="/portfolios"
            baseLinkName="My Portfolios"
            :secondLink="'/dashboard/' + this.$route.params.id"
            :secondLinkName="'Dashboard ' + portfolioName"
            thirdLink="#"
            thirdLinkName="Trading"
        />

        <h1>Trading</h1>
        
        <section class="cardsContainer">
            <TransFeesCard/>
        </section>
    </section>
</template>

<script>
import Breadcrumbs from '../../../components/ui/Breadcrumbs.vue';
import Header from '../../../components/layout/Header.vue';

import TransFeesCard from '../TransFeesCard.vue';

export default {
    components: {
        Breadcrumbs,
        Header,
        TransFeesCard
    },
    computed: {
        portfolioName() {
              return this.$store.getters['files/getCurrentPortfolioName'];
        },
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
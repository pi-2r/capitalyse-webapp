<template>
    <section class="container">
        <Breadcrumbs />

        <h1>Fees and Costs</h1>
        
        <section class="cardsContainer">
            
        </section>
    </section>
</template>

<script>
import Breadcrumbs from '../../components/ui/Breadcrumbs.vue';

export default {
   components: {
       Breadcrumbs
   }
}
</script>

<style scoped>
.container {
     margin: 0 auto;
    margin-top: 6rem;
    margin-bottom: 4rem;
    
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
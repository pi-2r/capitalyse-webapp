<template>
    <Header/>
    <article class="container">
        <h1>Settings</h1>
    </article>
</template>

<script>
import Header from '../../components/layout/Header.vue';

export default {
   components: {
   
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
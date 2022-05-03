<template>
    <Header/>
    <article class="container">
        <h1>Settings</h1>
        <section class="settingsCard__container">
            <section class="settingsCard">
               <LogoutButton />
            </section>
        </section>

    </article>
</template>

<script>
import Header from '../../components/layout/Header.vue';
import LogoutButton from '../../components/ui/LogoutButton.vue';


export default {
    components: {
        Header,
        LogoutButton,
    }
}
</script>

<style scoped>
.container {
    margin: 0 auto;
    margin-bottom: 4rem;
    margin-top: 3rem;
    width: 28rem;
}


h1 {
    margin-bottom: 1rem;
    margin-top: 0.25rem;
}

.settingsCard__container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.settingsCard {
    width: 30rem;
    padding: 1.25rem;
    background-color: var(--clr-very-light-blue);
    box-shadow: var(--box-shadow-big);
    border-radius: var(--card-border-radius);
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
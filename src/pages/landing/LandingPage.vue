<template>
    <article>
        <section class="hero">
            <LandingPageNav />
            <section class="heroContentWrapper">
                <section class="heroContent">
                    <h1>Make data-driven decisions on your investment journey</h1>
                    <p>Getting a deep understanding of your Degiro costs, returns 
                        and trading habits is extremely important to be able to survive 
                        in the long run, and Capitalyse is here to help.</p>
                    <button>Get started for free</button>
                </section>
            </section>
            
        </section>
        <section class="contentContainer">
            <section class="content">
                <h2>Giving you the analytics DEGIRO won't</h2>
                <section class="sideBySide">
                    <section class="sideBySideFirst">
                        <section class="sideBySide__text">
                            <h3>Great insights into fees & costs</h3>
                            <p>Great insights into costs and fees Great insights into costs and feesGreat insights into costs and fees</p>
                        </section>
                        <section class="sideBySide__image">
                            <img src="https://via.placeholder.com/300x200" alt="">
                        </section>
                    </section>
                    <section class="sideBySideSecond">
                        <section class="sideBySide__text">
                            <h3>Great insights into fees & costs</h3>
                            <p>Text</p>
                        </section>
                        <section class="sideBySide__image">
                            <img src="https://via.placeholder.com/300x200" alt="">
                        </section>
                    </section>
                    <section class="sideBySideThird">
                        <section class="sideBySide__text">
                            <h3>Great insights into fees & costs</h3>
                            <p>Text</p>
                        </section>
                        <section class="sideBySide__image">
                            <img src="https://via.placeholder.com/300x200" alt="">
                        </section>
                    </section>
                </section>
                <section class="gridOfBenefits">
                    <h2>Just import your logs and we'll do the rest</h2>
                    <section class="gridOfBenefits__items">
                        <section class="gridOfBenefits__item">
                            <img src="https://via.placeholder.com/300x200" alt="">
                            <h3>Saving money shouldn't cost a lot</h3>
                            <p>Text</p>
                        </section>
                        <section class="gridOfBenefits__item">
                            <img src="https://via.placeholder.com/300x200" alt="">
                            <h3>Saving money shouldn't cost a lot</h3>
                            <p>Text</p>
                        </section>
                        <section class="gridOfBenefits__item">
                            <img src="https://via.placeholder.com/300x200" alt="">
                            <h3>Saving money shouldn't cost a lot</h3>
                            <p>Text</p>
                        </section>
                        <section class="gridOfBenefits__item">
                            <img src="https://via.placeholder.com/300x200" alt="">
                            <h3>Saving money shouldn't cost a lot</h3>
                            <p>Text</p>
                        </section>
                    </section>
                </section>
                <section class="areYouReady">
                    <section class="areYouReady__card">
                        <h2>Ready to get started?</h2>
                        <p>Text</p>
                        <button>Get insights</button>
                        <button>See plans</button>
                    </section>
                </section>
            </section>
        </section>
    </article>
</template>
<script>
import LandingPageNav from './LandingPageNav.vue';

export default {
    components: {
        LandingPageNav
    },
}
</script>
<style scoped>
/* * {
    border: 1px solid red;
} */

h1,h2,h3,p,button {
    font-family: 'Poppins', sans-serif;
}

.hero {
    background-image: linear-gradient(45deg, 
        var(--clr-blue) 10%,
        var(--clr-blue) 15%, 
        #011f39 15%, 
        #011f39 85%, 
        var(--clr-blue) 0%); 
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 75vh;
} 


.heroContent {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    max-width: 50rem;
    margin-top: 10%;
}

.heroContent h1 {
    color: var(--clr-very-light-blue);
    font-family: 'Poppins', sans-serif;
    text-align: center;
    font-weight: 600;
    font-size: 3rem;
}
.heroContent p {
    color: var(--clr-light-grey);
    font-weight: 300;
    text-align: center;
}
.heroContent button {
    background-color: var(--clr-white);
    color: var(--clr-blue);
    border: none;
    padding: var(--btn-small-padding);
    border-radius: var(--btn-radius);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 2rem;
}

.contentContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 6rem;
}

.content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 80%;
}

.sideBySide {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.sideBySide > section {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 4rem;
}

h2 {
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 2rem;
}

h3 {
    font-size: 1.5rem;
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
    .container {
        max-width: 90%;
    }
}

@media screen and (min-width: 1050px) {
    .container {
        max-width: 1000px;
    }
}

/* max width */
@media screen and (max-width: 950px) {
    .heroContent h1 {
        font-size: 2rem;
    }
}
</style>
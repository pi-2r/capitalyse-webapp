<template>
    <div class="cardContainer">
        <section class="cardContent">
                <h2>{{ title }}</h2>
                <p class="cardText">
                    <span class="resultValue">
                        €{{ resultValue }}
                    </span>
                </p>

        </section>
        <section class="cardBtnSection">
            <Button class="card link" link :to="to">{{ btnText }}</Button>
        </section>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: 'Title',
        },
        resultValue:
        {
            type: Number,
            default: 0,
        },
        to: {
            type: String,
            default: '/',
        },  
        btnText: {
            type: String,
            default: 'View Details',
        },
    },


}
</script>

<style scoped>
.cardContainer {
    width: 100%;
    background-color: var(--clr-very-light-blue);
    display: flex;
    justify-content: center;
    border-radius: var(--card-border-radius);
    flex-direction: column;
    box-shadow: var(--box-shadow-big);
}

.cardContent {
    padding: 2rem;
    padding-bottom: 0rem;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.cardText {
    margin-bottom: 0.5rem;
}

.cardBtnSection {
    padding: 1rem;
    padding-top: 0;
}

</style>
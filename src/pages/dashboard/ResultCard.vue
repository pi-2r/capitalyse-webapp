<template>
    <div class="cardContainer">
        <section :class="[{cardContentNoBtn : !withBtn},{cardContent : withBtn}]">
                <h2>{{ title }}</h2>
                <p class="cardText">
                    <span class="resultValue" :class="[{redNumber : isNegative}]">
                        €{{ resultValue }}
                    </span>
                </p>
        </section>
        <section class="cardBtnSection" v-if="withBtn">
            <Button class="card link" link :to="to">{{ btnText }}</Button>
        </section>
    </div>
</template>

<script>
export default {
    props: {
        withBtn: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: 'Title',
        },
        resultValue:
        {
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
    computed: {
        isNegative() {
            return this.resultValue < 0;
        }
    }

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

.cardContentNoBtn {
    padding: 1rem;
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

.redNumber {
    color: var(--clr-red);
}


</style>
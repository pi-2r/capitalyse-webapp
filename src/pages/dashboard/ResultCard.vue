<template>
    <div class="cardContainer">
        <section :class="[{cardContentNoBtn : !withBtn},{cardContent : withBtn}]">
                <h2>{{ title }}</h2>
                <transition name="slide-fade" mode="out-in">
                    <p class="cardText" :key="resultValue">
                        <span class="resultValue" :class="[{redNumber : isNegative}]">
                            €{{ resultValue }}
                        </span>
                    </p>
                </transition>
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
    padding: 2rem;
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


  
.slide-fade-enter-active {
  transition: all 0.15s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.15s ease-in;
}
.slide-fade-enter-from {
  transform: translateY(-15px);
  opacity: 0;
}

.slide-fade-leave-to {
    transform: translateY(15px);
    opacity: 0;
}



</style>
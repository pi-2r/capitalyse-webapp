<template>
    <section class="logoContainer">
        <Icon icon="bxs:doughnut-chart" :color="color" height="20" />
        <h2 :style="{'color': color}">Capitalyse</h2>
    </section>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
    components: {
        Icon
    },
    props: {
        color: {
            type: String,
            default: 'var(--clr-dark-grey)'
        },
    }
}
</script>

<style scoped>
.logoContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
}

h2 {
    font-size: 1rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;
    letter-spacing: 0.2em;
    user-select: none;
}
</style>
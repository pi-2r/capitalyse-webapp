<template>
    <section class="logoContainer">
        <Icon v-if="!ignoreTheme" icon="bxs:doughnut-chart" :color="color" height="20" />
        <Icon v-else icon="bxs:doughnut-chart" color="white" height="20" />

        <h2 v-if="!ignoreTheme" :style="{'color': color}">Capitalyse</h2>
        <h2 v-else style="color: white;">Capitalyse</h2>
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
        ignoreTheme: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped>
.logoContainer {
    display: flex;
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
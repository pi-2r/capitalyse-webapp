<template>
    <section class="card">
        <slot></slot>
    </section>
</template>

<script>
export default {
    name: 'Card',
    props: {
        chart: {
            type: Boolean,
            default: false,
        },
    },
}
</script>

<style scoped>
.card {
    width: 100%;
    background-color: var(--clr-very-light-blue);
    display: flex;
    justify-content: center;
    border-radius: var(--card-border-radius);
    flex-direction: column;
    box-shadow: var(--box-shadow-big);
}
</style>
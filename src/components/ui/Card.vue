<template>
    <section class="defaultCard">
        <slot></slot>
    </section>
</template>

<script>
export default {
}
</script>
<style scoped>
.defaultCard {
    width: 100%;
    background-color: var(--clr-very-light-blue);
    border-radius: var(--card-border-radius);
    box-shadow: var(--box-shadow-big);
    border: 1px solid var(--clr-very-light-grey);
}
</style>
<template>
    <button v-if="!link" :class="mode">
        <slot></slot>
    </button>
    <router-link v-else :to="to" class="link" :class="mode">
        <slot></slot>
    </router-link>
</template>

<script>
export default {
    props: {
        mode: {
            type: String,
            default: null,
        },
        link: {
            type: Boolean,
            default: false,
        },
        to: {
            type: String,
            default: "/",
        }
    },
}
</script>

<style scoped>

button,a{
    padding: var(--btn-padding);
    font-size: var(--btn-font-size);
    font-weight: var(--btn-font-weight);
    font-family: var(--fnt-main);
    background-color: var(--clr-blue);
    color: var(--clr-white);
    cursor: pointer;
    transition: 0.15s all;
    border: none;
    border-radius: var(--btn-radius);
    user-select: none;
    box-shadow: var(--btn-shadow);
} 

/* button:hover, a:hover {
    background-color: rgb(6, 41, 74);  
} */

a {
    user-select: none;
}

button:hover {
    box-shadow: 0px 0px 10px 0px rgba(0, 89, 255, 0.2);
}

.card {
    text-decoration: none;
    margin-top: 1rem;
    border-width: 1px;
    border-radius: var(--btn-radius);
    color: var(--clr-blue);
    font-weight: 400;
    text-align: center;
    font-size: calc(var(--btn-font-size) / 1.4);
    padding: 0.6rem 1.5rem;
    width: 100%;
    transition: 0.15s all;
    display: inline-block; 
}

.card:hover {
    box-shadow: none;
    cursor: pointer;
}

.link {
    text-decoration: none;
    color: var(--clr-dark-grey);
    border: none;
    box-shadow: none;
    border: 1px solid var(--clr-medium-light-grey);
    box-shadow: var(--btn-shadow);
    background-color: transparent;
}

.link:hover {
    background-color: var(--clr-very-light-blue);
}

.secondary {
    color: var(--clr-blue);
    border: none;
    border: 1px solid var(--clr-blue);
    background-color: transparent;
    box-shadow: none;
}

.secondary:hover {
    box-shadow: var(--box-shadow-small);
}

</style>
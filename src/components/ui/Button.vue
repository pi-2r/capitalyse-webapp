<template>
    <button v-if="!link" :class="mode">
        <slot></slot>
    </button>
    <router-link v-else :to="to" :class="mode">
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

button {
    padding: var(--btn-padding);
    font-size: var(--btn-font-size);
    font-weight: var(--btn-font-weight);
    font-family: var(--fnt-main);
    background-color: var(--clr-blue);
    color: var(--clr-white);
    cursor: pointer;
    transition: 0.2s all;
    border: 2px solid var(--clr-blue);
    border-radius: var(--btn-radius);
    user-select: none;
} 


button:hover {
    transform: scale(1.01);
    box-shadow: var(--btn-shadow);
}

.card {
    text-decoration: none;
    margin-top: 1rem;
    background-color: rgba(1, 120, 255, 0.072);
    border-color: rgb(106, 176, 255);
    border-width: 1px;
    border-radius: var(--btn-radius);
    color: var(--clr-blue);
    font-weight: 400;
    text-align: center;
    font-size: 0.9rem;
    padding: 0.6rem 1.5rem;
    width: 100%;
    transition: 0.2s all;
    display: inline-block; 
}

.card:hover {
    box-shadow: none;
    cursor: pointer;
    background-color: rgb(218, 237, 255);  
}

.link {
    outline: 1px solid rgb(106, 176, 255);

}



</style>
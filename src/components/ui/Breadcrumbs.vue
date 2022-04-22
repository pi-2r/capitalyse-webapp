<template>
    <p class="breadcrumbs">
        <a :href="baseLink">Results</a>
        
        <span class="imagewrapper">
            <img src="../../assets/next.png"/>
        </span>
        
        <a :href="secondLink">My Deposits</a>
    </p>
</template>

<script>
export default {
    name: 'Breadcrumbs',
    props: {
        baseLink: {
            type: String,
            default: '/dashboard',
        },
        secondLink: {
            type: String,
            default: '#',
        },
    }
}
</script>

<style scoped>
.breadcrumbs {
    display: flex;
    color: var(--clr-grey);
    font-weight: 400;
}

.breadcrumbs a {
    color: var(--clr-grey);
    text-decoration: none;
}

.breadcrumbs a:hover {
    text-decoration: underline;
}

.imagewrapper {
    display: flex;
    align-items: center;
}

img {
    margin-left: 0.3rem;
    margin-right: 0.3rem;
    height: 0.65rem;
}
</style>
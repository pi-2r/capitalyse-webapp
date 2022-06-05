<template>
    <section class="footerContainer">
        <section class="footerWrapper">
            <h3>DeGiro Analytics</h3>
            <p>Footer</p>
        </section>
    </section>
</template>

<style scoped>
.footerContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: var(--clr-footer-background);
    box-shadow: var(--box-shadow);
    height: 7rem;
    margin-top: 2rem;
}

h3 {
    color: var(--clr-grey);
    text-align: center;
    margin-bottom: 0.3rem;
}

p {
    color: var(--clr-grey);
    text-align: center;
}
</style>
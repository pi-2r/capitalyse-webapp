<template>
     <section class="deletePopup" >
        <section class="overlay" @click="$emit('clickOutsidePopup')"></section>
        <section class="deletePopup__content">
           <slot></slot> 
        </section>
    </section>
</template>

<style scoped>
h1 {
    font-size: 1.75rem;
}

p {
    color: var(--clr-grey);
    font-size: 1.2rem;
}

.overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: -1;
}

.deletePopup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    
}

.deletePopup__content {
    border-radius: var(--card-border-radius);
    
    background-color: var(--clr-white);
    margin: 1rem;
    padding: 2rem;
    max-width: 25rem;
}


</style>
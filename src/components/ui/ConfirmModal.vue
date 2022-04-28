<template>
     <section class="deletePopup">
        <div class="deletePopup__content">
           <slot></slot> 
        </div>
    </section>
</template>

<script>
export default {
    
}
</script>

<style scoped>
h1 {
    font-size: 2rem;
}

p {
    color: var(--clr-grey);
    font-size: 1.2rem;
}

.deletePopup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
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
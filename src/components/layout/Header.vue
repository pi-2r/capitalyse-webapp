<template>
    <header>
        <nav>
            <div class="nav-wrapper">
                <ul id="nav-mobile" class="right hide-on-med-and-down">
                    <!-- <li><a href="index.html">Home</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="contact.html">Contact</a></li> -->
                    <li><a>This app is still under development!</a></li> 
                    <li><a>Deze applicatie is nog in ontwikkeling!</a></li>
                </ul>
            </div>
        </nav>
    </header>
</template>

<script>
export default {
    
}
</script>

<style scoped>
.nav-wrapper {
    height: 4rem;
    box-shadow: var(--box-shadow);
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    background-color: var(--clr-white);
}

.nav-wrapper ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0 2rem;
    width: var(--container-width);
}

.nav-wrapper ul li {
    list-style: none;
}

.nav-wrapper ul li a {
    color: var(--clr-blue);
    font-size: 1.2rem;
    font-weight: 300;
    text-decoration: none;
}

nav ul li:nth-of-type(2) {
        display: none;
}

/* Media Queries */

@media screen and (min-width: 768px) {
    nav ul li:nth-of-type(2) {
        display: block;
}

}
</style>
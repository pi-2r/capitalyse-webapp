<template>
    <header>
        <nav class="nav-wrapper">
            <div class="nav-container">
                <section class="leftSide">
                    <ul>
                        <h2><router-link class="routerLinkH2" to="/">Analytics</router-link></h2>
                        <!-- <li><a href="index.html">Home</a></li>
                        <li><a href="about.html">About</a></li>
                        <li><a href="contact.html">Contact</a></li> -->
                        <li><router-link class="routerLink" to="/portfolios">My Portfolio's</router-link></li> 
                        <li><router-link class="routerLink" to="/upload">+ New Portfolio</router-link></li>
                    </ul>
                </section>
                
                <section class="rightSide">
                    <section>
                        <Button class="premiumBtn">
                            <Icon icon="fluent:premium-16-filled" color="#e8e8e8" height="15" />
                            Premium

                        </Button>
                    </section>
                       <LogoutButton/>
                    <!-- <section> -->
                       <!-- <Icon class="settingsIcon" icon="ci:settings" color="var(--clr-grey)" height="35" /> -->
                    <!-- </section> -->
                </section>
            </div>
        </nav>
    </header>
</template>

<script>
import { Icon } from '@iconify/vue';
import LogoutButton from '../../components/ui/LogoutButton.vue';


export default {
    components: {
        Icon,
        LogoutButton
    },
}
</script>

<style scoped>
.premiumBtn {
    background-color: var(--clr-blue);
    color: var(--clr-white);
    padding: 0.5rem 1rem;
}

.routerLink {
    text-decoration: none;
    color: var(--clr-grey);
}

.routerLinkH2 {
    text-decoration: none;
    color: var(--clr-black);
}

.routerLinkH2:hover {
    text-decoration: none;
    color: var(--clr-black);
}

.router-link-exact-active {
    color: var(--clr-blue);
}


h2 {
    color: var(--clr-black);
    font-weight: 600;
    font-size: 1.5rem;
}

.leftSide ul {
    display: flex;
    justify-content: center;
    align-items: center;
    
}


.leftSide li {
    margin-left: 2.5rem;
    list-style-type: none;
    color: var(--clr-grey);
}

h2 a{
    text-decoration: none;
    color: var(--clr-black);
}

a:hover {
    color: var(--clr-blue);
    cursor: pointer;
}
a:hover {
    color: var(--clr-blue);
    cursor: pointer;
}

.settingsIcon:hover {
    cursor: pointer;
    color: var(--clr-blue);
}

.rightSide {
    display: flex;
    justify-content: flex-end;
    align-items: center;

}

.rightSide section {
    display: flex;
    align-items: center;
    margin-left: 2rem;
}

.nav-container {
    margin: 0 auto;
    width: 95%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-wrapper {
    background-color: var(--clr-very-light-blue);
    height: var(--header-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
  
    box-shadow: var(--box-shadow-big);
}

/* media queries */

@media screen and (min-width: 400px) {
    .nav-container {
        max-width: 95%;
    }   
}

@media screen and (min-width: 650px) {
 

    .nav-container {
        max-width: 90%;
    }
}

@media screen and (min-width: 1050px) {
   

    .nav-container {
        max-width: 1000px;
    }
}

/* Media Queries */

@media screen and (max-width: 800px) {


   .rightSide section {
       margin-left: 0.5rem;
   }

    .leftSide ul {
        flex-direction: column;
    }
   
}
</style>
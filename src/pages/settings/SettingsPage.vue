<template>
    <Header/>
    <article class="container">
        <h1>Settings</h1>
        <section class="settingsCard__container">
            <section class="settingsCard">
                <h2>Appearance</h2>
                <section class="settingsSection">
                    <!-- theme toggle -->
                    <label for="theme">Dark mode</label>
                    <input type="checkbox" @change="toggleTheme" value="darkMode" v-model="isDarkThemeOn" id="theme" name="theme" class="themeCheckbox">
                </section>
            </section>
            <section class="settingsCard">
                <h2>Other</h2>
                <section class="settingsSection">
                    <LogoutButton />
                </section>
            </section>
        </section>

    </article>
</template>

<script>
import Header from '../../components/layout/Header.vue';
import LogoutButton from '../../components/ui/LogoutButton.vue';


export default {
    components: {
        Header,
        LogoutButton,
    },
    data() {
        return {
            isDarkThemeOn: true,
        }
    },
    methods: {
        toggleTheme() {
            if(this.isDarkThemeOn) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }

            const root = document.querySelector(':root');
            root.setAttribute('data-theme', localStorage.getItem('theme'));
        },
        getTheme() {
            const theme = localStorage.getItem('theme');

            if(theme === 'dark') {
                this.isDarkThemeOn = true;
            } else {
                this.isDarkThemeOn = false;
            }
        }
    },
    created() {
        this.getTheme();
    }
}
</script>

<style scoped>
.container {
    margin: 0 auto;
    margin-bottom: 4rem;
    margin-top: 3rem;
    width: 28rem;
}

.themeCheckbox {
    display: block;
    appearance: checkbox;
    -webkit-appearance: checkbox;
    -moz-appearance: checkbox;
    -ms-appearance: checkbox;
    -o-appearance: checkbox;
    width: 1.2rem;
    height: 1.2rem;
    cursor: pointer;
}

h1 {
    margin-bottom: 2rem;
    margin-top: 0.25rem;
}

h2 {
    margin-bottom: 1rem;
}

.settingsCard {
    width: 30rem;
    padding: 1.25rem;
    background-color: var(--clr-very-light-blue);
    box-shadow: var(--box-shadow-big);
    border-radius: var(--card-border-radius);
    margin-bottom: 1rem;
}

.settingsSection {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--clr-light-grey);
    padding-top: 1rem;
    margin-top: 1rem;
}

@media screen and (min-width: 400px) {
    .container {
        max-width: 92%;
    }   
}

@media screen and (min-width: 650px) {
 

    .container {
        max-width: 90%;
    }
}

@media screen and (min-width: 1050px) {
 
    .container {
        max-width: 1000px;
    }

}
</style>
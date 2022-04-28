<template>
    <Header></Header>
    <section class="container">

        <section class="myPortfolios__header">
            
            <section class="heading">
                <Icon icon="bi:bar-chart-fill" height="30"  color="var(--clr-blue)"/>
                <h1>My Portfolios</h1>
            </section>
            <Button class="secondary addPortfolioBtn" link @click="addPortfolio">+ Add Portfolio</Button>
        </section>

        <section class="tablecontainer">
            <table class="portfoliosTable">
                <thead>
                    <tr>
                        <th>Portfolio</th>
                        <th>Date Added</th>
                        <th>Transactions File</th>
                        <th>Account File</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr  :key="portfolio.id" v-for="portfolio in portfolios">
                        <PortfolioCard @deletePortfolio="deletePortfolio"
                            :portfolio="portfolio"   
                        />
                    </tr>
                    <!-- if no portfolios -->
                    <tr v-if="portfolios.length < 1">
                        <td class="noPortfolios" colspan="3">No portfolios found <router-link to="/portfolios/new">Add one to get started</router-link></td>
                    </tr>
                </tbody>
            </table>
        </section>
    </section>
</template>

<script>
import { Icon } from '@iconify/vue';
import Header from '../../components/layout/Header.vue';
import PortfolioCard from './PortfolioCard.vue';

export default {
    components: {
        Header,
        PortfolioCard,
        Icon
    },
    data() {
        return {
            isLoading: false,
            portfolios: [],
        }
    },
    computed: {
        areTherePortfolios() {
            return this.$store.getters['files/hasPortfolios'];
        },
        amountOfPortfolios() {
            return this.$store.getters['files/amountOfPortfolios'];
        },
        portfoliosFromStore() {
            return this.$store.getters['files/getPortfolios'];
        },
    },
    watch: {
        amountOfPortfolios() {
            console.log('change');
            this.loadData();
        },
    },
    methods: {
        addPortfolio() {
            // if(this.amountOfPortfolios >= 1) {
            //     window.alert('You can only have one portfolio, delete the existing one or upgrade your account to add more');

            // } else {
            this.$router.push('/portfolios/new');
            // }
        },
        loadData() {
            if(this.areTherePortfolios) {
                this.loadPortfoliosIntoArray();
                this.isLoading = false;
            } else {
                this.isLoading = true;
                this.$store.dispatch('files/fetchAllPortfolios')
            } 
        },
        loadPortfoliosIntoArray() {
            this.portfolios = [];
            for(let i = 0; i < this.portfoliosFromStore.length; i++) {
                this.portfolios.push(this.portfoliosFromStore[i]);
            }
        },
        deletePortfolio(id) {
            this.$store.dispatch('files/deletePortfolio', id);
            this.portfolios = this.portfolios.filter(portfolio => portfolio.id !== id);
        },
    },
   
    created() {
        this.isLoading = true;
        this.loadData();
        // reset transactionsFile and accountFile
        this.$store.dispatch('files/resetFiles');


    }
}
</script>

<style scoped>
.heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.heading h1 {
    margin-left: 0.8rem;
}

.noPortfolios {
    padding: 1rem;
}

.container {
     margin: 0 auto;
     margin-bottom: 4rem;
     margin-top: 3rem;
}

.myPortfolios__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tablecontainer {
    margin-top: 2rem;
       min-width: 20rem;
 
}

.portfoliosTable {
    width: 100%;
    border-radius: var(--card-border-radius);
    border-collapse: collapse;
   
}

.addPortfolioBtn {
    border: 2px solid var(--clr-blue) !important;
    color: var(--clr-blue) !important;
    padding: 0.6rem 1.4rem;
    font-size: 1.1rem;
    background-color: var(--clr-white) !important;
}

.addPortfolioBtn:hover {
    box-shadow: var(--box-shadow);
    background-color: none !important;
}


table {
    width: 100%;
    box-shadow: var(--box-shadow);
    background-color: var(--clr-very-light-blue);
}

thead {
    color: var(--clr-black);
    border-bottom: 2px solid rgba(0, 0, 0, 0.05);
}

th {
    padding: 1.2rem 2rem;
    text-align: left;
    font-size: 1.1rem;
}

th:last-of-type {
    padding: 0;
    margin: 0;
    width: 1px;
}

tr {
    border-bottom: 2px solid rgba(0, 0, 0, 0.05);
    transition: 0.1s all;
}

tr:nth-last-child(1) {
    border-bottom: none;
}


.th__number {
    text-align: right;
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

/* max width */
@media screen and (max-width: 850px) {
    .tablecontainer {
        overflow-x: scroll;
    }
}

@media screen and (max-width: 600px) {
    .myPortfolios__header {
        display: inline-block;
    }

    .heading {
        margin-bottom: 1.5rem;
    }
}
    
</style>
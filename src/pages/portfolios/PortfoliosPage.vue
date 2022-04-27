<template>
    <Header></Header>
    <section class="container">

        <section class="myPortfolios__header">
            <h1>My Portfolios</h1>
            <Button class="secondary addPortfolioBtn" link to="/portfolios/new">+ Add Portfolio</Button>
        </section>

        <section class="tablecontainer">
            <table class="portfoliosTable">
                <thead>
                    <tr>
                        <th>Portfolio</th>
                        <th>Date Added</th>
                        <th class="th__number">Transactions File</th>
                        <th class="th__number">Account File</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr  :key="portfolio.id" v-for="portfolio in portfolios">
                        <PortfolioCard
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

import Header from '../../components/layout/Header.vue';
import PortfolioCard from './PortfolioCard.vue';

export default {
    components: {
        Header,
        PortfolioCard
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
            console.log(this.portfoliosFromStore[0].id);
            this.portfolios = [];
            for(let i = 0; i < this.portfoliosFromStore.length; i++) {
                this.portfolios.push(this.portfoliosFromStore[i]);
            }
        },
    },
   
    created() {
        this.isLoading = true;
        this.loadData();
        // reset transactionsFile and accountFile
        this.$store.dispatch('files/resetFiles');

        this.$store.dispatch('files/fetchAllPortfolios')

    }
}
</script>

<style scoped>
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
    padding: var(--btn-small-padding);
    font-size: var(--btn-font-size);
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
        display: block;
    }

    .myPortfolios__header h1 {
        margin-bottom: 1rem;
    }
}
    
</style>
<template>
    <Header></Header>
    <section class="container">

        <h1>My Files</h1>

        <section class="tablecontainer">
            <table>
                <thead>
                    <tr>
                        <th>Latest Data Point</th>
                        <th>Total Data Points</th>
                        <th>Dashboard</th>
                    </tr>
                </thead>
                <tbody>
                    <tr :key="portfolio.id" v-for="portfolio in portfolios">
                        <PortfolioCard
                            :portfolio="portfolio"   
                        />
                    </tr>
                    <!-- if no portfolios -->
                    <tr v-if="portfolios.length < 1">
                        <td colspan="3">No portfolios found</td>
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
            portfolios: [],
            isLoading: true,
        }
    },
    computed: {
        isThereData() {
            return this.$store.getters['files/hasFiles'];
        },
        portfolioFiles() {
            return this.$store.getters['files/getFiles'];
        },
    },
    watch: {
        isThereData() {
            this.loadData();
        }
    },
    methods: {
        loadData() {
            if(this.isThereData) {
                this.getPortfolios();
                this.isLoading = false;
            } else {
                this.isLoading = true;
            } 
        },
        getPortfolios() {
            // object to array
            const holder = Object.values(this.portfolioFiles);
            for(let i = 0; i < holder.length; i++) {
                this.portfolios.push({
                    id: i,
                    file: holder[i],
                    length: holder[i].length,
                });

            }
     
        }
    },
    created() {
        if(!this.isThereData) {
            console.log('No data in store');
            this.isLoading = true;
         
            this.$store.dispatch('files/fetchCSVData')
        } else {
            this.loadData();
        }
    }
}
</script>

<style scoped>
.container {
     margin: 0 auto;
     margin-bottom: 4rem;
     margin-top: 3rem;
}

.tablecontainer {
    margin-top: 2rem;
}

table {
    width: 100%;
    box-shadow: var(--box-shadow);
}

thead {
    background-color: var(--clr-blue);
    color: var(--clr-white);
    
}

th {
    padding: 1rem;
}

tbody {
    background-color: var(--clr-very-light-blue);
}



@media screen and (min-width: 400px) {
    .container {
        max-width: 95%;
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
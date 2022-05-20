<template>
  <Header></Header>
    <section class="container" >
        <Breadcrumbs 
            baseLink="/portfolios"
            baseLinkName="My Portfolios" 
            secondLink="#"
            :secondLinkName="'Dashboard ' + (portfolioName ? portfolioName : '')"
        />
        <section class="head">
            <section class="titleAndBackButtonContainer">
                <BackButton/>
                <h1>Dashboard {{ portfolioName }}</h1>
            </section>
            <p class="startDate">You started {{accountAge ? accountAge : 'Loading...'}} ago</p>
            
        </section>

        <DividendChart class="dividendChartDashboard"/>
        
        <section class="cardsContainer">
            <DepositsCard />
            <TransFeesCard />
            <TradingVolCard />
        </section>
        
    </section>
</template>

<script>
import Header from '../../components/layout/Header.vue';
import DividendChart from './DividendChart.vue';
import Breadcrumbs from '../../components/ui/Breadcrumbs.vue';
import DepositsCard from './DepositsCard.vue';
import TradingVolCard from './TradingVolCard.vue';
import TransFeesCard from './TransFeesCard.vue';
import BackButton from '../../components/ui/BackButton.vue';

export default {
    name: 'Dashboard',
    components: {
        DividendChart,
        DepositsCard,
        TradingVolCard,
        TransFeesCard,
        Header,
        Breadcrumbs,
        BackButton
    },
    data() {
        return {
            accountAge: '',
        }
    },
    computed: {
        portfolioName() {
            return this.$store.getters['files/getCurrentPortfolioName'];
        },
        hasCurrentPortfolio() {
            const portfolios = this.$store.getters['files/getPortfolios'];
            for(let i = 0; i < portfolios.length; i++) {
                if(portfolios[i].id === this.$route.params.id) {
                    return true;
                }
            }
            return false;
        },
        hasCurrentFiles() {
            const portfolios = this.$store.getters['files/getPortfolios'];
            let hasFiles = false
            portfolios.forEach(portfolio => {
                if(portfolio.id === this.$route.params.id) {
                    if(portfolio.accountFile && portfolio.transactionsFile) {
                        hasFiles = true;
                    }
                }
            });
            return hasFiles;
        },
        hasPortfolios() {
            return this.$store.getters['files/hasPortfolios'];
        },
        files() {
            return this.$store.getters['files/getCurrentPortfolio'];
        }
    },
    watch: {
        hasPortfolios() {
            this.loadData();
        },
        hasCurrentFiles() {
            this.calculateStartAndEndDates();
        }
    },
    methods: {
        calculateStartAndEndDates() {
            const today = new Date();
            const accountFile = this.files.accountFile;
            
            let startDate = accountFile[accountFile.length - 2][0];
            startDate = new Date(startDate.split('-')[2], startDate.split('-')[1] - 1, startDate.split('-')[0]);
            let days = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
            let months = Math.floor(days / 30);
            const years = Math.floor(months / 12);

            if(years > 0) {
                this.accountAge = years + ' year' + (years > 1 ? 's' : '') + ' and ' + (months - (years * 12)) + ' month' + (months - (years * 12) > 1 ? 's' : '');
            } else if(months > 0) {
                this.accountAge = months + ' month' + (months > 1 ? 's' : '') + ' and ' + (days - (months * 30)) + ' day' + (days - (months * 30) > 1 ? 's' : '');
            } else {
                this.accountAge = days + ' day' + (days > 1 ? 's' : '');
            }
        },
        loadData() {
            if(!this.hasCurrentFiles && this.hasCurrentPortfolio) {
                this.$store.dispatch('files/fetchOnePortfolio', this.$route.params.id);
            } else if (!this.hasCurrentPortfolio) {
                this.$store.dispatch('files/fetchAllPortfolios');
            }

            if(this.hasCurrentPortfolio) {
                this.setCurrentPortfolio(this.$route.params.id);
            }
        },
        setCurrentPortfolio(id) {
            this.$store.dispatch('files/setCurrentPortfolio', id);
        },
        resetCurrentPortfolio() {
            this.$store.dispatch('files/resetCurrentPortfolio');
        }
    },
    created() {
        this.loadData();

        if(this.hasCurrentFiles) {
            this.calculateStartAndEndDates();
        }
    }
}
</script>

<style scoped>
.titleAndBackButtonContainer {
    margin-bottom: 0;
}

.startDate {
    color: var(--clr-grey);
    font-size: 0.7rem;
}

.upload {
 margin-bottom: 2.5rem;
}

h1 {
    margin-bottom: 0.2rem;
}

.head {
 
    margin-bottom: 3rem;
}

.dividendChartDashboard {
    margin-bottom: 4rem;
}

.cardsContainer {
    
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 2rem;
}

.container {
     margin: 0 auto;
     margin-bottom: 4rem;
     margin-top: 3rem;
}

@media screen and (min-width: 400px) {
    .container {
        max-width: 92%;
    }   
}

@media screen and (min-width: 650px) {
    .cardsContainer {
        grid-template-columns: 1fr 1fr;
    }

    .container {
        max-width: 90%;
    }
}

@media screen and (min-width: 1050px) {
    .cardsContainer {
        grid-template-columns: 1fr 1fr 1fr;
    }

    .container {
        max-width: 1000px;
    }

}

</style>
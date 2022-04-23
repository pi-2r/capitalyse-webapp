<template>
    <section class="container">
        <section class="head">
            <h1>Dashboard</h1>
            <LogoutButton/>
        </section>

        <section class="upload">

        <Button link to="/upload">Upload Files</Button>
        </section>

        <DividendChart/>

        <section class="cardsContainer">
            <DepositsCard/>
            <TradingVolCard />
            <TransFeesCard />
        </section>
        
    </section>
</template>

<script>

import DividendChart from '../../components/dashboard/DividendChart.vue';

import DepositsCard from './DepositsCard.vue';
import TradingVolCard from './TradingVolCard.vue';
import TransFeesCard from './TransFeesCard.vue';

import LogoutButton from '../../components/ui/LogoutButton.vue';

export default {
    name: 'Dashboard',
    components: {
        DividendChart,
        DepositsCard,
        TradingVolCard,
        TransFeesCard,
        LogoutButton
    },
    computed: {
        depositIndexes() {
            return this.$store.getters['indexes/deposits'];
        },
        transactionsIndexes() {
            return this.$store.getters['indexes/transactions'];
        },
        tradingVolumeIndexes() {
            return this.$store.getters['indexes/tradingVolume'];
        },
        accountFile() {
            return this.$store.getters['files/accountFile'];
        },
        transactionsFile() {
            return this.$store.getters['files/transactionsFile'];
        },
        depositNames() {
            return this.$store.getters['dictionary/deposit'];
        },
        isThereData() {
            return this.accountFile && this.transactionsFile;
        }
    },
    data() {
        return {
            totDeposits: 0,
            totTransFees: 0,
            totTradingVol: 0,
        }
    },
    methods: {
        loadData() {
            this.getTotalTransactionsFees();
        },
        getTotalTransactionsFees() {
            const data = this.transactionsFile;
            const searchIndex = this.transactionsIndexes.searchIndex;
            let tot = 0;

            for(let i = 0; i < data.length -1; i++) {
                if(data[i][searchIndex] && data[i][searchIndex] !== "" &&
                data[i][searchIndex]) {
                    let nr = parseFloat(data[i][searchIndex]);
                    tot += nr;
                }
            }
            tot = tot.toFixed(2);
            // to number
            tot = parseFloat(tot);
            this.totTransFees = tot;
        },
        
        cleanNumber(number) {
            let isPositive = number.includes("-") ? false : true;
            number = number.replace(/['"]+/g, '');
            const decimalNumbers = number.split(",")[1].length;
            const dividedBy = Math.pow(10, decimalNumbers);
            let decimal = Number.parseFloat(number.split(",")[1]) / dividedBy;
            number = Number.parseFloat(number.split(",")[0])
            isPositive ? number += decimal : number -= decimal;
            return number;
        },
        includesFromArray(array, value) {
            for(let i = 0; i < array.length; i++) {
                if(value.includes(array[i])) {
                    return true;
                }
            }
            return false;
        },
    },
    mounted() {
        console.log(this.accountFile);
        if(this.isThereData) {
            this.loadData();
        }
    },
}
</script>

<style scoped>
.upload {
 margin-bottom: 2.5rem;
}

h1 {
    margin-bottom: 2rem;
}

.head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    margin-bottom: 2rem;
}



.cardsContainer {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 2rem;
}

.container {
     margin: 0 auto;
     margin-top: 2rem;
     margin-bottom: 2rem;
}

@media screen and (min-width: 400px) {
    

    .container {
        max-width: 95%;
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
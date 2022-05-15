<template>
    <div>
        <table>
            
        </table>

        <section class="tablecontainer">
            <section class="tablecontainerHeading">
                <h2 class="tableTitle">All Deposits & Withdrawals</h2>
                <section class="tableContainerHeading__dropdown">
                    <select 
                        name="sortDeposits" 
                        id="sortDeposits" 
                        class="tableSelect"
                    >
                        <option value="dateNewToOld">Date (new-old)</option>
                        <option value="dateOldToNew">Date (old-new)</option>
                        <option value="amountHighToLow">Amount (high-low)</option>
                        <option value="amountLowToHigh">Amount (low-high)</option>
                        <option value="typeDeposit">Deposits only</option>
                        <option value="typeWithdrawal">Withdrawals only</option>
                    </select>
                </section>
            </section>
            
            <table class="depositsTable">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th class="number">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr :key="deposit.id" v-for="deposit in deposits">
                        <DepositsListItem 
                            :deposit="deposit"   
                        />
                    </tr>
                    <tr v-if="deposits.length < 1 && !isLoading">
                        <td class="noDeposits" colspan="3">
                            <p>No results</p>
                        </td>
                    </tr> 
                      <!-- 
                   <tr v-if="isLoading">
                        <td colspan="3" class="loading">
                            Loading...
                        </td>
                    </tr> -->
                </tbody>
            </table>
        </section>
    </div>
</template>
<script>
import cleanNumberMixin from '../../../mixins/cleanNumber';
import includesFromArrayMixin from '../../../mixins/includesFromArray';
import splitDateMixin from '../../../mixins/splitDate';

import DepositsListItem from './DepositsListItem';

export default {
    mixins: [cleanNumberMixin, includesFromArrayMixin, splitDateMixin],
    components: {
        DepositsListItem
    },
    data() {
        return {
            deposits: [],
            isLoading: false,
            error: false,
        }   
    },
    watch: {
        isThereData() {
            this.loadData();
        }
    },
    computed: {
        indexes() {
            return this.$store.getters['indexes/deposits'];
        },
        depositNames() {
            return this.$store.getters['dictionary/deposit'];
        },
        failedDepositNames() {
            return this.$store.getters['dictionary/failedDeposit'];
        },
        withdrawalNames() {
            return this.$store.getters['dictionary/withdrawal'];
        },
        currentPortfolio() {
            return this.$store.getters['files/getCurrentPortfolio'];
        },
        isThereData() {
            return !!this.currentPortfolio.accountFile;
        }
    },
    methods: {
        loadData() {
            if(this.isThereData) {
                this.getDeposits();
                this.isLoading = false;
            } else {
                this.isLoading = true;
            } 
        },
        getDeposits() {
            const depositNames = this.depositNames;
            const withdrawalNames = this.withdrawalNames;
            // const failedDepositNames = this.failedDepositNames;

            const data = this.currentPortfolio.accountFile;
            const dateIndex = this.indexes.dateIndex;
            const searchIndex = this.indexes.searchIndex;
            const depositIndex = this.indexes.depositIndex;


            for(let i = 0; i < data.length; i++) {
                if(data[i][depositIndex]) {
                    const validDeposit = 
                        (this.includesFromArray(depositNames, data[i][searchIndex]) &&
                        this.cleanNumber(data[i][depositIndex]) > 0);

                    const validWithdrawal = 
                        (this.includesFromArray(withdrawalNames, data[i][searchIndex]) &&
                        this.cleanNumber(data[i][depositIndex]) < 0);

                    // const validFailedDeposit = 
                        // (this.includesFromArray(failedDepositNames, data[i][searchIndex]));

                    if(validDeposit || validWithdrawal) {
                        const date = data[i][dateIndex];
                        const deposit = this.cleanNumber(data[i][depositIndex]);
                        
                        const depositObj = {
                            date: date,
                            amount: deposit,
                        }
                        this.deposits.push(depositObj);
                    }

                    // if(validFailedDeposit) {
                    //     const depositName = data[i][searchIndex];
                        
                    //     console.log(depositName + ' is a failed deposit');
                    // }
                }
            }
        }
    },
    created() {
        this.loadData();
    }
}
</script>
<style scoped>
select {
    padding: 0.6rem;
    border-radius: 0.75rem;
    background-color: var(--clr-very-light-blue);
    color: var(--clr-dark-grey);
    font-weight: 600;
    font-size: 1rem;
    border: 1px solid var(--clr-light-grey);
    box-shadow: var(--box-shadow-small);
}

select:hover {
    cursor: pointer;
    
}

.tablecontainerHeading {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tablecontainerHeading {
    padding: 2rem;
}

.number {
    text-align: right;
}

.tablecontainer {
    margin-top: 2rem;
    background-color: var(--clr-very-light-blue);
    border-radius: var(--card-border-radius);
    box-shadow: var(--box-shadow-big);
    padding-bottom: 1rem;

}

.depositsTable {
    width: 100%;
    border-radius: var(--card-border-radius);
    border-collapse: collapse;

}

.noDeposits {
    padding: 2rem;
}

.noDeposits p {
    font-size: 1rem;
    color: var(--clr-grey);
}

table {
    width: 100%;
    background-color: var(--clr-very-light-blue);
}

thead {
    color: var(--clr-black);
    border-bottom: 1px solid var(--clr-light-grey);
}

th {
    padding: 1.2rem 2rem;
    text-align: left;
    font-weight: 500;
    color: var(--clr-black)
}

tr {
    border-bottom: 1px solid var(--clr-light-grey);
    transition: 0.1s all;
}

tr:nth-last-child(1) {
    border-bottom: none;
}

@media screen and (max-width: 350px) {
    .tablecontainer {
        overflow-x: scroll;
        padding: 2rem;
        margin-left: -2rem;
        margin-top: 0;
        min-width: 20rem;
    }
}
</style>
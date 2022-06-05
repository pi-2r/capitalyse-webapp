<template>
    <div>
        <table>
            
        </table>

        <section class="tablecontainer">
            <section class="tablecontainerHeading">
                <h2 class="tableTitle">All Deposits & Withdrawals <span class="amountOfDeposits">({{ amountOfDeposits }})</span> </h2>
                <section class="tableContainerHeading__dropdown">
                    <select 
                        name="sortDeposits" 
                        id="sortDeposits" 
                        class="tableSelect"
                        v-model="selectedSortType"
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
            <section class="depositsTableWrapper">
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
        </section>
    </div>
</template>
<script>
import cleanNumberMixin from '@/mixins/cleanNumber';
import includesFromArrayMixin from '@/mixins/includesFromArray';
import splitDateMixin from '@/mixins/splitDate';

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
            selectedSortType: 'dateNewToOld',
        }   
    },
    watch: {
        isThereData() {
            this.loadData();
        },
        selectedSortType() {
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
        },
        amountOfDeposits() {
            return this.deposits.length;
        },
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

            this.deposits = [];

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

            this.sortItems();
        },
        sortItems() {
            const sortType = this.selectedSortType;

            if(sortType === 'dateNewToOld') {
                this.deposits = this.sortByDateNewToOld(this.deposits);
            } else if(sortType === 'dateOldToNew') {
                this.deposits = this.sortByDateOldToNew(this.deposits);
            } else if(sortType === 'amountHighToLow') {
                this.deposits = this.sortByAmountHighToLow(this.deposits);
            } else if(sortType === 'amountLowToHigh') {
                this.deposits = this.sortByAmountLowToHigh(this.deposits);
            } else if(sortType === 'typeDeposit') {
                this.deposits = this.onlyTypeDeposit(this.deposits);
            } else if(sortType === 'typeWithdrawal') {
                this.deposits = this.onlyTypeWithdrawal(this.deposits);
            }
        },
        sortByDateNewToOld(deposits) {
            return deposits.filter(deposit => {
                return deposit !== null;
            });
        },
        sortByDateOldToNew(deposits) {
            return this.sortByDateNewToOld(deposits).reverse();
        },
        sortByAmountHighToLow(deposits) {
            return deposits.sort((a, b) => {
                return b.amount - a.amount;
            });
        },
        sortByAmountLowToHigh(deposits) {
            return deposits.sort((a, b) => {
                return a.amount - b.amount;
            });
        },
        onlyTypeDeposit(deposits) {
            return deposits.filter(deposit => {
                return deposit.amount > 0;
            });
        },
        onlyTypeWithdrawal(deposits) {
            return deposits.filter(deposit => {
                return deposit.amount < 0;
            });
        },
    },
    created() {
        this.loadData();
    }
}
</script>
<style scoped>
.amountOfDeposits {
    color: var(--clr-grey);
    font-size: 1rem;
}

select {
    padding: 0.6rem;
    border-radius: 0.75rem;
    background-color: var(--clr-very-light-blue);
    color: var(--clr-dark-grey);
    font-weight: 600;
    font-size: 1rem;
    border: 1px solid var(--clr-medium-light-grey);
    box-shadow: var(--btn-shadow);
    transition: 0.2s all;
}

select:hover {
    cursor: pointer;
    border-color: var(--clr-medium-light-grey-2);
}

.tablecontainerHeading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
}


.number {
    text-align: right;
}

.tablecontainer {
    background-color: var(--clr-very-light-blue);
    border-radius: var(--card-border-radius);
    box-shadow: var(--box-shadow-big);
    border: 1px solid var(--clr-very-light-grey);
    padding-bottom: 1rem;
}

.depositsTableWrapper {
    max-height: 70vh;
    overflow-y: scroll;
}

::-webkit-scrollbar {
    width: 6px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: var(--clr-light-grey); 
  border-radius: 200rem;
  transition: 0.2s all;
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
    min-width: 28rem;
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

@media screen and (max-width: 650px) {
    .depositsTableWrapper {
        overflow-x: scroll;
    }

    th {
        padding: 1.5rem;
    }

    .tablecontainerHeading {
        align-items: baseline;
        flex-direction: column;
        gap: 1rem;
    }

}
</style>
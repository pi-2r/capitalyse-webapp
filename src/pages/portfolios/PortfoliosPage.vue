<template>
    <transition name="slide-fade" mode="out-in">
        <ConfirmModal class="deletePopup" v-if="isDeletePopupOpen">
            <h1>Are you sure?</h1>
            <p>Are you sure you want to permanently delete this portfolio? This action can not be reversed.</p>
            <div class="deletePopup__btns">
                <Button class="deletePopup__btn noBtn" @click="toggleDeletePopup">Cancel</Button>
                <Button class="deletePopup__btn deleteBtn" @click="deletePortfolio">
                    <Icon icon="bxs:trash" color="var(--clr-white)" height="22" class="deleteBtnIcon"/>
                    Delete
                </Button>
            </div>
        </ConfirmModal>
    </transition>

    <Header></Header>
    <section class="container">

        <section class="myPortfolios__header">
            <section class="heading">
                <Icon icon="bi:bar-chart-fill" class="headingIcon" height="30" color="var(--clr-blue)"/>
                <h1>My Portfolios</h1>
            </section>
            <Button class="addPortfolioBtn" link @click="addPortfolio">+ Add Portfolio</Button>
        </section>

        <section class="tablecontainer">
            <table class="portfoliosTable">
                <thead>
                    <tr>
                        <th>Portfolio</th>
                        <th>Date Added</th>
                        <th class="fileSize">Transactions File</th>
                        <th class="fileSize">Account File</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr  :key="portfolio.id" v-for="portfolio in portfolios">
                        <PortfolioCard @toggleDeletePopup="toggleDeletePopup"
                            :portfolio="portfolio"   
                        />
                    </tr>
                    <!-- if no portfolios -->
                    <tr v-if="portfolios.length < 1 && !isLoading">
                        <td class="noPortfolios" colspan="3">
                            <h2>No Portfolios</h2>
                            <p>You haven't added any portfolios yet. 
                            <br>Add a portfolio to get started.</p>

                            <Button class="addPortfolioBtn" link @click="addPortfolio">+ Add Portfolio</Button>
                        </td>
                    </tr>
                    <tr v-if="isLoading">
                        <td colspan="4" class="loading">
                            <Spinner />
                        </td>
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
import ConfirmModal from '../../components/ui/ConfirmModal.vue';

export default {
    components: {
        Header,
        PortfolioCard,
        Icon,
        ConfirmModal
    },
    data() {
        return {
            isLoading: false,
            portfolios: [],
            isDeletePopupOpen: false,
            deletePortfolioId: null,
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
                this.$store.dispatch('files/fetchAllPortfolios').then(() => {
                    this.isLoading = false;
                });
            } 
        },
        loadPortfoliosIntoArray() {
            this.portfolios = [];
            for(let i = 0; i < this.portfoliosFromStore.length; i++) {
                this.portfolios.push(this.portfoliosFromStore[i]);

                // only do this if addedAt hasnt been converted yet
                if(this.portfoliosFromStore[i].addedAt.seconds && this.portfoliosFromStore[i].addedAt.nanoseconds) {
                    const firebaseDateTime = new Date(
                        this.portfoliosFromStore[i].addedAt.seconds * 1000 +
                        this.portfoliosFromStore[i].addedAt.nanoseconds / 1000000,
                    );
                    const firebaseDate = firebaseDateTime.toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    });
                    const firebaseTime = firebaseDateTime.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: false,
                    });
                    this.portfolios[i].addedAt = firebaseDate + ' ' + firebaseTime;
                }
            }
            this.sortByDateAdded();
        },
        sortByDateAdded() {
            this.portfolios.sort((a, b) => {
                return new Date(b.addedAt) - new Date(a.addedAt);
            });
        },
        deletePortfolio() {
            const id = this.deletePortfolioId;
            this.$store.dispatch('files/deletePortfolio', id);
            this.portfolios = this.portfolios.filter(portfolio => portfolio.id !== id);
            this.toggleDeletePopup();
        },
        toggleDeletePopup(id) {
            this.isDeletePopupOpen = !this.isDeletePopupOpen;
            this.deletePortfolioId = id;
        }
    },
    created() {
        this.isLoading = true;
        this.loadData();
      
    }
}
</script>

<style scoped>
.loading{
    padding: 2rem;
}

.heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.heading h1 {
    margin-left: 0.8rem;
}

.noPortfolios {
    padding: 2rem;
    padding-top: 1rem;
    padding-right: 20%;
}

.noPortfolios h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: var(--clr-grey);
}

.noPortfolios p {
    font-size: 1rem;
    margin-bottom: 1.8rem;
    color: var(--clr-grey);
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
    box-shadow: var(--box-shadow-big);
}

.addPortfolioBtn {
    color: var(--clr-blue) !important;
    padding: 0.4rem 1.2rem;
    font-size: 1.1rem;
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
    font-weight: 500;
    color: var(--clr-black)
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

/* delete popup */
.deletePopup h1 {
    margin-bottom: 1rem;
    color: var(--clr-red);
}

.deletePopup p {
    margin-bottom: 1.4rem;
    font-weight: 400;
}

.deletePopup__btns {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.deletePopup__btn {
    height: 3rem;
    border-radius: var(--btn-radius);
    border: none;
    background-color: var(--clr-blue);
    color: var(--white-color);
    font-size: 1.1rem;
    cursor: pointer;
    transition: 0.2s all;
    width: 48%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.deletePopup__btn:hover {
    box-shadow: var(--box-shadow);
}

.deleteBtn {
    background-color: var(--clr-red);
    color: var(--clr-white);    
}

.deleteBtnIcon {
    margin-right: 0.4rem;
}

.noBtn {
    background-color: var(--clr-white);
    color: var(--clr-grey);
    border: 1px solid var(--clr-grey);
    cursor: pointer;
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
@media screen and (max-width: 768px) {
    .headingIcon {
        height: 25px;
    }

    .heading h1 {
        margin-left: 0.5rem;
    }
}

@media screen and (max-width: 650px) {
    .fileSize {
        display: none;
    }
}

@media screen and (max-width: 600px) {
    .myPortfolios__header {
        display: inline-block;
    }

    .heading {
        margin-bottom: 1.5rem;
    }

    .deletePopup__btns {
        flex-direction: column;
    }

    .deletePopup__btn {
        width: 100%;
    }

    .deleteBtn {
        margin-bottom: 1rem;
        order: 1;
    }

    .noBtn {
        order: 2;
    }
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
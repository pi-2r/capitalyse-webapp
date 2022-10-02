<template>
  <transition name="slide-fade" mode="out-in">
    <ConfirmModal
      class="deletePopup"
      @click-outside-popup="isDeletePopupOpen = false"
      v-if="isDeletePopupOpen"
    >
      <h1>Are you sure?</h1>
      <p>
        Are you sure you want to permanently delete this portfolio? This action
        can not be reversed.
      </p>
      <section class="deletePopup__btns">
        <Button class="deletePopup__btn deleteBtn" @click="deletePortfolio">
          <Icon
            icon="bxs:trash"
            color="var(--clr-white)"
            height="22"
            class="deleteBtnIcon"
          />
          Delete
        </Button>
        <Button class="deletePopup__btn noBtn" @click="toggleDeletePopup"
          >Cancel</Button
        >
      </section>
    </ConfirmModal>
  </transition>

  <Header></Header>

  <section class="container">
    <section class="myPortfolios__header">
      <section class="heading">
        <Icon
          icon="entypo:list"
          class="headingIcon"
          height="35"
          color="var(--clr-black)"
        />
        <h1>Portfolios</h1>
      </section>
      <Button class="addPortfolioBtn" @click="addPortfolio">
        <Icon
          icon="fluent:add-square-multiple-16-filled"
          color="var(--clr-white)"
          height="20"
        />
        Add Portfolio
      </Button>
    </section>

      <Card class="tablecontainer">
        <table class="portfoliosTable">
          <thead>
            <tr>
              <th>Portfolio</th>
              <th class="alignRight">Date added</th>
              <th class="fileSize alignRight">Portfolio size</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <TransitionGroup name="portfolioList">
            <tr :key="portfolio.id" v-for="portfolio in portfolios">
              <PortfolioListItem
                @toggleDeletePopup="toggleDeletePopup"
                :portfolio="portfolio"
              />
            </tr>
            </TransitionGroup>
            <!-- if no portfolios -->
            <transition name="portfolioList">
            <tr v-if="portfolios.length < 1 && !isLoading">
              <td class="noPortfolios" colspan="3">
                <h2>No Portfolios</h2>
                <p>
                  You haven't added any portfolios yet. <br />Add a portfolio to
                  get started.
                </p>

                <Button class="addPortfolioBtn" @click="addPortfolio">
                  <Icon
                    icon="fluent:add-square-multiple-16-filled"
                    height="18"
                  />
                  Add Portfolio</Button
                >
              </td>
            </tr>
            </transition>
            <tr v-if="isLoading">
              <td colspan="4" class="loading">
                <Spinner />
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </section>
</template>

<script>
import { Icon } from "@iconify/vue";

import Header from "@/components/layout/Header.vue";
import ConfirmModal from "@/components/ui/ConfirmModal.vue";
import Card from "@/components/ui/Card.vue";

import PortfolioListItem from "@/pages/portfolios/components/PortfolioListItem.vue";

export default {
  components: {
    Header,
    PortfolioListItem,
    Icon,
    Card,
    ConfirmModal,
  },
  data() {
    return {
      isLoading: false,
      portfolios: [],
      isDeletePopupOpen: false,
      deletePortfolioId: null,
    };
  },
  computed: {
    areTherePortfolios() {
      return this.$store.getters["files/hasPortfolios"];
    },
    amountOfPortfolios() {
      return this.$store.getters["files/amountOfPortfolios"];
    },
    portfoliosFromStore() {
      return this.$store.getters["files/getPortfolios"];
    },
  },
  watch: {
    amountOfPortfolios() {
      this.loadData();
    },
  },
  methods: {
    addPortfolio() {
      this.$router.push("/portfolios/new");
    },
    loadData() {
      if (this.areTherePortfolios) {
        this.loadPortfoliosIntoArray();
        this.isLoading = false;
      } else {
        this.$store.dispatch("files/fetchAllPortfolios").then(() => {
          this.isLoading = false;
        });
      }
    },
    loadPortfoliosIntoArray() {
      this.portfolios = [];
      for (let i = 0; i < this.portfoliosFromStore.length; i++) {
        this.portfolios.push(this.portfoliosFromStore[i]);

        // only do this if addedAt hasnt been converted yet
       
        if (
          this.portfoliosFromStore[i].addedAt._seconds &&
          this.portfoliosFromStore[i].addedAt._nanoseconds
        ) {
          const firebaseDateTime = new Date(
            this.portfoliosFromStore[i].addedAt._seconds * 1000 +
              this.portfoliosFromStore[i].addedAt._nanoseconds / 1000000
          );
          const firebaseDate = firebaseDateTime.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          const firebaseTime = firebaseDateTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
          this.portfolios[i].addedAt = firebaseDate + " " + firebaseTime;
        }
      }
      this.sortByDateAdded();
    },
    sortByDateAdded() {
      this.portfolios.sort((a, b) => {
        return new Date(b.addedAt) - new Date(a.addedAt);
      });
    },
    // send request to store to delete portfolio
    deletePortfolio() {
      const id = this.deletePortfolioId;
      this.$store.dispatch("files/deletePortfolio", id);
      this.portfolios = this.portfolios.filter(
        (portfolio) => portfolio.id !== id
      );
      this.toggleDeletePopup();
    },
    // toggle popup to delete portfolio
    toggleDeletePopup(id) {
      this.isDeletePopupOpen = !this.isDeletePopupOpen;
      this.deletePortfolioId = id;
    },
  },
  created() {
    this.isLoading = true;
    this.loadData();
  },
};
</script>

<style scoped>
/* list anim */
.portfolioList-enter-active,
.portfolioList-leave-active {
  transition: all 0.5s ease;
}
.portfolioList-enter-from,
.portfolioList-leave-to {
  opacity: 0;
  transform: translateX(-5px);
}

.alignRight {
  text-align: right;
  width: 12rem;
}

.loading {
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
  max-width: 92%;
}

.myPortfolios__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tablecontainer {
  margin-top: 1.5rem;
  min-width: 20rem;
}

.tableBorder {
  border: 1px solid var(--clr-light-grey);
  border-radius: var(--card-border-radius);
  min-width: 20rem;
}

.portfoliosTable {
  width: 100%;
  border-radius: var(--card-border-radius);
  border-collapse: collapse;
}

.addPortfolioBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: var(--btn-small-padding);
  font-size: 1rem;
}

table {
  width: 100%;
}

thead {
  color: var(--clr-black);
  border-bottom: 1px solid var(--clr-very-light-grey);
}

th {
  padding: 1.1rem 1.5rem;
  text-align: left;
  font-weight: 500;
  font-size: 1rem;
  color: var(--clr-dark-grey);
}

th:last-of-type {
  padding: 0;
  margin: 0;
  width: 1px;
}

tr {
  border-bottom: 1px solid var(--clr-very-light-grey);
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
  transition: 0.15s all;
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
    max-width: 90%;
  }
}



@media screen and (min-width: 1150px) {

  .container {
    max-width: 1100px;
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

  .fileSize {
    display: none;
  }
}

@media screen and (max-width: 350px) {
  table {
    overflow-x: scroll;
  }
}
</style>
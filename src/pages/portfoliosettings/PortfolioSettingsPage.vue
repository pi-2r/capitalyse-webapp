<template>
  <!-- confirm modal -->
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
            color="var(--clr-red)"
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

  <Header />
  <transition name="rtlIn" mode="out-in" appear>
  <article class="container" v-if="!isLoading">
    <section class="titleAndBackButtonContainer">
      <BackButton />
      <h1>Portfolio settings</h1>
    </section>
    <section class="settingsCard__container">
      <Card class="settingsCard">
        <h2>Portfolio</h2>
        <section class="settingsSection">
          <!-- theme toggle -->
          <label for="portfolioName">Portfolio name</label>
          <section
            class="settingsSection__textInput"
            v-if="!isNewPortfolioNameLoading"
          >
            <input
              type="email"
              class="textInput"
              v-model.trim="newPortfolioName"
              @keyup.enter="submitNewPortfolioName"
              @focus="resetInputStyling"
              @keydown="resetInputStyling"
              :placeholder="portfolioInfo.portfolioName"
              :class="portfolioNameIsValidClass"
            />
            <Button class="saveBtn" @click="submitNewPortfolioName">
              <Icon
                icon="fluent:save-20-filled"
                class="deleteIcon"
                color="var(--clr-very-light-blue)"
                height="22"
              />
              <span>Save</span>
            </Button>
          </section>
          <span
            v-if="portfolioNameIsValidClass === 'nameInvalid'"
            class="errorMsg"
            >Invalid portfolio name</span
          >
          <Spinner v-if="isNewPortfolioNameLoading" />
        </section>
      </Card>
      <Card class="settingsCard">
        <h2>Sharing</h2>
        <section class="settingsSection">
          <section class="settingsSectionItem">
            <label for="theme">Public portfolio</label>
            <section class="publicPortfolioURLAndBtn">
              <transition mode="out-in" name="slide-fade">
                <section
                  v-if="portfolioInfo.isPublic"
                  class="copyShareLink"
                  @click="copyPublicURL"
                  :style="[
                    justClickedCopy
                      ? {
                          'border-color': 'var(--clr-green)',
                          'background-color': 'rgba(9, 232, 54, 0.05)',
                          color: 'var(--clr-green',
                        }
                      : null,
                  ]"
                >
                  <Icon icon="akar-icons:link-chain" height="18px" /><span
                    class="copyShareLink__text"
                    >Copy public URL</span
                  >
                </section>
              </transition>
              <ToggleButton
                id="theme"
                name="theme"
                :is-on="portfolioInfo.isPublic"
                @toggle-button-clicked="updatePublicState"
              />
            </section>
          </section>
        </section>
      </Card>
      <Card v-if="isAuth" class="settingsCard">
        <h2>Manage</h2>
        <section class="settingsSection">
          <button class="deleteBtn" @click="toggleDeletePopup">
            <Icon
              icon="bxs:trash"
              class="deleteIcon"
              color="var(--clr-red)"
              height="16"
            />
            Delete portfolio
          </button>
        </section>
      </Card>
    </section>
  </article>
  <LoadingOverlay v-else />
  </transition>
</template>

<script>
import { Icon } from "@iconify/vue";

import Card from "@/components/ui/Card.vue";
import ToggleButton from "@/components/ui/ToggleButton.vue";
import Header from "@/components/layout/Header.vue";
import BackButton from "@/components/ui/BackButton.vue";
import ConfirmModal from "@/components/ui/ConfirmModal.vue";

import isPortfolioNameValid from "@/mixins/helpers/isPortfolioNameValid.js";

export default {
  mixins: [isPortfolioNameValid],
  components: {
    Header,
    BackButton,
    Card,
    Icon,
    ToggleButton,
    ConfirmModal,
  },
  data() {
    return {
      portfolioInfo: {
        portfolioName: "",
        isPublic: false,
      },
      isLoading: false,
      isNewPortfolioNameLoading: false,
      newPortfolioName: "",
      justClickedCopy: false,
      portfolioNameIsValidClass: "",
      isDeletePopupOpen: false,
    };
  },
  computed: {
    portfolioId() {
      return this.$route.params.id;
    },
    hasPortfolios() {
      return this.$store.getters["files/hasPortfolios"] > 0;
    },
    isAuth() {
      return this.$store.getters["isAuthenticated"];
    },
    copyPublicURLText() {
      if (this.justClickedCopy) {
        return "Copied!";
      } else {
        return "Copy public URL";
      }
    },
  },
  watch: {
    hasPortfolios() {
      this.getPortfolioInfo();
    },
    $route() {
      this.getPortfolioInfo();
    },
  },
  methods: {
    submitNewPortfolioName() {
      this.isNewPortfolioNameLoading = true;
      const isValid = this.isPortfolioNameValid(this.newPortfolioName);

      if (isValid) {
        this.portfolioNameIsValidClass = "";
        this.$store.dispatch("files/setPortfolioName", {
          portfolioId: this.$route.params.id,
          portfolioName: this.newPortfolioName,
        }).then(() => {
          this.portfolioInfo.portfolioName = this.newPortfolioName;
          this.newPortfolioName = null;
          this.isNewPortfolioNameLoading = false;
        });
      
      } else {
        this.portfolioNameIsValidClass = "nameInvalid";
        this.isNewPortfolioNameLoading = false;
      }
    },
    getPortfolioInfo() {
      const portfolios = this.$store.getters["files/getPortfolios"];
      if (portfolios.length > 0) {
        for (let i = 0; i < portfolios.length; i++) {
          if (portfolios[i].id === this.$route.params.id) {
            this.portfolioInfo = portfolios[i];
          }
        }
      }
    },
    updatePublicState() {
      this.$store.dispatch("files/setPortfolioPublicity", {
        portfolioId: this.$route.params.id,
        isPublic: !this.portfolioInfo.isPublic,
      });
      this.portfolioInfo.isPublic = !this.portfolioInfo.isPublic;
    },
    async copyPublicURL() {
      try {
        const uid = localStorage.getItem("userId");
        await navigator.clipboard.writeText(
          `https://my.capitalyse.app/shared/${uid}/${this.$route.params.id}`
        );
        this.justClickedCopy = true;
        setTimeout(() => {
          this.justClickedCopy = false;
        }, 10000);
      } catch (e) {
        console.log(e);
      }
    },
    loadData() {
      if (this.hasPortfolios === true) {
        this.getPortfolioInfo();
        this.isLoading = false;
      } else {
        this.$store
          .dispatch("files/fetchPortfolioAnalytics", {
            type: "home",
            portfolioId: this.$route.params.id,
          })
          .then(() => {
            this.isLoading = false;
          });
      }
    },
    resetInputStyling() {
      // reset de error of success styling van de inputs
      this.portfolioNameIsValidClass = "";
    },
    // send request to store to delete portfolio
    deletePortfolio() {
      const id = this.portfolioId;
      this.$store.dispatch("files/deletePortfolio", id);
      this.toggleDeletePopup();
      this.$router.replace("/");
    },
    // toggle popup to delete portfolio
    toggleDeletePopup() {
      this.isDeletePopupOpen = !this.isDeletePopupOpen;
    },
  },
  mounted() {
    this.isLoading = true;
    this.loadData();
  },
};
</script>

<style scoped>
/* delete popup */
.deleteBtn {
  background-color: var(--clr-red);
  color: var(--clr-white);
}

.deleteBtnIcon {
  margin-right: 0.4rem;
}

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

.errorMsg {
  color: var(--clr-red);
}

.publicPortfolioURLAndBtn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

input[type="checkbox"] {
  appearance: auto;
  cursor: pointer;
}

.copyShareLink {
  white-space: nowrap;
  color: var(--clr-blue);
  position: absolute;
  right: 3.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  padding: 0.45rem;
  border-radius: var(--btn-radius);
  transition: 0.2s all;
  border: 1px solid transparent;
}

.nameInvalid {
  color: var(--clr-red) !important;
  border: 1px solid var(--clr-red) !important;
  border-right: 1px solid transparent !important;
  background-color: rgba(255, 0, 0, 0.015) !important;
}

.copyShareLink:hover {
  cursor: pointer;
  color: var(--clr-blue);
  border: 1px solid rgba(9, 124, 232, 0.5);
  background-color: rgba(9, 124, 232, 0.05);
}

.settingsSection__textInput {
  margin-top: 0.5rem;
}

.settingsSectionItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.saveBtn {
  display: flex;
  align-items: center;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  color: var(--clr-very-light-blue);
  justify-content: center;
  gap: 0.25rem;
  padding: 0.78rem 0.9rem;
}

.settingsSection__textInput {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.textInput {
  margin-top: 0;
  width: 100%;
  padding: 0.9rem;
  background-color: var(--clr-white);
  border: 1px solid var(--clr-medium-light-grey-2);
  border-radius: var(--btn-radius);
  font-size: 16px;
  font-weight: 500;
  color: var(--clr-black);
  box-shadow: var(--box-shadow-small);
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}

.deleteBtn {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: var(--btn-radius);
  transition: 0.15s all;
  background-color: rgba(255, 0, 0, 0.075);
  border: 1px solid var(--clr-red);
  box-shadow: var(--btn-shadow);
  color: var(--clr-red);
  font-size: 1rem;
  font-weight: 500;
}

.deleteBtn:hover {
  cursor: pointer;
  box-shadow: 1px 1px 8px rgba(251, 122, 122, 0.246);
}

.deleteIcon {
  display: inline-block;
  color: var(--clr-red);
  transition: 0.15s all;
}

.deleteIcon:hover {
  cursor: pointer;
}

.titleAndBackButtonContainer {
  margin-bottom: 2rem;
}

label {
  color: var(--clr-dark-grey);
}

.container {
  margin: 0 auto;
  margin-bottom: 4rem;
  min-height: 85vh;
  margin-top: 3rem;
  width: 30rem;
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

h2 {
  margin-bottom: 1rem;
}

.settingsCard {
  padding: 1.25rem;
  margin-bottom: 1rem;
}

/* anims */
.rtlIn-enter-active,
.rtlIn-leave-active {
  transform: translate(0px);
  transition: 0.2s ease;
}
.rtlIn-leave-to,
.rtlIn-enter-from {
  transform: translate(20px);
  opacity: 0.2;
}

.settingsSection {
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

@media screen and (min-width: 1150px) {
  .container {
    max-width: 1100px;
  }
}

/* max */
@media screen and (max-width: 450px) {
  .copyShareLink__text {
    display: none;
  }
}

@media screen and (max-width: 600px) {
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
</style>
<template>
  <Header />
  <section class="container">
    <section class="titleAndBackButtonContainer">
      <BackButton />
      <h1 class="uploadFilesTitle">Add Portfolio</h1>
    </section>

    <section class="formCardContainer">
      <Card class="wrapper">
        <transition name="rtlIn">
          <article v-if="exportFilesStepDone" class="uploadFilesStep">
            <section class="uploadFilesCardHeader">
              <!-- <BackButton to="other" @click="prevStep()"/> -->
              <h2 class="addPortfolioCardTitle">
                (2/2) Import into Capitalyse
              </h2>
            </section>

            <!-- <p class="addPortfolioCardDesc">
              Next, upload the downloaded files into Capitalyse.
            </p> -->

            <form @submit.prevent="submitForm" class="uploadFilesForm">
              <section class="uploadFilesGroup">
                <label class="uploadFilesLabel">
                  <input
                    @change="uploadFile"
                    type="file"
                    accept=".csv"
                    multiple
                  />
                  <Icon
                    v-if="filesAreValid"
                    icon="eva:checkmark-outline"
                    color="var(--clr-blue)"
                    height="22"
                  />
                  <Icon
                    v-else
                    icon="ph:upload-simple-duotone"
                    color="var(--clr-blue)"
                    height="22"
                  />
                  <span class="uploadFilesLabelText">{{ inputText }}</span>
                </label>
              </section>

              <section class="btnAndFileNames">
                <section class="fileNames">
                  <section class="fileNamesAndBtn u-noselect">
                    <p
                      class="fileName"
                      :class="
                        portfolioFileIsValid ? 'fileValid' : 'fileInvalid'
                      "
                    >
                      <span v-if="portfolioFileIsValid">
                        <CheckMarkIcon class="fileIcon" />
                      </span>
                      <span v-else>
                        <CloseIcon class="fileIcon" />
                      </span>

                      <span>{{ portfolioFileName }}</span>

                      <!-- <a v-if="!portfolioFileIsValid" href="https://trader.degiro.nl/staging-trader/#/portfolio" target="_blank" class="goToFile">
                      <Icon icon="akar-icons:link-out" height="13" />
                      Get
                    </a> -->
                    </p>
                    <p
                      class="fileName"
                      :class="
                        transactionsFileIsValid ? 'fileValid' : 'fileInvalid'
                      "
                    >
                      <span v-if="transactionsFileIsValid">
                        <CheckMarkIcon class="fileIcon" />
                      </span>
                      <span v-else>
                        <CloseIcon class="fileIcon" />
                      </span>

                      <span>{{ transactionsFileName }}</span>

                      <!-- <a v-if="!transactionsFileIsValid" :href="transactionsLink" target="_blank" class="goToFile">
                      <Icon icon="akar-icons:link-out" height="13" />
                      Get
                    </a> -->
                    </p>
                    <p
                      class="fileName"
                      :class="accountFileIsValid ? 'fileValid' : 'fileInvalid'"
                    >
                      <span v-if="accountFileIsValid">
                        <CheckMarkIcon class="fileIcon" />
                      </span>
                      <span v-else>
                        <CloseIcon class="fileIcon" />
                      </span>

                      <span>{{ accountFileName }}</span>

                      <!-- <a v-if="!accountFileIsValid" :href="accountLink" target="_blank" class="goToFile">
                      <Icon icon="akar-icons:link-out" height="13" />
                      Get
                    </a> -->
                    </p>
                  </section>
                </section>
                <section class="resetUploads">
                  <button
                    class="resetUploadedBtn"
                    type="button"
                    @click="resetFiles"
                  >
                    <Icon
                      icon="charm:rotate-anti-clockwise"
                      color="var(--clr-grey)"
                      height="14"
                      :class="{ rotateResetIconClass: animatedResetIcon }"
                      @animationend="animatedResetIcon = false"
                    />
                    Reset uploads
                  </button>
                  <transition mode="out-in" name="slide-fade">
                    <section v-if="animatedResetIcon">
                      <p class="resetUploadConfirmText">
                        <Icon
                          icon="eva:checkmark-outline"
                          color="var(--clr-green)"
                          height="16"
                        />
                        Uploads reset!
                      </p>
                    </section>
                  </transition>
                </section>
              </section>

              <section class="portfolioName">
                <section class="portfolioName__heading">
                  <label for="portfolioName"
                    >Portfolio name
                    <span class="portfolioName__optional"
                      >(optional)</span
                    ></label
                  >

                  <ToggleButton
                    :isOn="isPortfolioNameInputVisible"
                    id="portfolioNameToggleButton"
                    name="portfolioNameToggleButton"
                    @toggleButtonClicked="togglePortfolioNameInput"
                  />
                </section>
                <input
                  type="text"
                  id="portfolioName"
                  @blur="checkPortfolioNameValidity"
                  @focus="resetInputStyling"
                  v-model.trim="portfolioName"
                  :class="portfolioNameIsValidClass"
                  autocomplete="off"
                  v-if="isPortfolioNameInputVisible"
                />
              </section>

              <section class="fileButtons">
                <Button type="submit">
                  <section v-if="isLoading">
                    <Spinner class="spinner" :btnSpinner="true" />
                  </section>
                  <section v-else>Add Portfolio</section>
                </Button>
                <transition mode="out-in" name="slide-fade">
                  <section v-if="currentErrorMsgs.length > 0" class="errorMsgs">
                    <p
                      v-for="errorMsg in currentErrorMsgs"
                      :key="errorMsg"
                      class="errorMsg"
                    >
                      <Icon
                        icon="bxs:error-circle"
                        color="var(--clr-red)"
                        height="18"
                      />
                      {{ errorMsg }}
                    </p>
                  </section>
                </transition>
              </section>
            </form>
          </article>
        </transition>
      
          <ExportFilesStep
            v-if="!exportFilesStepDone"
            @next="nextStep()"
            class="exportFilesStep"
          />
      
      </Card>
    </section>

    <!-- <UploadFilesHelp /> -->
  </section>
</template>

<script>
import CloseIcon from "vue-material-design-icons/Close.vue";
import { Icon } from "@iconify/vue";
import CheckMarkIcon from "vue-material-design-icons/CheckDecagram.vue";

import csvToArrayMixin from "@/mixins/helpers/csvToArray.js";
import includesFromArrayMixin from "@/mixins/helpers/includesFromArray.js";

// import Breadcrumbs from "@/components/ui/Breadcrumbs.vue";
import Header from "@/components/layout/Header.vue";
import Card from "@/components/ui/Card.vue";
// import UploadFilesHelp from "./components/UploadFilesHelp.vue";
import BackButton from "@/components/ui/BackButton.vue";
import ToggleButton from "@/components/ui/ToggleButton.vue";
import ExportFilesStep from "./components/ExportFilesStep.vue";

export default {
  mixins: [csvToArrayMixin, includesFromArrayMixin],
  components: {
    CloseIcon,
    CheckMarkIcon,
    Header,
    // Breadcrumbs,
    Card,
    ToggleButton,
    Icon,
    // UploadFilesHelp,
    BackButton,
    ExportFilesStep,
  },
  data() {
    return {
      exportFilesStepDone: false,
      transactionsFile: null,
      accountFile: null,
      portfolioFile: null,
      transactionsFileName: "Transactions File",
      accountFileName: "Account File",
      portfolioFileName: "Portfolio File",
      portfolioName: "",
      accountFileIsEmpty: null,
      transactionsFileIsEmpty: null,
      portfolioFileIsEmpty: null,
      portfolioNameIsValidClass: "",
      isLoading: false,
      isPortfolioNameInputVisible: false,
      animatedResetIcon: false,
      errorMsgs: {
        missingFiles: "Please import all files",
        invalidPortfolioName: "Invalid portfolio name",
        transactionsFileInvalid: "Missing Transactions.csv file",
        accountFileInvalid: "Missing Account.csv file",
        portfolioFileInvalid: "Missing Portfolio.csv file",
      },
      currentErrorMsgs: [],
    };
  },
  watch: {
    uploadingState() {
      // als de uploadingstate veranderd, update die in de store
      // als de uploadingstate succesvol is, ga dan naar de portfolio page
      if (this.uploadingState === "success") {
        this.$store.dispatch("files/setUploadingState", "none");
        this.isLoading = false;
        this.$router.push({ path: "/portfolios" });
      } else if (this.uploadingState === "error") {
        this.$store.dispatch("files/setUploadingState", "none");
        this.isLoading = false;
      }
    },
  },
  computed: {
    inputText() {
      // retourneert de text voor de file input
      // geeft de hoeveelheid geuploadde files mee
      let tot = 0;
      this.transactionsFile ? tot++ : null;
      this.accountFile ? tot++ : null;
      this.portfolioFile ? tot++ : null;
      return "Import Files (" + tot + "/3)";
    },
    filesAreValid() {
      // retourneert true als alle bestanden in de data() staan
      // als de bestanden in de data staan betekent dat dat ze geaccepteerd zijn
      return this.transactionsFile && this.accountFile && this.portfolioFile;
    },
    formIsValid() {
      // als portfolio valide is en de bestanden geupload zijn, retourneer true
      if (
        this.portfolioNameIsValid &&
        this.transactionsFileIsValid &&
        this.accountFileIsValid &&
        this.portfolioFileIsValid
      ) {
        return true;
      } else {
        return false;
      }
    },
    portfolioNameIsValid() {
      const forbiddenChars = [
        "/",
        "\\",
        "<",
        ">",
        ":",
        '"',
        "|",
        "?",
        "*",
        "&",
        "$",
        "#",
        "%",
        "@",
        "^",
        "+",
        "=",
        "~",
        "`",
        "{",
        "}",
        ";",
        ".",
        ",",
      ];
      // is valide wanneer er geen illegale karakters in zitten, de naam
      // niet leeg is en de naam ook niet langer is dan 30 karakters
      const valid =
        !this.includesFromArray(forbiddenChars, this.portfolioName) &&
        this.portfolioName.length > 0 &&
        this.portfolioName.length < 30;

      return valid;
    },
    uploadingState() {
      return this.$store.getters["files/getUploadingState"];
    },
    amountOfPortfolios() {
      return this.$store.getters["files/amountOfPortfolios"];
    },
    accountFileIsValid() {
      return !!this.accountFile;
    },
    transactionsFileIsValid() {
      return !!this.transactionsFile;
    },
    portfolioFileIsValid() {
      return !!this.portfolioFile;
    },
    accountLink() {
      // maakt link met de correcte einddatum
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      const date = yyyy + "-" + mm + "-" + dd;

      return `https://trader.degiro.nl/staging-trader/#/account-overview?fromDate=2000-01-01&toDate=${date}&aggregateCashFunds=true&currency=Alle`;
    },
    transactionsLink() {
      // maakt link met de correcte einddatum
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      const date = yyyy + "-" + mm + "-" + dd;

      return `https://trader.degiro.nl/staging-trader/#/transactions?fromDate=2000-01-01&toDate=${date}&aggregateCashFunds=true&currency=Alle`;
    },
  },
  methods: {
    nextStep() {
      this.exportFilesStepDone = true;
    },
    prevStep() {
      this.exportFilesStepDone = false;
    },
    togglePortfolioNameInput() {
      // toggle portfolio naam input veld zichtbaarheid
      this.isPortfolioNameInputVisible = !this.isPortfolioNameInputVisible;
      this.setPortfolioName();
    },
    setPortfolioName() {
      // zet de portfolio naam op default als de input niet zichbaar is
      // zet de portfolio naam op leeg als de input zichbaar is
      this.isPortfolioNameInputVisible
        ? (this.portfolioName = "")
        : (this.portfolioName = "My Portfolio");
    },
    toggleCollapsible(id) {
      // toggle de collapsible uitleg blokken dmv id van de html
      const collapsible = document.querySelectorAll(".collapsible")[id];
      const content = document.querySelectorAll(".content")[id];
      collapsible.classList.toggle("active");
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        content.style.padding = "0 1rem";
        content.style.borderBottom = "none";
      } else {
        content.style.maxHeight = "calc(" + content.scrollHeight + "px + 2rem)";
        content.style.padding = "1rem";
        content.style.borderBottom = "1px solid var(--clr-medium-light-grey)";
      }
    },
    resetInputStyling() {
      // reset de error of success styling van de inputs
      this.portfolioNameIsValidClass = "";
    },
    checkPortfolioNameValidity() {
      // check of de portfolio naam valide is
      // als de portfolio naam valide is, verander de class van de input
      if (this.portfolioNameIsValid) {
        this.portfolioNameIsValidClass = "nameValid";
      } else {
        this.portfolioNameIsValidClass = "nameInvalid";
      }
    },
    getPortfolios() {
      return this.$store.dispatch("files/fetchAllPortfolios");
    },
    setErrorMsgs() {
      this.currentErrorMsgs = [];
      if (this.portfolioNameIsValidClass === "nameInvalid") {
        this.currentErrorMsgs.push(this.errorMsgs.invalidPortfolioName);
      }
      if (this.transactionsFileIsValid === false) {
        this.currentErrorMsgs.push(this.errorMsgs.transactionsFileInvalid);
      }
      if (this.accountFileIsValid === false) {
        this.currentErrorMsgs.push(this.errorMsgs.accountFileInvalid);
      }
      if (this.portfolioFileIsValid === false) {
        this.currentErrorMsgs.push(this.errorMsgs.portfolioFileInvalid);
      }
    },
    submitForm() {
      // callt get portfolios
      // om een of andere rede moet getPortfolios aangeroepen worden
      // anders als je naar portfolios gaat, wordt de nieuwe niet opgehaald
      this.getPortfolios();
      this.checkPortfolioNameValidity();
      this.setErrorMsgs();
      if (this.formIsValid) {
        this.isLoading = true;
        this.$store.dispatch("files/createNewPortfolio", {
          portfolioName: this.portfolioName,
          transactionsFile: this.transactionsFile,
          accountFile: this.accountFile,
          portfolioFile: this.portfolioFile,
          addedAt: new Date(),
        });
      } else {
        this.isLoading = false;
      }
    },
    // not used
    validateFileContents(e) {
      let isValid;
      let reader = new FileReader();

      reader.onload = (e) => {
        let text = e.target.result;
        let fileAsArray = this.csvToArray(text);

        const transactionsValid =
          fileAsArray[0].length === 19 && fileAsArray.length !== 0;
        const accountValid =
          fileAsArray[0].length === 12 && fileAsArray.length !== 0;

        isValid = !transactionsValid && !accountValid;
      };
      reader.readAsText(e);

      return isValid;
    },
    uploadFile(event) {
      this.checkFileValidity(event.target.files);
    },
    checkFileValidity(file) {
      // maximale bestandsgrootte
      const maxFileSizeKB = 10000;

      // checkt elk bestand in de event target files
      // checkt of de bestandsgrootte niet nul is
      // checkt of de bestandsgrootte niet groter is dan de maximale bestandsgrootte
      // checkt of de bestandsnaam .csv is
      for (let i = 0; i < file.length; i++) {
        const valid =
          file[i].size > 0 &&
          file[i].size < maxFileSizeKB * 1024 &&
          file[i].type.includes("csv");
        // this.validateFileContents(file[i]);

        // als valide is voeg de file toe aan de juiste data() waarde
        // als niet valide, geef een error melding op de plek van de file soort
        valid ? this.addFile(file[i]) : this.incorrectFile(file[i]);
      }
    },
    addFile(file) {
      // voegt een file toe aan de juiste data() waarde
      if (file.name.includes("ransactions")) {
        this.transactionsFile = file;
        this.transactionsFileName = file.name;
      } else if (file.name.includes("ccount")) {
        this.accountFile = file;
        this.accountFileName = file.name;
      } else if (file.name.includes("ortfolio")) {
        this.portfolioFile = file;
        this.portfolioFileName = file.name;
      }
    },
    incorrectFile(file) {
      // geef een error melding op de plek van de file soort
      if (file.name.includes("ransactions")) {
        this.transactionsFile = null;
        this.transactionsFileName = file.name;
      } else if (file.name.includes("ccount")) {
        this.accountFile = null;
        this.accountFileName = file.name;
      } else if (file.name.includes("ortfolio")) {
        this.portfolioFile = null;
        this.portfolioFileName = file.name;
      }
    },
    resetFiles() {
      // reset alles als er op reset files geklikt wordt
      this.animatedResetIcon = true;
      setTimeout(() => {
        this.animatedResetIcon = false;
      }, 500);

      this.transactionsFile = null;
      this.accountFile = null;
      this.portfolioFile = null;
      this.transactionsFileName = "Transactions File";
      this.accountFileName = "Account File";
      this.portfolioFileName = "Portfolio File";
    },
    getDate() {
      // krijg huidige datum DD-MM-YYYY
      // voeg bij dag of maand een 0 toe voor consitentie
      // als de dag of maand minder dan 2 digits is
      let date = new Date();
      let dd = date.getDate();
      let mm = date.getMonth() + 1;
      let yyyy = date.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      date = dd + "-" + mm + "-" + yyyy;
      return date;
    },
  },
  created() {
    // bij aanmaken van de component, zet de uploading state op none
    // en zet de portfolio name op default
    this.$store.dispatch("files/setUploadingState", "none");
    this.setPortfolioName();
  },
};
</script>

<style scoped>

.rtlIn-enter-active,
.rtlIn-leave-active {
  transform: translate(0px);
  transition: 0.4s ease;
}
.rtlIn-leave-to,
.rtlIn-enter-from {
  transform: translate(20px);
  opacity: 0.2;
}

.uploadFilesCardHeader {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}
.addPortfolioCardTitle {
  font-size: 1.4rem;
}
.addPortfolioCardDesc {
  margin-bottom: 1rem;
  color: var(--clr-grey);
  font-size: 0.9rem;
}
.goToFile {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin-left: 0.5rem;
  color: var(--clr-blue);
  font-size: 0.8rem;
  text-decoration: none;
}
.goToFile:hover {
  text-decoration: underline;
}

.errorMsgs {
  margin-top: 1rem;
}

.errorMsg {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--clr-red);
  font-size: 0.9rem;
}

.errorMsgHelp {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--clr-grey);
}

.titleAndBackButtonContainer {
  margin-bottom: 2rem;
}

.collapsible {
  background-color: var(--clr-very-light-blue);
  border-radius: var(--btn-radius);
  color: var(--clr-black);
  cursor: pointer;
  padding: 1rem;
  width: 100%;
  border: 1px solid var(--clr-light-grey);
  text-align: left;
  outline: none;
  font-size: 1rem;
}

.active {
  border-radius: 0.6rem 0.6rem 0rem 0rem;
  border-bottom: none;
}

.listNumber {
  color: var(--clr-blue);
}

.collapsible:after {
  content: "\002B";
  color: var(--clr-dark-grey);
  font-weight: bold;
  float: right;
  margin-left: 5px;
}

.active:after {
  content: "\2212";
}

.content {
  padding: 0 1rem;
  max-height: 0;
  overflow: hidden;
  border-radius: 0rem 0rem 0.6rem 0.6rem;
  transition: all 0.3s ease-out;
  background-color: var(--clr-very-light-blue);
  margin-bottom: 0.75rem;
  border: 1px solid var(--clr-light-grey);
  border-top: none;
  border-bottom: none;
}

.portfolioName__heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  padding-bottom: 0.25rem;
}

.portfolioName {
  border-top: 1px solid var(--clr-light-grey);
  margin-bottom: 1.5rem;
}
.portfolioName__optional {
  color: var(--clr-grey);
  font-size: 0.9rem;
}

.uploadFilesTitle {
  margin: 0;
}

.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.portfolioNameInvalid__label {
  color: var(--clr-red);
}

.nameValid {
  border: 1px solid var(--clr-blue) !important;
}

.nameInvalid {
  color: var(--clr-red);
  border: 1px solid var(--clr-red) !important;
}

h1 {
  margin-bottom: 1rem;
  margin-top: 0.25rem;
}

.container {
  margin: 0 auto;
  margin-top: 3rem;
  margin-bottom: 4rem;
  width: 30rem;
}

.formCardContainer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper {
  padding: 1.25rem;
}

.fileValid {
  color: var(--clr-green);
}

.fileInvalid {
  color: var(--clr-grey);
}

input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

input[type="text"] {
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
}

.filesLabelP {
  font-size: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.4rem;
}

.uploadFilesTooltipWrapper {
  position: relative;
  box-shadow: var(--box-shadow);
}

.uploadFilesTooltip {
  position: absolute;
  top: -2.8rem;
  left: 4.4rem;
  font-size: 0.85rem;
  background-color: var(--clr-white);
  padding: 0.7rem;
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow);
  z-index: 3;
}

.uploadFilesTooltip::after {
  content: "";
  position: absolute;
  top: 1rem;
  left: -0.2rem;
  transform: translateX(-50%);
  border-top: 0.5rem solid transparent;
  border-bottom: 0.5rem solid transparent;
  border-right: 0.5rem solid var(--clr-white);
}

.uploadFilesTooltip p {
  color: var(--clr-grey);
}

.uploadFilesTooltipBtn:hover {
  cursor: pointer;
  background-color: var(--clr-light-grey);
  border-radius: 100px;
}

label {
  font-size: 1rem;
}

input[type="file"] {
  display: none;
}

input[type="submit"]:hover {
  transform: scale(1.01);
  box-shadow: var(--btn-shadow);
}

input[type="submit"] {
  padding: var(--btn-padding);
  font-size: var(--btn-font-size);
  font-weight: var(--btn-font-weight);
  font-family: var(--fnt-main);
  background-color: var(--clr-blue);
  color: var(--clr-white);
  cursor: pointer;
  transition: 0.15s all;
  border: 2px solid var(--clr-blue);
  border-radius: var(--btn-radius);
}

.uploadFilesLabelText {
  font-size: 1.1rem;
}

.fileIcon {
  margin-right: 0.3rem;
  height: 0px;
  width: 20px;
}

.uploadFilesForm {
  display: grid;
  grid-template-columns: 1fr;
}

.uploadFilesGroup {
  display: grid;
  grid-template-columns: 1fr;
}

.uploadFilesGroup__help {
  font-size: 1rem;
  color: var(--clr-grey);
  font-weight: lighter;
  margin-top: 0.5rem;
}

.uploadFilesLabel {
  background-color: #0084ff15;
  border-radius: var(--btn-radius);
  width: 100%;
  padding: 3.5rem 0rem;
  border: 2px dashed var(--clr-blue);
  color: var(--clr-blue);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: 0.15s all;
}

.uploadFilesLabel:hover,
.uploadFilesLabel:hover * {
  cursor: pointer;
  text-decoration: underline;
  user-select: none;
}

.uploadFilesLabel:hover {
  background-color: rgba(0, 132, 255, 0.119);
}

.fileName {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.btnAndFileNames {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-direction: column-reverse;
}

.filesLabel__help {
  color: var(--clr-blue);
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  border-radius: 0.4rem;
}

.resetUploadedBtn {
  height: 1.75rem;
  border: none;
  color: var(--clr-grey);
  font-size: 1rem;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 0.3rem;
  padding: 0.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-radius: 0.4rem;
  box-shadow: none;
  border: 1px solid transparent;
  width: 100%;
}

.resetUploadedBtn:hover {
  border: 1px solid var(--clr-medium-light-grey);
  box-shadow: var(--btn-shadow);
  cursor: pointer;
}

.resetUploadConfirmText {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  text-align: center;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: var(--clr-green);
}
.resetUploadConfirmTextIcon {
  margin-right: 0.3rem;
  height: 0px;
  width: 15px;
}

.secondary {
  text-align: center;
  margin-top: 1rem;
}

.fileButtons {
  display: flex;
  flex-direction: column;
}

.rotateResetIconClass {
  animation: rotateResetIconAnimation 0.5s infinite ease-in-out;
}

@keyframes rotateResetIconAnimation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}

/* anims */
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.25s ease-in;
}
.slide-fade-enter-from {
  transform: translateY(-8px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}

@media screen and (min-width: 768px) {
  .wrapper {
    padding: 1.75rem;
  }
  .btnAndFileNames {
    flex-direction: row;
  } 
  .resetUploadedBtn {
    justify-content: center;
  }
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
</style>
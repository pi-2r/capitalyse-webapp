<template>
  <Header />
  <section class="container">
    <Breadcrumbs
      baseLink="/portfolios"
      baseLinkName="My Portfolios"
      secondLink="/portfolios/new"
      secondLinkName="Add Portfolio"
    />

    <section class="titleAndBackButtonContainer">
      <BackButton />
      <h1 class="uploadFilesTitle">Add Portfolio</h1>
    </section>

    <section class="formCardContainer">
      <section class="formCard">
        <article class="wrapper">
          <form @submit.prevent="submitForm" class="uploadFilesForm">
            <section class="uploadFilesGroup">
              <section class="uploadFilesGroup__heading">
                <p class="filesLabelP">
                  Files
                  <span class="filesLabel__help">
                    <Icon
                      @click="scrollToHelp"
                      class="uploadFilesTooltipBtn"
                      icon="fa6-regular:circle-question"
                      color="var(--clr-grey)"
                      height="20"
                    />
                  </span>
                </p>
              </section>
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
                    :class="portfolioFileIsValid ? 'fileValid' : 'fileInvalid'"
                  >
                    <span v-if="portfolioFileIsValid">
                      <CheckMarkIcon class="fileIcon" />
                    </span>
                    <span v-else>
                      <CloseIcon class="fileIcon" />
                    </span>

                    <span>{{ portfolioFileName }}</span>
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
                  </p>
                </section>
              </section>
              <button class="resetUploadedBtn" @click="resetFiles">
                <Icon
                  icon="ic:outline-restart-alt"
                  color="var(--clr-grey)"
                  height="18"
                />
                Reset uploads
              </button>
            </section>

            <section class="portfolioName">
              <section class="portfolioName__heading">
                <label for="portfolioName"
                  >Portfolio name
                  <span class="portfolioName__optional">(optional)</span></label
                >

                <label class="switch" @click="togglePortfolioNameInput">
                  <input
                    type="checkbox"
                    id="theme"
                    name="theme"
                    value="darkMode"
                    @change="togglePortfolioNameInput"
                    v-model="isPortfolioNameInputVisible"
                  />
                  <span class="slider round"></span>
                </label>
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
              <Button type="submit" class="submitFiles">
                <section v-if="isLoading">
                  <Spinner class="spinner" :btnSpinner="true" />
                </section>
                <section v-else>Add Portfolio</section>
              </Button>
              <!-- <Button class="secondary" link to="/portfolios">Cancel</Button> -->
            </section>
          </form>
        </article>
      </section>
    </section>

    <section class="addPortfolioHelp">
      <h2>Tutorial & Explanation</h2>
      <!-- <button class="collapsible" @click="toggleCollapsible(0)">
        What files do I need?
      </button>
      <section class="content">
        <p>
          To add your Degiro portfolio to Capitalyse you'll need to export three
          CSV files from your Degiro account. This can be done through the app
          or website. The files are:
        </p>
        <p>
          Portfolio.csv
          <br />Transactions.csv <br />Account.csv
        </p>
        <p>Open the next dropdown box to see export instructions.</p>
      </section> -->
      <button class="collapsible" id="exportFromDegiroHelp" @click="toggleCollapsible(0)">
        How do I export files from DEGIRO?
      </button>
      <section class="content" >
        <h3 class="contentTitle">
          Easy Export
          <span class="contentTitleThin">
            <Icon
              icon="fluent:checkmark-12-filled"
              color="var(--clr-green)"
              height="17"
            />
            Recommended method
          </span>
        </h3>
        <p>
          To download your files, click the links below and log in
          to Degiro. For each file click the 'Export' button in the top
          right, then select the 'CSV' format. All dates have already been set correctly.
        </p>
        <p>
          <a
            href="https://trader.degiro.nl/staging-trader/#/portfolio"
            target="_blank"
            >Portfolio File</a
          >
          <br />
          <a :href="transactionsLink" target="_blank">Transactions File</a>
          <br />
          <a :href="accountLink" target="_blank">Account File</a>
        </p>
        <h3 class="contentTitle">Manual Export</h3>
        <p>If the links do not work for you, or you wish to export manually:</p>
        <p>
          <span class="listNumber">1.</span> Go to Activity > Transactions and
          set the start date to include your portfolio's complete history.<br /><br />
          <span class="listNumber">2.</span> Click the 'Export' button and
          select 'CSV'.<br /><br />
          <span class="listNumber">3.</span> Go to Activity > Account Statements
          and set the start date to include your portfolio's complete
          history.<br /><br />
          <span class="listNumber">4.</span> Click the 'Export' button and
          select 'CSV'.<br /><br />
          <span class="listNumber">5.</span> Go to your Portfolio page.<br /><br />
          <span class="listNumber">6.</span> Do not change any dates, click the
          'Export' button and select 'CSV'.<br /><br />
        </p>
      </section>
      <button class="collapsible" @click="toggleCollapsible(1)">
        How do I import files into Capitalyse?
      </button>
      <section class="content">
        <p>
          Upload your exported Transactions.csv, Account.csv and Portfolio.csv
          files by clicking the 'Upload Files' button.
        </p>
        <p>
          Next, select all files you wish to upload. If there appears a green
          checkmark, the upload was succesful.
        </p>
        <!-- <p>
          If the files aren't uploading, please check that you have selected the
          correct files or have the correct start dates selected (set to before the start of your account) in Degiro
          for the Transactions and Account files before
          downloading.
        </p>
        <p>After uploading all files, you can delete them from your device.</p> -->
      </section>
      <button class="collapsible" @click="toggleCollapsible(2)">
        What's in these files?
      </button>
      <section class="content">
        <p>
          If you've correctly exported all files, they should contain your
          trades, fees, holdings and account statements.
        </p>
        <p>
          These files do not contain any personal data and you can permanently
          delete all data from Capitalyse anytime you wish to do so.
        </p>
        <p>
          Your data will not be used for any other purpose than to show you your
          analytics and insights.
        </p>
      </section>
    </section>
  </section>
</template>

<script>
import CloseIcon from "vue-material-design-icons/Close.vue";
import { Icon } from "@iconify/vue";
import CheckMarkIcon from "vue-material-design-icons/CheckDecagram.vue";

import csvToArrayMixin from "../../mixins/helpers/csvToArray.js";
import includesFromArray from "../../mixins/helpers/includesFromArray.js";

import Breadcrumbs from "../../components/ui/Breadcrumbs.vue";
import Header from "../../components/layout/Header.vue";
import BackButton from "../../components/ui/BackButton.vue";

export default {
  mixins: [csvToArrayMixin, includesFromArray],
  components: {
    CloseIcon,
    CheckMarkIcon,
    Header,
    Breadcrumbs,
    Icon,
    BackButton,
  },
  data() {
    return {
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
      isTooltipOpen: false,
      isPortfolioNameInputVisible: false,
    };
  },
  watch: {
    uploadingState() {
      if (this.uploadingState === "success") {
        this.$store.commit("files/setUploadingState", "none");
        this.isLoading = false;
        this.$router.push({ path: "/portfolios" });
      } else if (this.uploadingState === "error") {
        this.$store.commit("files/setUploadingState", "none");
        this.isLoading = false;
      }
    },
    getPortfolios() {
      this.alreadyHasPortfolios();
    },
  },
  computed: {
    inputText() {
      let tot = 0;
      this.transactionsFile ? tot++ : null;
      this.accountFile ? tot++ : null;
      this.portfolioFile ? tot++ : null;
      return "Import Files (" + tot + "/3)";
    },
    filesAreValid() {
      return this.transactionsFile && this.accountFile && this.portfolioFile;
    },
    formIsValid() {
      // if portfolio is valid and files are uploaded after passing checks then return true
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
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      const date = yyyy + "-" + mm + "-" + dd;

      return `https://trader.degiro.nl/staging-trader/#/account-overview?fromDate=2000-01-01&toDate=${date}&aggregateCashFunds=true&currency=Alle`;
    },
    transactionsLink() {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      const date = yyyy + "-" + mm + "-" + dd;

      return `https://trader.degiro.nl/staging-trader/#/transactions?fromDate=2000-01-01&toDate=${date}&aggregateCashFunds=true&currency=Alle`;
    },
  },
  methods: {
    togglePortfolioNameInput() {
      this.isPortfolioNameInputVisible = !this.isPortfolioNameInputVisible;
      this.setPortfolioName();
    },
    setPortfolioName() {
      this.isPortfolioNameInputVisible
        ? (this.portfolioName = "")
        : (this.portfolioName = "My Portfolio");
    },
    toggleCollapsible(id) {
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
    scrollToHelp() {
      const help = document.getElementById("exportFromDegiroHelp");
      help.scrollIntoView({ behavior: "smooth" });
    },
    resetInputStyling() {
      this.portfolioNameIsValidClass = "";
    },
    checkPortfolioNameValidity() {
      if (this.portfolioNameIsValid) {
        this.portfolioNameIsValidClass = "nameValid";
      } else {
        this.portfolioNameIsValidClass = "nameInvalid";
      }
    },
    getPortfolios() {
      return this.$store.dispatch("files/fetchAllPortfolios");
    },
    submitForm() {
      this.getPortfolios();
      this.checkPortfolioNameValidity();
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
      const maxFileSizeKB = 10000;

      for (let i = 0; i < file.length; i++) {
        const valid =
          file[i].size > 0 &&
          file[i].size < maxFileSizeKB * 1024 &&
          file[i].type.includes("csv");
        // this.validateFileContents(file[i]);

        valid ? this.addFile(file[i]) : this.incorrectFile(file[i]);
      }
    },
    addFile(file) {
      if (file.name.includes("Transactions")) {
        this.transactionsFile = file;
        this.transactionsFileName = file.name;
      } else if (file.name.includes("Account")) {
        this.accountFile = file;
        this.accountFileName = file.name;
      } else if (file.name.includes("Portfolio")) {
        this.portfolioFile = file;
        this.portfolioFileName = file.name;
      }
    },
    incorrectFile(file) {
      if (file.name.includes("Transactions")) {
        this.transactionsFile = null;
        this.transactionsFileName = file.name;
      } else if (file.name.includes("Account")) {
        this.accountFile = null;
        this.accountFileName = file.name;
      } else if (file.name.includes("Portfolio")) {
        this.portfolioFile = null;
        this.portfolioFileName = file.name;
      }
    },
    resetFiles() {
      this.transactionsFile = null;
      this.accountFile = null;
      this.portfolioFile = null;
      this.transactionsFileName = "Transactions File";
      this.accountFileName = "Account File";
      this.portfolioFileName = "Portfolio File";
    },
    getDate() {
      // get date DD-MM-YYYY
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
    this.$store.commit("files/setUploadingState", "none");
    this.setPortfolioName();
  },
};
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 45px;
  height: 22px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--clr-medium-light-grey-2);
  -webkit-transition: 0.2s ease-in-out;
  transition: 0.2s ease-in-out;
}

.slider:hover {
  background-color: var(--clr-medium-light-grey-2);
}

.slider:before {
  position: absolute;
  content: "";
  height: 15px;
  width: 15px;
  left: 4px;
  bottom: 4px;
  background-color: var(--clr-very-light-blue);
  -webkit-transition: 0.2s ease-in-out;
  transition: 0.2s ease-in-out;
}

input:checked + .slider {
  background-color: var(--clr-blue);
}

input:checked + .slider:before {
  -webkit-transform: translateX(22px);
  -ms-transform: translateX(22px);
  transform: translateX(22px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 200px;
}

.slider.round:before {
  border-radius: 200px;
}

.titleAndBackButtonContainer {
  margin-bottom: 2rem;
}

.addPortfolioHelp {
  margin-top: 3rem;
}

.addPortfolioHelp h2 {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.collapsible {
  background-color: var(--clr-very-light-blue);
  border-radius: var(--btn-radius);
  color: var(--clr-black);
  cursor: pointer;
  padding: 1rem;
  width: 100%;
  border: 1px solid var(--clr-medium-light-grey);
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
  transition: all 0.2s ease-out;
  background-color: var(--clr-very-light-blue);
  margin-bottom: 0.75rem;
  border: 1px solid var(--clr-medium-light-grey);
  border-top: none;
  border-bottom: none;
}

.portfolioName__heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--clr-light-grey);
  padding-top: 1rem;
}

.portfolioName {
  margin-bottom: 2rem;
}
.portfolioName__optional {
  color: var(--clr-grey);
  font-size: 0.9rem;
}

.contentTitle {
  margin-bottom: 0.4rem;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.contentTitleThin {
  background-color: rgba(0, 128, 0, 0.1);
  padding: 0.2rem;
  padding-left: 0.4rem;
  padding-right: 0.4rem;
  border-radius: 5px;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--clr-green);
  display: inline-flex;
  gap: 0.1rem;
  justify-content: center;
  align-items: center;
}

.content p {
  color: var(--clr-dark-grey);
  margin-bottom: 1rem;
  font-size: 0.875rem;
  line-height: 1.15rem;
}
.content p:nth-last-child(1) {
  margin-bottom: 0;
}

a {
  color: #00a8ff;
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
  margin-top: 2rem;
  margin-bottom: 2rem;
  width: 28rem;
}

.formCardContainer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.formCard {
  width: 30rem;
  padding: 1.25rem;
  background-color: var(--clr-very-light-blue);
  box-shadow: var(--box-shadow-big);
  border-radius: var(--card-border-radius);
  border: 1px solid var(--clr-very-light-grey);
}

.fileValid {
  color: var(--clr-green);
}

.fileInvalid {
  color: var(--clr-red);
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
  transition: 0.2s all;
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
  background-color: #008cff07;
  border-radius: var(--btn-radius);
  width: 100%;
  padding: 3rem 0rem;
  border: 2px dashed var(--clr-blue);
  color: var(--clr-blue);
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  transition: 0.2s all;
}

.uploadFilesLabel:hover,
.uploadFilesLabel:hover * {
  cursor: pointer;
  text-decoration: underline;
  user-select: none;
}

.uploadFilesLabel:hover {
  background-color: #008cff0e;
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
  margin-bottom: 1rem;
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
  justify-content: center;
  gap: 0.2rem;
  padding: 0.3rem;
  border-radius: 0.4rem;
  border: 1px solid transparent;
}

.resetUploadedBtn:hover {
  box-shadow: none;
  cursor: pointer;
  border:1px solid var(--clr-medium-light-grey);
  box-shadow: var(--btn-shadow);
}

.secondary {
  text-align: center;
  margin-top: 1rem;
}

.fileButtons {
  display: flex;
  flex-direction: column;
}

.submitFiles {
  background-image: linear-gradient(to right, #008cff, #006eff 100%);
}
/* anims */
.slide-fade-enter-active {
  transition: all 0.125s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.125s ease-in;
}
.slide-fade-enter-from {
  transform: translateY(-10px) translateX(-20px) scale(0.95);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-10px) translateX(-20px) scale(0.75);
  opacity: 0;
}

@media screen and (min-width: 768px) {
  .formCard {
    padding: 1.75rem;
  }
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
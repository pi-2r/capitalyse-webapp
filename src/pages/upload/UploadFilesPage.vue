<template>
    <Header></Header>
    <section class="container">
        <Spinner class="spinner" v-if="isLoading"/>
      
        <Breadcrumbs baseLink="/portfolios" baseLinkName="My Portfolios" secondLink="/portfolios/new" secondLinkName="Add Portfolio"/>
        <section class="titleAndBackButtonContainer">
            <BackButton/>
            <h1 class="uploadFilesTitle">Add Portfolio</h1>
        </section>
        <section class="formCardContainer">
            <section class="formCard" v-if="!isLoading">

                <article class="wrapper" >
                    <form  @submit.prevent="submitForm" class="uploadFilesForm">
                        <section class="portfolioName">
                            <label for="portfolioName">Portfolio name</label>
                            <input type="text" id="portfolioName" @blur="checkPortfolioNameValidity" @focus="resetInputStyling" v-model.trim="portfolioName" :class="portfolioNameIsValidClass" autocomplete="off" placeholder="e.g. Degiro Portfolio"/>
                        </section>

                        <section class="uploadFilesGroup">
                            <section class="uploadFilesGroup__heading">
                                <p class="filesLabelP">
                                    Files
                                    <Icon 
                                        @click="toggleTooltip"
                                        class="uploadFilesTooltipBtn" icon="clarity:help-info-solid" color="var(--clr-blue)" height="18" />
                                </p>
                            </section>
                            <div v-if="isTooltipOpen" @click="toggleTooltip" class="overlay"></div>
                            <transition name="slide-fade" mode="out-in">
                                <section class="uploadFilesTooltipWrapper" v-if="isTooltipOpen"> 
                                    <section class="uploadFilesTooltip">
                                        <p>Upload the <strong>Transactions.csv</strong>, <strong>Account.csv</strong> and <strong>Portfolio.csv</strong> 
                                        files found in your Degiro 
                                        Transactions & Account Statements on the Activity page. The Portfolio.csv file can be found next to your current holdings.
                                            <br><br>
                                            For the Transactions.csv and Account.csv files: before downloading, select a start date of before you started your account to include everything. 
                                            Then export as CSV and upload them here.
                                        </p>
                                    </section>
                                </section>
                            </transition>
                            <label class="uploadFilesLabel">
                                <input @change="uploadFile" type="file" accept=".csv" multiple/>
                                <span class="uploadFilesLabelText">{{ inputText }}</span>
                            </label>
                        </section>

                        <section class="btnAndFileNames">
                            <section class="fileNames">
                                <section class="fileNamesAndBtn u-noselect">
                                    <p class="fileName" :class="(portfolioFileIsValid) ? 'fileValid' : 'fileInvalid'">
                                        
                                        <span v-if="portfolioFileIsValid">
                                            <CheckMarkIcon class="fileIcon"/>
                                        </span> 
                                        <span v-else>
                                            <CloseIcon class="fileIcon"/>
                                        </span> 
                                    
                                        <span>{{ portfolioFileName }}</span>
                                    </p>
                                    <p class="fileName" :class="(transactionsFileIsValid) ? 'fileValid' : 'fileInvalid'">
                                    
                                    <span v-if="transactionsFileIsValid">
                                        <CheckMarkIcon class="fileIcon"/>
                                    </span> 
                                    <span v-else>
                                        <CloseIcon class="fileIcon"/>
                                    </span>
                                    
                                    <span>{{ transactionsFileName }}</span>
                                    </p>
                                    <p class="fileName" :class="(accountFileIsValid) ? 'fileValid' : 'fileInvalid'">
                                        
                                        <span v-if="accountFileIsValid">
                                            <CheckMarkIcon class="fileIcon"/>
                                        </span> 
                                        <span v-else>
                                            <CloseIcon class="fileIcon"/>
                                        </span> 
                                    
                                        <span>{{ accountFileName }}</span>
                                    </p>
                                    
                                </section>
                            </section>
                            <button class="resetUploadedBtn" @click="resetFiles">Reset Uploads</button>
                        </section>
                                
                        <section class="fileButtons ">
                            <Button type="submit" class="submitFiles">Add Portfolio</Button>
                            <Button class="secondary" link to="/portfolios" >Cancel</Button>
                        </section>
                    </form>
                </article>
            </section>
        </section>
        
        
    </section>
</template>

<script>
import CloseIcon from 'vue-material-design-icons/Close.vue';
import { Icon } from '@iconify/vue';
import CheckMarkIcon from 'vue-material-design-icons/CheckDecagram.vue';
import Breadcrumbs from '../../components/ui/Breadcrumbs.vue';
import Header from '../../components/layout/Header.vue';
import csvToArrayMixin from '../../mixins/csvToArray.js';
import includesFromArray from '../../mixins/includesFromArray.js';

import BackButton from '../../components/ui/BackButton.vue';

export default {
    mixins: [csvToArrayMixin, includesFromArray],
    components: {
        CloseIcon,
        CheckMarkIcon,
        Header,
        Breadcrumbs,
        Icon,
        BackButton
    },
    data() {
        return {
            transactionsFile: null,
            accountFile: null,
            portfolioFile: null,
            transactionsFileName: 'Transactions File',
            accountFileName: 'Account File',
            portfolioFileName: 'Portfolio File',
            portfolioName: '',
            accountFileIsEmpty: null,
            transactionsFileIsEmpty: null,
            portfolioFileIsEmpty: null,
            portfolioNameIsValidClass: '',
            isLoading: false,
            isTooltipOpen: false,
        }
    },
    watch: {
        uploadingState() {
            if (this.uploadingState === 'success') {
                this.$store.commit('files/setUploadingState', 'none');
                this.isLoading = false;
                this.$router.push({ path: '/portfolios' });
            } else if (this.uploadingState === 'error') {
                this.$store.commit('files/setUploadingState', 'none');
                this.isLoading = false;
            }
        },
        getPortfolios() {
            this.alreadyHasPortfolios();
        },
    },
    computed: {
        inputText() {
            let tot = 0
            this.transactionsFile ? tot++ : null
            this.accountFile ? tot++ : null
            this.portfolioFile ? tot++ : null
            return "Upload Files (" + tot + "/3)";
        }, 
        formIsValid() {
            // if portfolio is valid and files are uploaded after passing checks then return true
            if (this.portfolioNameIsValid && this.transactionsFileIsValid && this.accountFileIsValid && this.portfolioFileIsValid) {
                return true;
            } else {
                return false;
            }
        },
        portfolioNameIsValid() {
            const forbiddenChars = ['/', '\\', '<', '>', ':', '"', '|', '?', '*', '&', '$', '#', '%', '@', '^', '+', '=', '~', '`', '{', '}', ';', '.', ','];
            const valid = !this.includesFromArray(forbiddenChars, this.portfolioName) &&
                this.portfolioName.length > 0 &&
                this.portfolioName.length < 30;

            return valid;
        },
        uploadingState(){
            return this.$store.getters['files/getUploadingState'];
        },
        amountOfPortfolios() {
            return this.$store.getters['files/amountOfPortfolios'];
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
    },
    methods: {
        toggleTooltip() {
            this.isTooltipOpen = !this.isTooltipOpen;
        },
        resetInputStyling() {
            this.portfolioNameIsValidClass = '';
        },
        checkPortfolioNameValidity() {
            if (this.portfolioNameIsValid) {
                this.portfolioNameIsValidClass = 'nameValid';
            } else {
                this.portfolioNameIsValidClass = 'nameInvalid';
            }
        },
        getPortfolios() {
            return this.$store.dispatch('files/fetchAllPortfolios');
        },
        submitForm() {
            this.getPortfolios();
            this.checkPortfolioNameValidity();
            if(this.formIsValid) {
                this.isLoading = true;
                this.$store.dispatch('files/createNewPortfolio', {
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

                const transactionsValid = fileAsArray[0].length === 19 &&
                    fileAsArray.length !== 0;
                const accountValid = fileAsArray[0].length === 12 &&
                    fileAsArray.length !== 0;

                isValid = !transactionsValid && !accountValid;
            }
            reader.readAsText(e);

            return isValid;
        },
        uploadFile(event) {
            this.checkFileValidity(event.target.files);
        },
        checkFileValidity(file) {
            const maxFileSizeKB = 10000;

            for(let i = 0; i < file.length; i++) {
                const valid = file[i].size > 0 && 
                    file[i].size < (maxFileSizeKB * 1024) &&
                    file[i].type.includes('csv');
                    // this.validateFileContents(file[i]);
                
                valid ? this.addFile(file[i]) : this.incorrectFile(file[i]);
            }
        },
        addFile(file) {
            if(file.name.includes('Transactions')) {
                this.transactionsFile = file;
                this.transactionsFileName = file.name;
            } else if(file.name.includes('Account')) {
                this.accountFile = file;
                this.accountFileName = file.name;
            } else if(file.name.includes('Portfolio')) {
                this.portfolioFile = file;
                this.portfolioFileName = file.name;
            }
        },
        incorrectFile(file) {
            if(file.name.includes('Transactions')) {
                this.transactionsFile = null;
                this.transactionsFileName = file.name;
            } else if(file.name.includes('Account')) {
                this.accountFile = null;
                this.accountFileName = file.name;
            } else if(file.name.includes('Portfolio')) {
                this.portfolioFile = null;
                this.portfolioFileName = file.name;
            }
        },
        resetFiles() {
            this.transactionsFile = null;
            this.accountFile = null;
            this.portfolioFile = null;
            this.transactionsFileName = 'Transactions File';
            this.accountFileName = 'Account File';
            this.portfolioFileName = 'Portfolio File';
        },
        getDate() {
             // get date DD-MM-YYYY
            let date = new Date();
            let dd = date.getDate();
            let mm = date.getMonth() + 1;
            let yyyy = date.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            date = dd + '-' + mm + '-' + yyyy;
            return date;
        }
    },
    created() {
        this.$store.commit('files/setUploadingState', 'none');
    }
}
</script>

<style scoped>
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

.spinner {
    position: absolute;
    top: 50%;
    left: 48%;
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
    padding: 1.1rem;
    background-color: var(--clr-very-light-blue);
    border: 1px solid var(--clr-grey);
    border-radius: var(--btn-radius);
    font-size: 16px;
    font-weight: 500;
    color: var(--clr-black);
    box-shadow: none;
    margin-top: 0.3rem;
}

input[type="text"]::placeholder {
    color: var(--clr-grey);
}

.filesLabelP {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
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
    font-size: 0.8rem;
    background-color: var(--clr-white);
    padding: 0.65rem;
    border-radius: var(--btn-radius);
    box-shadow: var(--box-shadow);
    z-index: 3;
}

.uploadFilesTooltip::after {
    content: '';
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
    background-color: var(--clr-light-blue);
    border-radius: 100px;
}

label {
    font-size: 1.2rem;
}

input[type="file"] {
   display: none;
}

input[type="submit"]:hover, button:hover {
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
    user-select: none;
}

.uploadFilesLabelText {
    font-size: var(--btn-font-size);
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

    margin-top: 1rem;
}

.uploadFilesGroup__heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.uploadFilesGroup__help {
    font-size: 1rem;
    color: var(--clr-grey);
    font-weight: lighter;
    margin-top: 0.5rem;
}

.uploadFilesLabel {
    background-color: var(--clr-light-blue);
    border-radius: var(--btn-radius);
    width: 100%;
    padding: var(--btn-padding);
    border: 3px dashed var(--clr-blue);
    color: var(--clr-blue);
    text-align: center;
  
}

.uploadFilesLabel:hover, .uploadFilesLabel:hover * {
    cursor: pointer;
    text-decoration: underline;
    user-select: none;
}


.fileName {
    display: flex;
    align-items: center;
    margin-bottom: 0.2rem;
    font-size: 0.9rem;
}

.btnAndFileNames {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    margin-bottom: 2rem;
}

.resetUploadedBtn {
    height: 2rem;
  
    border: none;
    color: var(--clr-blue);
    font-size: 1rem;
    background-color: transparent;
}

.resetUploadedBtn:hover{
    box-shadow: none;
    cursor: pointer;
    transform: scale(1);
    text-decoration: underline;
}

.secondary {
    text-align: center;
    margin-top: 1rem;
}

.fileButtons {
    display: flex;
    flex-direction: column;
}

.submitFiles:hover {
    transform: scale(1.005);
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
        padding: 2rem;
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
<template>
    <Header></Header>
    <section class="container">
        <article class="wrapper">
            <h1 class="uploadFilesTitle">Upload Files</h1>
            <form @submit.prevent="submitForm" class="uploadFilesForm">
                
                <section class="uploadFilesGroup">
                    <label class="uploadFilesLabel">
                        <input @change="uploadFile" type="file" accept=".csv" multiple/>
                        <span>{{ inputText }}</span>
                    </label>
                </section>

                <section class="btnAndFileNames">
                    <section class="fileNames">
                        <p class="fileName" :class="(transactionsFile) ? 'fileValid' : 'fileInvalid'">
                            
                            <span v-if="transactionsFile">
                                <CheckMarkIcon class="fileIcon"/>
                            </span> 
                            <span v-else>
                                <CloseIcon class="fileIcon"/>
                            </span>
                            
                            <span>{{ transactionsFileName }}</span>
                        </p>
                        <p class="fileName " :class="(accountFile) ? 'fileValid' : 'fileInvalid'">
                            
                            <span v-if="accountFile">
                                <CheckMarkIcon class="fileIcon"/>
                            </span> 
                            <span v-else>
                                <CloseIcon class="fileIcon"/>
                            </span> 
                        
                            <span>{{ accountFileName }}</span>
                        </p>
                    </section>

                    <section class="fileButtons ">
                        <!-- <Button @click="resetFiles" mode="secondary" class="removeFiles">Reset</Button> -->
                        <Button class="secondary" link to="/portfolios" >Back</Button>
                        <Button type="submit" class="submitFiles">Submit</Button>
                    </section>

                </section>
                        <p v-if="alreadyHasFiles" class="alreadyFiles">You already have files uploaded, 
                            If you want to upload your new files, submit them again to overwite.</p>
            </form>
        </article>
    </section>
</template>

<script>
import CloseIcon from 'vue-material-design-icons/Close.vue';
import CheckMarkIcon from 'vue-material-design-icons/CheckDecagram.vue';

import Header from '../../components/layout/Header.vue';

import csvToArrayMixin from '../../mixins/csvToArray.js';

export default {
    mixins: [csvToArrayMixin],
    components: {
        CloseIcon,
        CheckMarkIcon,
        Header
    },
    data() {
        return {
            csvFiles: [],
            transactionsFile: null,
            accountFile: null,
            transactionsFileName: 'Transactions File',
            accountFileName: 'Account File',
            alreadyHasFiles: false,
        }
    },
    computed: {
        inputText() {
            let tot = 0
            this.transactionsFile ? tot++ : null
            this.accountFile ? tot++ : null
            return "Upload Files (" + tot + "/2)";
        }, 
        hasFilesInStore() {
            return this.$store.getters['files/hasFiles'];
        }
    },
    watch: {
        hasFilesInStore() {
            if(this.hasFilesInStore) {
                this.setStylingToHasFiles();
            }
        }
    },
    methods: {
        setStylingToHasFiles() {
            this.accountFile = true;
            this.transactionsFile = true;
            this.alreadyHasFiles = true;
        },
        fetchFiles() {
            this.$store.dispatch('files/fetchCSVData');
        },
        submitForm() {
            if(this.transactionsFile && this.accountFile) {
                this.$store.dispatch('files/sendCSVData', {
                    transactionsFile: this.transactionsFile,
                    accountFile: this.accountFile
                });

                this.$router.push('/portfolios');
            } else {
                console.log('Please upload both files modal');
            }
        },
        readAsText(e, fName) {
            let reader = new FileReader();
            
            reader.onload = (e) => {
                let text = e.target.result;
                let fileAsArray = this.csvToArray(text);
            
                if(fName.includes('Transactions')) {
                    this.transactionsFile = fileAsArray;
                } else {
                    this.accountFile = fileAsArray;
                }
            }
            reader.readAsText(e);
        },
        uploadFile(event) {
            this.checkFileNames(event.target.files);
        },
        checkFileNames(files) {
            const maxFileSizeKB = 1500;
            for (let i = 0; i < files.length; i++) {
                let fileName = files[i].name;
                
                if((files[i].size / 1024) < maxFileSizeKB) {
                    if(fileName.includes('Transactions')) {
                        this.transactionsFileName = fileName;
                        this.readAsText(files[i], fileName);
                    } else if(fileName.includes('Account')) {
                        this.accountFileName = fileName;
                        this.readAsText(files[i], fileName);
                    }
                } else {
                    console.log('File too large');
                }
                
            }
        },
        resetFiles() {
            this.transactionsFile = null;
            this.accountFile = null;
        },
    },
    created() {
        if(this.hasFilesInStore) {
            this.setStylingToHasFiles();
        } else if (!this.hasFilesInStore) {
            this.fetchFiles();
        }
    }
}
</script>

<style scoped>
.alreadyFiles {
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    color: var(--clr-blue)
}

.container {
    margin: 0 auto;
    margin-top: 2rem;
    margin-bottom: 2rem;
}

.fileValid {
    color: var(--clr-green);
}

.fileInvalid {
    color: var(--clr-red);
}

button:nth-last-of-type(1) {
    margin-left: 1rem;
}

input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
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

.fileIcon {
    margin-right: 0.4rem;
}

.uploadFilesForm {
    display: grid;
    grid-template-columns: 1fr;
    margin-top: 2rem;
}

.uploadFilesGroup {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
}

.uploadFilesLabel {
    background-color: var(--clr-light-blue);
    border-radius: var(--btn-radius);
    width: 100%;
    padding: 1.5rem;
    border: 3px dashed var(--clr-blue);
    color: var(--clr-blue);
    text-align: center;
}

.uploadFilesLabel:hover, .uploadFilesLabel:hover * {
    cursor: pointer;
    text-decoration: underline;
    user-select: none;
}

.fileButtons {
    order: 1;
}

.fileNames {
    order: 2;
    margin-top: 1.5rem;
}

.fileName {
    display: flex;
    align-items: center;
    margin-bottom: 0.2rem;
}

.btnAndFileNames {
    margin-top: 2rem;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
}

.removeFiles {
    margin-right: 1rem;
    margin-bottom: 0.3rem;
}

@media screen and (min-width: 768px) {
    .fileButtons {
        order: 2;
    }

    .fileNames {
        order: 1;
        margin-top: 0;
    }

    .btnAndFileNames {
        flex-direction: row;
    }
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
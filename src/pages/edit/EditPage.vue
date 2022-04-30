<template>
    <Header></Header>
    <section class="container">
        
        <Breadcrumbs baseLink="/portfolios" baseLinkName="My Portfolios" secondLink="/portfolios/new" secondLinkName="Add Portfolio"/>
        <h1 class="uploadFilesTitle">Edit Portfolio</h1>
        <section class="formCardContainer">
            <section class="formCard">

                <article class="wrapper">
                    <form @submit.prevent="submitForm" class="uploadFilesForm">
                        
                        <section class="portfolioName">
                            <label for="portfolioName">Portfolio name</label>
                            <input type="text" id="portfolioName" v-model.trim="portfolioName" autocomplete="off" placeholder="E.g. DeGiro Portfolio"/>
                        </section>

                        <section class="uploadFilesGroup">
                            <p class="filesLabelP">Files</p>
                            <label class="uploadFilesLabel">
                                <input @change="uploadFile" type="file" accept=".csv" multiple/>
                                <span class="uploadFilesLabelText">{{ inputText }}</span>
                            </label>
                        </section>

                        <section class="btnAndFileNames">
                            <section class="fileNames">
                                <section class="fileNamesAndBtn">
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

                        <section v-if="isLoading">
                            <Spinner />
                        </section>
                    </form>
                </article>
            </section>
        </section>
    </section>
</template>

<script>


</script>

<style scoped>
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
    background-color: #f5f5f5;
    border: none;
    border-radius: var(--btn-radius);
    font-size: 16px;
    font-weight: 500;
    color: var(--clr-black);
    margin-top: 0.3rem;
}

input[type="text"]::placeholder {
    color: var(--clr-grey);
}

.filesLabelP {
     font-size: 1.2rem;
    font-weight: lighter;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
}

label {
    font-size: 1.2rem;
    font-weight: lighter;
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
    margin-right: 0.4rem;
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
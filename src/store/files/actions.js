import '../../../firebase'
import {
    // writeBatch,
    getFirestore,
    collection,
    getDocs,
    deleteDoc, 
    doc,
    getDoc,
    addDoc,
    // setDoc,
    updateDoc,
} from 'firebase/firestore'

import {
    // getBlob,
    // getBytes,
    getDownloadURL,
    getStorage,
    ref,
    uploadBytes,
    deleteObject,
} from 'firebase/storage';

// mixins

const db = getFirestore();

export default {
    setFiles(context, payload) {
        context.commit("setFiles", {
            transactionsFile: payload.transactionsFile,
            accountFile: payload.accountFile,
        });
    },
    resetFiles(context) {
        context.commit("resetFiles");
    },
    setLastDashboardPortfolioId(context, id) {
        context.commit("setLastDashboardPortfolioId", id);
    },
    async createNewPortfolio(context, payload) {
        const storage = getStorage();

        const userId = localStorage.getItem('userId');
        const transactionsFile = payload.transactionsFile;
        const accountFile = payload.accountFile;

        const transactionsFileSize = (transactionsFile.size / 1024).toFixed(2);
        const accountFileSize = (accountFile.size / 1024).toFixed(2);
           
        const firebaseDocData = {
            portfolioName: payload.portfolioName,
            addedAt: payload.addedAt,
            transactionsFileUrl: '',
            accountFileUrl: '',
            transactionsFileSize: transactionsFileSize,
            accountFileSize: accountFileSize,
        }
     
        // firestore link
        const setFirestorePortfolioRef = collection(db, `users/${userId}/portfolios`);
    
        
        // firestore upload
        addDoc(setFirestorePortfolioRef, firebaseDocData).then((docRef) => {
            const portfolioId = docRef.id;
            // csv file storage upload, with newly gotten portfolio ID
            const transactionsStorageFileUrl = `users/${userId}/portfolios/${portfolioId}/Transactions.csv`
            const accountStorageFileUrl = `users/${userId}/portfolios/${portfolioId}/Account.csv`
            const transactionsStorageFileRef = ref(storage, transactionsStorageFileUrl);
            const accountStorageFileRef = ref(storage, accountStorageFileUrl);
            // upload transactions file
            uploadBytes(transactionsStorageFileRef, transactionsFile).then(() => {
                uploadBytes(accountStorageFileRef, accountFile).then(() => {
                    // update firestore storage url
                    const updateFireStorePortfolioRef = doc(db, `users/${userId}/portfolios/${portfolioId}`);

                    updateDoc(updateFireStorePortfolioRef, {
                        transactionsFileUrl: transactionsStorageFileUrl,
                        accountFileUrl: accountStorageFileUrl,
                    }).then(() => {
                        context.commit("setUploadingState", "success");
                    }).catch((error) => {
                        context.commit("setUploadingState", "error");
                        console.log('error at updating firestore storage url');
                        console.log(error);
                    });
                }).catch((error) => {
                    context.commit("setUploadingState", "error");
                    console.log('error at account file upload');
                    console.log(error);
                });
            }).catch((error) => {
                context.commit("setUploadingState", "error");
                console.log( 'error at transactions file upload');
                console.log(error);
            });
        }).catch(error => {
            context.commit("setUploadingState", "error");
            console.log('error at firestore upload');
            console.log( error);
        });
    },
    async fetchAllPortfolios(context) {
        const userId = localStorage.getItem('userId');
        const portfoliosRef = collection(db, `users/${userId}/portfolios`);
        const querySnapshot = await getDocs(portfoliosRef);
       
        let portfolios = [];
        querySnapshot.forEach(doc => {
            portfolios.push({
                id: doc.id,
                ...doc.data()
            });
        });

        context.commit("setPortfolios", portfolios);
    },
    async fetchOnePortfolio(context, payload) {
        const userId = localStorage.getItem('userId');
        const portfolioId = payload.id;
       
        const transactionsFileUrl = `users/${userId}/portfolios/${portfolioId}/Transactions.csv`;
        const accountFileUrl = `users/${userId}/portfolios/${portfolioId}/Account.csv`;
        const storage = getStorage();

        const transactionsFileRef = ref(storage, transactionsFileUrl);
        getDownloadURL(transactionsFileRef).then((url) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.onload = function () {
                const blob = xhr.response;
                const reader = new FileReader();
                reader.readAsText(blob);
                reader.onload = function (e) {
                    const transactionsFile = e.target.result;
                    // turn into array of arrays
                    const rows = transactionsFile.slice(transactionsFile.indexOf("\n") + 1).split("\n");
                    rows.map(row => row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));  
                    const transactionsArray = rows.map(row => row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));
     
                    context.commit("setTransactionsFile", transactionsArray);
                }
            };
            xhr.send();
        }).catch((error) => {
            console.log(error);
        });

        const accountFileRef = ref(storage, accountFileUrl);
        getDownloadURL(accountFileRef).then((url) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.onload = function () {
                const blob = xhr.response;
                const reader = new FileReader();
                reader.readAsText(blob);
                reader.onload = function (e) {
                    const accountFile = e.target.result;
                    // turn into array of arrays
                    const rows = accountFile.slice(accountFile.indexOf("\n") + 1).split("\n");
                    rows.map(row => row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));  
                    const accountArray = rows.map(row => row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));
     
                    context.commit("setAccountFile", accountArray);
                }
            };
            xhr.send();
        }).catch((error) => {
            console.log(error);
        });
    },
    fetchCSVData(context) {
        const userId = localStorage.getItem("userId");
        const transactionsFileColRef = doc(db, 'users', userId, 'files', 'transactionsFile');
        const accountFileColRef = doc(db, 'users', userId, 'files', 'accountFile'); 
        let accountData = null;
        let transactionsData = null;

        getDoc(transactionsFileColRef)
            .then((doc) => {
                transactionsData = doc.data();  
                transactionsData ? transactionsData = Object.values(transactionsData) : transactionsData = null;
                context.commit('setTransactionsFile', transactionsData);                
            })
            .catch(error => {
                console.log('error get');
                console.log(error);
            })
        getDoc(accountFileColRef)
            .then((doc) => {
                accountData = doc.data();
                accountData ? accountData = Object.values(accountData) : accountData = null;	
                context.commit('setAccountFile', accountData);
            })
            .catch(error => {
                console.log('error get');
                console.log(error);
            })
    },
    deletePortfolio(context, payload) {
        const userId = localStorage.getItem('userId');
        const portfolioId = payload;

        const storage = getStorage();

        const deletePortfolioRef = doc(db, `users/${userId}/portfolios/${portfolioId}`);
        const deleteTransactionsFileRef = ref(storage, `users/${userId}/portfolios/${portfolioId}/Transactions.csv`);
        const deleteAccountFileRef = ref(storage, `users/${userId}/portfolios/${portfolioId}/Account.csv`);

        deleteDoc(deletePortfolioRef).then(() => {
            deleteObject(deleteTransactionsFileRef).then(() => {
                deleteObject(deleteAccountFileRef).then(() => {
                    context.commit("deletePortfolio", portfolioId);
                }).catch((error) => {
                    console.log('error at delete portfolio');
                    console.log(error);
                });
            }).catch((error) => {
                console.log('error at delete portfolio');
                console.log(error);       
            });
        }).catch((error) => {
            console.log('error at delete portfolio');
            console.log(error);
        });
    }
};
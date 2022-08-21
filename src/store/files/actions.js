import '../../../firebase'
import {
    // writeBatch,
    getFirestore,
    collection,
    getDocs,
    deleteDoc,
    doc,
    // getDoc,
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

const db = getFirestore();

export default {
    setCurrentPortfolio(context, id) {
        context.commit('setCurrentPortfolio', id);
    },
    resetCurrentPortfolio(context) {
        context.commit('resetCurrentPortfolio');
    },
    setDemoAsCurrentPortfolio(context) {
        context.commit('setDemoAsCurrentPortfolio');
    },
    setUploadingState(context, uploadingState) {
        context.commit('setUploadingState', uploadingState);
    },
    async createNewPortfolio(context, payload) {
        const storage = getStorage();

        const userId = context.rootGetters.userId;
        const transactionsFile = payload.transactionsFile;
        const accountFile = payload.accountFile;
        const portfolioFile = payload.portfolioFile;

        const transactionsFileSize = (transactionsFile.size / 1024).toFixed(2);
        const accountFileSize = (accountFile.size / 1024).toFixed(2);
        const portfolioFileSize = (portfolioFile.size / 1024).toFixed(2);

        const firebaseDocData = {
            portfolioName: payload.portfolioName,
            addedAt: payload.addedAt,
            transactionsFileUrl: '',
            accountFileUrl: '',
            portfolioFileUrl: '',
            transactionsFileSize: transactionsFileSize,
            accountFileSize: accountFileSize,
            portfolioFileSize: portfolioFileSize,
        }

        // firestore link
        const setFirestorePortfolioRef = collection(db, `users/${userId}/portfolios`);

        // firestore upload
        addDoc(setFirestorePortfolioRef, firebaseDocData).then((docRef) => {
            const portfolioId = docRef.id;
            // csv file storage upload, with newly gotten portfolio ID
            const transactionsStorageFileUrl = `users/${userId}/portfolios/${portfolioId}/Transactions.csv`
            const accountStorageFileUrl = `users/${userId}/portfolios/${portfolioId}/Account.csv`
            const portfolioStorageFileUrl = `users/${userId}/portfolios/${portfolioId}/Portfolio.csv`
            const transactionsStorageFileRef = ref(storage, transactionsStorageFileUrl);
            const accountStorageFileRef = ref(storage, accountStorageFileUrl);
            const portfolioStorageFileRef = ref(storage, portfolioStorageFileUrl);
            // upload transactions file
            uploadBytes(portfolioStorageFileRef, portfolioFile).then(() => {
                uploadBytes(transactionsStorageFileRef, transactionsFile).then(() => {
                    uploadBytes(accountStorageFileRef, accountFile).then(() => {
                        // update firestore storage url
                        const updateFireStorePortfolioRef = doc(db, `users/${userId}/portfolios/${portfolioId}`);

                        updateDoc(updateFireStorePortfolioRef, {
                            transactionsFileUrl: transactionsStorageFileUrl,
                            accountFileUrl: accountStorageFileUrl,
                            portfolioFileUrl: portfolioStorageFileUrl,
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
                    console.log('error at transactions file upload');
                    console.log(error);
                });
            }).catch((error) => {
                context.commit("setUploadingState", "error");
                console.log('error at portfolio file upload');
                console.log(error);
            });
        }).catch(error => {
            context.commit("setUploadingState", "error");
            console.log('error at firestore upload');
            console.log(error);
        });
    },
    async fetchAllPortfolios(context) {
        const userId = context.rootGetters.userId;
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
        const userId = context.rootGetters.userId;
        const portfolioId = payload;

        const transactionsFileUrl = `users/${userId}/portfolios/${portfolioId}/Transactions.csv`;
        const accountFileUrl = `users/${userId}/portfolios/${portfolioId}/Account.csv`;
        const portfolioFileUrl = `users/${userId}/portfolios/${portfolioId}/Portfolio.csv`;
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

                    context.commit("setTransactionsFile", {
                        transactionsFile: transactionsArray,
                        portfolioId: portfolioId,
                    });
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
                    
                    // double quote bug fix
                    for (let i = 0; i < rows.length; i++) {
                        if (rows[i][rows[i].length - 1] == '\r' && rows[i][0] == "\"") {
                            // remove first character
                            rows[i] = rows[i].slice(1);
                            // remove last character
                            rows[i] = rows[i].slice(0, -1);
                            // replace "" with "
                            rows[i] = rows[i].replaceAll("\"\"", '"');
                            // remove last character again
                            rows[i] = rows[i].slice(0, -1);
                        }
                    }

                    rows.map(row => row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));
                    const accountArray = rows.map(row => row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));

                    context.commit("setAccountFile", {
                        accountFile: accountArray,
                        portfolioId: portfolioId,
                    });
                }
            };
            xhr.send();
        }).catch((error) => {
            console.log(error);
        });

        const portfolioFileRef = ref(storage, portfolioFileUrl);
        getDownloadURL(portfolioFileRef).then((url) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.onload = function () {
                const blob = xhr.response;
                const reader = new FileReader();
                reader.readAsText(blob);
                reader.onload = function (e) {
                    const portfolioFile = e.target.result;
                    // turn into array of arrays
                    const rows = portfolioFile.slice(portfolioFile.indexOf("\n") + 1).split("\n");
                    
                    // double quote bug fix
                    for (let i = 0; i < rows.length; i++) {
                        if (rows[i][rows[i].length - 1] == '\r' && rows[i][0] == "\"") {
                            // remove first character
                            rows[i] = rows[i].slice(1);
                            // remove last character
                            rows[i] = rows[i].slice(0, -1);
                            // replace "" with "
                            rows[i] = rows[i].replaceAll("\"\"", '"');
                            // remove last character again
                            rows[i] = rows[i].slice(0, -1);
                        }
                    }

                    rows.map(row => row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));
                    const portfolioArray = rows.map(row => row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));

                    context.commit("setPortfolioFile", {
                        portfolioFile: portfolioArray,
                        portfolioId: portfolioId,
                    });
                }
            };
            xhr.send();
        }).catch((error) => {
            console.log(error);
        });
    },
    editPortfolioName(context, payload) {
        const userId = context.rootGetters.userId;
        const portfolioId = payload.id;

        const updateFireStorePortfolioRef = doc(db, `users/${userId}/portfolios/${portfolioId}`);
        updateDoc(updateFireStorePortfolioRef, {
            portfolioName: payload.portfolioName,
        }).then(() => {
            context.commit('files/setUpdatedPortfolioName', {
                portfolioId: portfolioId,
                portfolioName: payload.portfolioName,
            });
        }).catch((error) => {
            console.log(error);
        });
    },
    deletePortfolio(context, payload) {
        const userId = context.rootGetters.userId;
        const portfolioId = payload;

        const storage = getStorage();

        const deletePortfolioRef = doc(db, `users/${userId}/portfolios/${portfolioId}`);
        const deleteTransactionsFileRef = ref(storage, `users/${userId}/portfolios/${portfolioId}/Transactions.csv`);
        const deleteAccountFileRef = ref(storage, `users/${userId}/portfolios/${portfolioId}/Account.csv`);
        const deletePortfolioFileRef = ref(storage, `users/${userId}/portfolios/${portfolioId}/Portfolio.csv`);

        deleteDoc(deletePortfolioRef).then(() => {
            deleteObject(deletePortfolioFileRef).then(() => {
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
        }).catch((error) => {
            console.log('error at delete portfolio');
            console.log(error);
        });
    }
};
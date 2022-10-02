import '../../../firebase'
import {
    // writeBatch,
    getFirestore,
    // collection,
    // getDocs,
    deleteDoc,
    doc,
    // getDoc,
    // setDoc,
    updateDoc,
} from 'firebase/firestore'

import {
    // getBlob,
    // getBytes,
    getDownloadURL,
    getStorage,
    ref,
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
        const API_BASE = 'https://capitalyse-backend.herokuapp.com'
        const API_URL = '/api/portfolios/new'

        // files and portfolio name
        const token = context.rootGetters.token
        const tFile = payload.transactionsFile
        const aFile = payload.accountFile
        const pFile = payload.portfolioFile
        const portfolioName = payload.portfolioName

        // formdata
        var formData = new FormData();
        formData.append("uploadCsv", tFile);
        formData.append("uploadCsv", pFile);
        formData.append("uploadCsv", aFile);
        formData.append("portfolioname", portfolioName)

        // request
        var request = new XMLHttpRequest();
        request.open("POST", API_BASE + API_URL, true);
        // request.setRequestHeader("Content-type", "multipart/form-data"); //----(*)
        request.setRequestHeader("Authorization", token);
        request.onreadystatechange = function () {
            if (
                request.readyState === XMLHttpRequest.DONE &&
                request.status === 200
            ) {
                console.log(JSON.parse(request.responseText));
                context.commit("setUploadingState", "success");
            } else if (request.status !== 200) {
                console.log(request.status, request.responseText);
                context.commit("setUploadingState", "error");
            }
        };

        request.send(formData);
    },
    async fetchAllPortfolios(context) {
        console.log('fetch all portfolio');
        const API_BASE = 'https://capitalyse-backend.herokuapp.com'
        const API_URL = '/api/portfolios'

        const token = context.rootGetters.token
        await fetch(API_BASE + API_URL, {
            method: 'GET',
            headers: new Headers({
                'Authorization': token,
            })
        }).then((response) => response.json())
            .then(data => {
                let portfolios = []
                for (let i = 0; i < data.length; i++) {
                    const portfolio = data[i];
                    portfolios.push(
                        portfolio,
                    );
                }
                context.commit("setPortfolios", portfolios);
            })
    },
    async fetchPortfolioAnalytics(context, payload) {
        if (payload.portfolioId !== undefined && payload.portfolioId !== null) {
            console.log('fetchportfolioanalytics ' + payload.type);
            const analyticsType = payload.type
            const token = context.rootGetters.token
            const portfolioId = payload.portfolioId;

            let holding = "";
            if (analyticsType === 'holdings' && payload.isin !== undefined) {
                holding = `/${payload.isin}`
            }

            // const API_BASE = 'https://capitalyse-backend.herokuapp.com'
            const API_BASE = 'http://localhost:3000'
            const API_URL = `/api/portfolios/${portfolioId}/analytics/${analyticsType}${holding}`

            console.log(API_URL);

            await fetch(API_BASE + API_URL, {
                method: 'GET',
                headers: new Headers({
                    'Authorization': token,
                })
            })
                .then((response) => response.json())
                .then(data => {
                    context.commit("setAnalytics", { data: data, portfolioId: portfolioId, analyticsType: analyticsType, isin: payload.isin });
                })
        }
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
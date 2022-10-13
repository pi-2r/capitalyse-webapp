import '../../../firebase'
import {
    // writeBatch,
    getFirestore,
    // collection,
    // getDocs,
    // deleteDoc,
    doc,
    // getDoc,
    // setDoc,
    updateDoc,
} from 'firebase/firestore'

import {
    // getBlob,
    // getBytes,
    // getDownloadURL,
    // getStorage,
    // ref,
    // deleteObject,
} from 'firebase/storage';

const db = getFirestore();

// const API_BASE = 'https://capitalyse-backend.herokuapp.com'
const API_BASE = 'http://localhost:3000'

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
                context.commit("setUploadingState", "success");
            } else if (request.status !== 200) {
                console.log(request.status, request.responseText);
                context.commit("setUploadingState", "error");
                console.log('error');
            }
        };

        request.send(formData);
    },
    async fetchAllPortfolios(context) {
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
            const analyticsType = payload.type
            const token = context.rootGetters.token
            const portfolioId = payload.portfolioId;

            let holding = "";
            if (analyticsType === 'holdings' && payload.isin !== undefined) {
                holding = `/${payload.isin}`
            }

            const API_URL = `/api/portfolios/${portfolioId}/analytics/${analyticsType}${holding}`

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
    async deletePortfolio(context, payload) {
        const portfolioId = payload;
        const token = context.rootGetters.token

        const API_URL = `/api/portfolios/${portfolioId}/delete`

        await fetch(API_BASE + API_URL, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': token,
            })
        })
            .then((response) => response.json())
            .then((data) => {
                console.info(data);
                context.commit("deletePortfolio", portfolioId);
            })

    }
};
import '../../../firebase'
import {
    getFirestore,
    // collection,
    // getDocs,
    // deleteDoc, 
    doc,
    getDoc,
    // addDoc,
    setDoc
    // updateDoc
} from 'firebase/firestore'

const db = getFirestore();

export default {
    setFiles(context, payload) {
        context.commit("setFiles", {
            transactionsFile: payload.transactionsFile,
            accountFile: payload.accountFile,
        });
    },
    async sendCSVData(context, payload) {

        const userId = localStorage.getItem('userId');
        
        const updateTransactionsFileRef = doc(db, 'users', userId, 'files', 'transactionsFile');
        const updateAccountFileColRef = doc(db, 'users', userId, 'files', 'accountFile');

        setDoc(updateTransactionsFileRef, Object.assign({}, payload.transactionsFile)).then(() => {
        }).catch(error => {
            console.log('error update');
            console.log( error);
        });

        setDoc(updateAccountFileColRef, Object.assign({}, payload.accountFile)).then(() => {
        }).catch(error => {
            console.log('error update');
            console.log(error);
        });

        context.commit("setFiles", {
            transactionsFile: payload.transactionsFile,
            accountFile: payload.accountFile,
        })
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
    async removeCSVData(context, payload) {
        
        context.commit("setFiles", {
            transactionsFile: null,
            accountFile: null,
        });

        const token = localStorage.getItem("token");
        
        const response = await fetch(
            `https://portfolio-analytics-app-default-rtdb.europe-west1.firebasedatabase.app/files/${payload.userId}.json?auth=${token}`,
            {
                method: "DELETE",
            }
        );

        const responseData = await response.json();

        if (!response.ok) {
            const error = new Error(responseData.error.message);
            throw error;
        }
    },
};
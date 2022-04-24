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

        context.commit("setFiles", {
            transactionsFile: payload.transactionsFile,
            accountFile: payload.accountFile,
        })       
        
        // addDoc(transactionsFileColRef, Object.assign({}, payload.transactionsFile)).then(() => {
        // }).catch(error => {
        //     console.log(error);
        // });
        // addDoc(accountFilecolRef, Object.assign({}, payload.accountFile)).then(() => {
        // }).catch(error => {
        //     console.log(error);
        // });

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

        // const userId = localStorage.getItem("userId");
        // const token = localStorage.getItem("token");

        // console.log(data);

        // const response = await fetch(
        //     `https://portfolio-analytics-app-default-rtdb.europe-west1.firebasedatabase.app/files/${userId}.json?auth=${token}`,
        //     {
        //         method: "POST",
        //         body: JSON.stringify(data),
        //     }
        // );

        // const responseData = await response.json();

        // if (!response.ok) {
        //     const error = new Error(responseData.error.message);
        //     throw error;
        // }   

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
                transactionsData = Object.values(transactionsData);
                context.commit('setTransactionsFile', transactionsData);

                getDoc(accountFileColRef)
                    .then((doc) => {
                        accountData = doc.data();
                        accountData = Object.values(accountData);
                        context.commit('setAccountFile', accountData);
                    })
                    .catch(error => {
                        console.log('error get');
                        console.log(error);
                    })
            })
            .catch(error => {
                console.log('error get');
                console.log(error);
            })
            
            


       
       
            

        // getDocs(accountFileColRef)
        // .then((snapshot) => {
        //     let accountFile = [];
        //     snapshot.docs.forEach((doc) => {
        //         accountFile.push({ ...doc.data() });
        //     })
        //     console.log(accountFile);
        // })
        // .catch(error => {
        //     console.log(error);
        // })
        
        // context.commit("setFiles", {
        //     transactionsFile: responseData.transactionsFile,
        //     accountFile: responseData.accountFile,
        // });

        // const response = await fetch(
        //     `https://portfolio-analytics-app-default-rtdb.europe-west1.firebasedatabase.app/files/${payload.userId}.json`,
        // )

        // const responseData = await response.json();

        // if (!response.ok) {
        //     const error = new Error(responseData.error.message);
        //     throw error;
        // }

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
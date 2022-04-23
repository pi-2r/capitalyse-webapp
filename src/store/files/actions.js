export default {
    setFiles(context, payload) {
        context.commit("setFiles", {
            transactionsFile: payload.transactionsFile,
            accountFile: payload.accountFile,
        });
    },
    async sendCSVData(context, payload) {


        const data = {
            transactionsFile: payload.transactionsFile,
            accountFile: payload.accountFile,
        };

        context.commit("setFiles", {
            transactionsFile: data.transactionsFile,
            accountFile: data.accountFile,
        })

        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        console.log(data);

        const response = await fetch(
            `https://portfolio-analytics-app-default-rtdb.europe-west1.firebasedatabase.app/files/${userId}.json?auth=${token}`,
            {
                method: "POST",
                body: JSON.stringify(data),
            }
        );

        const responseData = await response.json();

        if (!response.ok) {
            const error = new Error(responseData.error.message);
            throw error;
        }   

    },
    async fetchCSVData(context, payload) {
        
        const response = await fetch(
            `https://portfolio-analytics-app-default-rtdb.europe-west1.firebasedatabase.app/files/${payload.userId}.json`,
        )

        const responseData = await response.json();

        if (!response.ok) {
            const error = new Error(responseData.error.message);
            throw error;
        }

        context.commit("setFiles", {
            transactionsFile: responseData.transactionsFile,
            accountFile: responseData.accountFile,
        });
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
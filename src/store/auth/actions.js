export default {
    async login(context, payload) {
        
        const authResponse = await fetch(
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD8TfxGvV-99IPZFldKa8yu49aL5jSdXjc",
            {
                method: "POST",
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.password,
                    returnSecureToken: true,
                })
            });
        
        const authResponseData = await authResponse.json();

        if (!authResponse.ok) {
            const error = new Error(authResponseData.error.message);
            throw error;
        }

        localStorage.setItem("token", authResponseData.idToken);
        localStorage.setItem("userId", authResponseData.localId);

        context.commit("setUser", {
            token: authResponseData.idToken,
            userId: authResponseData.localId,
        });
    },
    async signup(context, payload) {
        
        const authResponse = await fetch(
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD8TfxGvV-99IPZFldKa8yu49aL5jSdXjc",
            {
                method: "POST",
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.password,
                    returnSecureToken: true,
                })
            });
        
        const authResponseData = await authResponse.json();

        if (!authResponse.ok) {
            const error = new Error(authResponseData.error.message);
            throw error;
        }

        localStorage.setItem("token", authResponseData.idToken);
        localStorage.setItem("userId", authResponseData.localId);

        context.commit("setUser", {
            token: authResponseData.idToken,
            userId: authResponseData.localId,
        });
    },
    logout(context) {
        
        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        context.commit("setUser", {
            token: null,
            userId: null,
        });

        
    },
    tryLogin(context) {

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (token && userId) {
            context.commit("setUser", {
                token,
                userId,
            });
        }
    },
};
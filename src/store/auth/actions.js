export default {
    async login(context, payload) {
        console.log(context, payload);
    },
    async signup(context, payload) {
        console.log(context, payload);
    },
    logout(context) {
        console.log(context);
    },
    tryLogin(context) {
        console.log(context);
    },
};
export default {
    namespaced: true,
    state() {
        return {
            files: [],
        };
    },
    mutations: {
        setFiles(state, payload) {
            state.files = payload;
        },
        addFile(state, payload) {
            state.files.push(payload);
        },
        removeFile(state, payload) {
            console.log(state, payload);
        },

    },
    getters: {
        files(state) {
            return state.files;
        },
        hasFiles(state) {
            return state.files.length > 1;
        },
    },
    actions: {
        async fetchFiles(context) {
            console.log(context);
        },
        async newFile(context, payload) {
            console.log(context, payload);
        },
        async removeFile(context, payload) {
            console.log(context, payload);
        }
    },
}
import { createStore } from "vuex";


import authModule from "./auth/index.js";
import filesModule from "./files/index.js";
import dictModule from "./dictionary/index.js";
import indexesModule from "./indexes/index.js";

const store = createStore({
    modules: {
        auth: authModule,
        files: filesModule,
        dictionary: dictModule,
        indexes: indexesModule,
    },
});

export default store;
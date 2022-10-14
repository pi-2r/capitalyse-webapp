import { createStore } from "vuex";

import authModule from "./auth/index.js";
import portfoliosModule from "./files/index.js";

const store = createStore({
    modules: {
        auth: authModule,
        files: portfoliosModule,
    },
});

export default store;
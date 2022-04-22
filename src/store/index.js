import { createStore } from "vuex";

import authModule from "./auth/index.js";
import filesModule from "./files/index.js";

const store = createStore({
    modules: {
        auth: authModule,
        files: filesModule,
    },
});

export default store;
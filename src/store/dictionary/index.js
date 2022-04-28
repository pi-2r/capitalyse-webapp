import getters from "./getters";


export default {
    namespaced: true,
    state() {
        return {
            dictionary: {
                currency: ["Valuta", "Währungswechsel"],
                dividend: ["Dividend", "Dividende"],
                deposit: ["iDEAL Deposit", "iDEAL storting", "Soforteinzahlung", "Einzahlung", "Reservation iDEAL / Sofort Deposit"],
            },
        };
    },
    getters,
};

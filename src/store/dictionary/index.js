import getters from "./getters";


export default {
    namespaced: true,
    state() {
        return {
            dictionary: {
                currency: ["Valuta", "Währungswechsel"],
                dividend: ["Dividend", "Dividende"],
                deposit: ["iDEAL storting", "Einzahlung", "Reservation iDEAL / Sofort Deposit"],
                withdrawal: ["Laufende Auszahlung", "Processed Flatex Withdrawal"],
            },
        };
    },
    getters,
};

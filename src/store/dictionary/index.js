import getters from "./getters";


export default {
    namespaced: true,
    state() {
        return {
            dictionary: {
                currency: ["Valuta", "Währungswechsel"],
                dividend: ["Dividend", "Dividende"],
                // iDEAL storting is support voor oude benaming
                deposit: ["iDEAL storting", "Einzahlung", "Reservation iDEAL / Sofort Deposit"],
                failedDeposit: ["Storting mislukt"],
                withdrawal: ["Terugstorting", "Laufende Auszahlung", "Processed Flatex Withdrawal"],
                exchangeFees: ["DEGIRO Aansluitingskosten", "Giro Exchange"],
            },
        };
    },
    getters,
};

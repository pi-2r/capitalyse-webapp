import getters from "./getters";


export default {
    namespaced: true,
    state() {
        return {
            dictionary: {
                currency: ["Valuta", "Währungswechsel"],
                dividend: ["Dividend", "Dividende"],
                dividendTax: ["Impôts sur dividende"],
                // iDEAL storting is support voor oude benaming
                deposit: [
                    "iDEAL storting",
                    "Einzahlung",
                    "Reservation iDEAL / Sofort Deposit",
                    "Dépôt flatex",
                    "Versement de fonds",
                ],
                failedDeposit: ["Storting mislukt"],
                withdrawal: ["Terugstorting", "Laufende Auszahlung", "Processed Flatex Withdrawal"],
                exchangeFees: [
                    "DEGIRO Aansluitingskosten",
                    "Giro Exchange",
                    "Frais de connexion aux places boursières 2021",
                ],
            },
        };
    },
    getters,
};

import getters from "./getters";

export default {
    namespaced: true,
    state() {
        return {
            dictionary: {
                buy: ["Koop", "Verkoop", "Kauf", "Achat"],
                portfolioCash: ["CASH & CASH FUND & FTX CASH"],
                currency: ["Valuta", "Währungswechsel", "de change"],
                dividendEUR: ["Dividend", "Dividende"],
                dividendTax: ["Impôts sur dividende"],
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
                currencyChange: ["Valuta Debitering", "Valuta Creditering", "Opération de change", "Währungswechsel"],
            },
        };
    },
    getters,
};

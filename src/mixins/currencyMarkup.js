export default {
    methods: {
        currencyMarkup(number) {
            number = number.toFixed(2);
            number = parseFloat(number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            return number;
        },
    }
}
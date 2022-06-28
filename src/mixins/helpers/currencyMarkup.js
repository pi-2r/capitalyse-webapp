export default {
    methods: {
        currencyMarkup(number) {
            // takes a dirty number and returns a clean
            // number as a float with 2 decimal places
            // uses the german locale to format the number
            // EXAMPLE: "1,000.00" => 1.000,00
            // EXAMPLE: 1000.90 => 1000,90
            number = number.toFixed(2);
            number = parseFloat(number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            return number;
        },
    }
}
export default {
    methods: {
        cleanNumber(number) {
            const isPositive = number.includes("-") ? false : true;
            number = number.replace(/['"]+/g, '');
            const decimalNumbers = number.split(",")[1].length;
            const dividedBy = Math.pow(10, decimalNumbers);
            let decimal = Number.parseFloat(number.split(",")[1]) / dividedBy;
            number = Number.parseFloat(number.split(",")[0])
            isPositive ? number += decimal : number -= decimal;
            return number;
        },
    }
}
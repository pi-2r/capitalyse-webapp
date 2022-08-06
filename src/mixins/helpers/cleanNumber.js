export default {
    methods: {
        cleanNumber(number) {
            // replace dots with commas for format with dots instead of commas
            number = number.toString().replace(/\./g, ',');
            // als een - heeft, dan is het een negatief getal
            const isPositive = number.includes("-") ? false : true;
            // check voor '' of "" en verwijder dit
            number = number.replace(/['"]+/g, '');
            // geeft letterlijke lengte van nummers achter de komma 
            const decimalNumbers = number.split(",")[1].length;
            const dividedBy = Math.pow(10, decimalNumbers);
            // gets the decimal number as a whole number
            // (without the ,) and divide by dividedBy to get
            // a correct decimal number
            let decimal = Number.parseFloat(number.split(",")[1]) / dividedBy;
            // gets the whole number
            number = Number.parseFloat(number.split(",")[0])
            // if the number is positive, add the decimal to the whole number
            // EXAMPLE: 1 + 0.5 = 1.5
            // if the number is negative, subtract the decimal from the whole number
            // EXAMPLE: - 1 - 0.5 = -1.5
            isPositive ? number += decimal : number -= decimal;
            // return the number
            return number;
        },
    }
}
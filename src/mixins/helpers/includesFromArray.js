export default {
    methods: {
        includesFromArray(array, value) {
            // takes an array and a value to see if the value is in the array
            // returns true or false
            for (let i = 0; i < array.length; i++) {
                if (value.includes(array[i])) {
                    return true;
                }
            }
            return false;
        },
    }
}
export default {
    methods: {
        includesFromArray(array, value) {
            for(let i = 0; i < array.length; i++) {
                if(value.includes(array[i])) {
                    return true;
                }
            }
            return false;
        },
    }
}
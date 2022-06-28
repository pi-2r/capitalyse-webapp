export default {
    methods: {
        capitalizeEachWord(string) {
            // eerst alles naar lowercase
            // dan splitsen op spaties
            // dan loop door de woorden heen
            // bij elk woord de eerste letter to upper case
            // en de rest lower case
            // en join de woorden weer met spaties
            return string
                .toLowerCase()
                .split(' ')
                .map(
                    word => word.charAt(0).toUpperCase() + word.substring(1)
                ).join(' '); 
        },
    }
}
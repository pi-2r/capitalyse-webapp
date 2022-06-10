export default {
    methods: {
       csvToArray(str, delimiter = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/) {
            const rows = str.slice(str.indexOf("\n") + 1).split("\n");
            return rows.map(row => row.split(delimiter));  
        }, 
    }
}
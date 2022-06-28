export default {
    methods: {
        csvToArray(str, delimiter = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/) {
            // convert a csv string to an array of arrays
            // delimiter is a regex to match the delimiter of the csv string
            const rows = str.slice(str.indexOf("\n") + 1).split("\n");
            return rows.map(row => row.split(delimiter));
        },
    }
}
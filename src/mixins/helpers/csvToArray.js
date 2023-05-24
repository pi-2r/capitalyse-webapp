export default {
    methods: {
        csvToArray(str, delimiter = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/) {
            // convert a csv string to an array of arrays
            // delimiter is a regex to match the delimiter of the csv string
            const rows = str.slice(str.indexOf("\n") + 1).split("\n");
            
            // for rare case of files with double quotes everywhere instead of single quotes
            for (let i = 0; i < rows.length; i++) {
                if (rows[i][rows[i].length - 1] == '\r' && rows[i][0] == "\"") {
                // remove first character
                rows[i] = rows[i].slice(1)
                // remove last character
                rows[i] = rows[i].slice(0, -1)
                // replace "" with "
                rows[i] = rows[i].replace(/""/g, '"')
                // remove last character again
                rows[i] = rows[i].slice(0, -1)
                }
            }

            return rows.map(row => row.split(delimiter));
        },
    }
}
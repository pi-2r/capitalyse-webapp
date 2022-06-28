export default {
    methods: {
        splitDate(date) {
            // takes a string date and returns an array of the date parts
            // accounts for multiple date formats
            if (date.includes("-")) {
                date = date.split("-");
            } else if (date.includes(".")) {
                date = date.split(".");
            } else if (date.includes("/")) {
                date = date.split("/");
            }

            return date;
        },
    }
}
export default {
    methods: {
        splitDate(date) {
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
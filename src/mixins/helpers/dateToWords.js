export default {
    methods: {
        dateToWords(dateString) {
            let dateTime = dateString;

            const splitDate = dateTime.split(' ');
            const newDate = splitDate[0] + ' ' + splitDate[1] + ' ' + splitDate[2];

            const date = new Date(dateTime);
            const now = new Date();
            const diff = now - date;
            const diffInMinutes = Math.round(diff / 60000);
            const diffInHours = Math.round(diff / 3600000);
            const diffInDays = Math.round(diff / 86400000);

            if (diffInMinutes < 1) {
                return 'Just now';
            } else if (diffInMinutes < 60) {
                return diffInMinutes + ' minute' + (diffInMinutes > 1 ? 's' : '') + ' ago';
            } else if (diffInHours < 24) {
                return diffInHours + ' hour' + (diffInHours > 1 ? 's' : '') + ' ago';
            } else if (diffInDays < 7) {
                if (diffInDays === 1) {
                    return 'Yesterday';
                } else {
                    return diffInDays + ' day' + (diffInDays > 1 ? 's' : '') + ' ago';
                }
            } else {
             
                return newDate;
            }
        },
    }
}
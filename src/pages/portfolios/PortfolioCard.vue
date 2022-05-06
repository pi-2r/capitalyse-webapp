<template >
        <td class="portfolioNameTd">
            <router-link class="portfolioName" :to="'/dashboard/' + portfolio.id">
                {{ portfolio.portfolioName }}
            </router-link>
        </td>
        <td class="dateAdded">
            {{ portfolioDate() }}
        </td>
        <td class="fileSize">
            {{ transactionsFileSize }}
        </td>
        <td class="fileSize">
            {{ accountFileSize }} 
        </td>
        <td class="actionsTd">
            <!-- <Icon icon="fluent:new-16-filled" color="var(--clr-blue)" height="22" class="actionBtn"/> -->
            <!-- <Icon icon="ci:edit"  height="22" color="orange" class="actionBtn"/> -->
            <Icon icon="bxs:trash" color="var(--clr-red)" height="22" class="actionBtn" @click="$emit('toggleDeletePopup', portfolio.id)"/>
        </td>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
    components: {
        Icon,
    },
    emits: ['toggleDeletePopup'],
    props: {
        portfolio: {
            type: Object,
            required: true,
        },
    },
    computed: {
        totalDataPoints() {
            return this.portfolio.length;
        },
        transactionsFileSize() {
            return this.portfolio.transactionsFileSize ? Math.floor(this.portfolio.transactionsFileSize) + ' KB' : 'No data';
        },
        accountFileSize() {
            return this.portfolio.accountFileSize ? Math.floor(this.portfolio.accountFileSize) + ' KB' : 'No data';
        },
    },
    methods: {
        openPortfolio(id) {
            this.$router.push(`/portfolios/${id}`);
        },
        portfolioDate() {
            let dateTime = this.portfolio.addedAt;

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
                if(diffInDays === 1) {
                    return 'Yesterday';
                } else {
                    return diffInDays + ' day' + (diffInDays > 1 ? 's' : '') + ' ago';
                }
            } else {
                return newDate;
            }
        },
    },
}
</script>

<style scoped>


.actionsTd {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 0;
    padding-left: 0;
}

.actionBtn {
    margin-left: 0.5rem;
    transition: 0.2s all;
    border-radius: 1000rem;
}

.actionBtn:hover {
    cursor: pointer;
    background-color: rgb(245, 248, 252);
    transform: scale(1.06)
}

.portfolioName {
    color: var(--clr-blue);
    text-decoration: none;
}

.portfolioName:hover {
    cursor: pointer;
    text-decoration:underline;
}

td {
    padding: 1.25rem 2rem;
    background-color: transparent;
    color: var(--clr-grey);
    font-weight: 400;
}


.slide-fade-enter-active {
  transition: all 0.1s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.1s ease-in;
}
.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}

@media screen and (max-width: 650px) {
    .fileSize {
        display: none;
    }
}

</style>
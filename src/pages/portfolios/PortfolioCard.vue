<template>
    <td>
        <router-link class="portfolioName" :to="'/dashboard/' + portfolio.id">
            {{ portfolio.portfolioName }}
        </router-link>
    </td>
    <td>
        {{ portfolio.addedAt }}
    </td>
    <td class="td__number">
        {{ transactionsFileSize }}
    </td>
    <td class="td__number">
        {{ accountFileSize }} 
    </td>
    <td class="threeDotsWrapper">
      
        <Icon @click="toggleOptionsMenu" icon="bi:three-dots-vertical" color="var(--clr-black)" height="15" class="threeDots"/>

        <section class="optionsMenuWrapper" :class="[{openOptionsMenu : isOptionsMenuOpen}]">
            <ul class="optionsMenu" :class="[{open : isOptionsMenuOpen}]">
                <li @click="updatePortfolio" class="updatePortfolioOption">
                    <Icon class="optionsMenu__icon" icon="fluent:new-16-filled" height="15"/>
                    Update Files
                </li>
                <li @click="editPortfolio" class="editPortfolioOption icon">
                    <Icon class="optionsMenu__icon"  icon="ic:baseline-edit" height="15" />
                    Edit Portfolio
                </li>
                <li @click="deletePortfolio" class="deletePortfolioOption icon">
                    <Icon class="optionsMenu__icon"  icon="ic:baseline-delete" height="15" />
                    Delete Portfolio
                </li>
               
            </ul>
        </section>
        <!-- <button @click="openPortfolio(portfolio.id)">Open</button> -->
    </td>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
    components: {
        Icon,
    },
    props: {
        portfolio: {
            type: Object,
            required: true,
        },
        
    },
    data() {
        return {
            isOptionsMenuOpen: {
                type: Boolean,
                default: false,
            },
        }
    },
    methods: {
        openPortfolio(id) {
            this.$router.push(`/portfolios/${id}`);
        },
        toggleOptionsMenu() {
            this.isOptionsMenuOpen = !this.isOptionsMenuOpen;
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
    created() {
        console.log(new Date());
    }
}
</script>

<style scoped>
.optionsMenuWrapper {
    position: absolute;
}

.openOptionsMenu {
    display: block !important;
}

.optionsMenu {
    display: none;
    position: absolute;
    top: 100%;
    left: -12rem;
    background-color: var(--clr-very-light-blue);
    width: 14rem;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: var(--card-border-radius);
    padding: 1rem;
    margin: 0px;
    list-style: none;
    z-index: 1;
    overflow: hidden;
    font-size: 1.1rem;
    transition: all 0.3s ease;
}

.optionsMenu li {
    display: flex;
    padding: 0.3rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 1rem;
    justify-content:baseline;
    align-items: center;
    transition: 0.1s all;
}

.optionsMenu li:hover {
    background-color: var(--clr-white);
}

.optionsMenu__icon {
    margin-right: 0.5rem;
}


.updatePortfolioOption {
    color: var(--clr-blue);
}
.editPortfolioOption {
    color: rgb(208, 151, 45);
}
.deletePortfolioOption {
    color: var(--clr-red);
}

.portfolioName {
    color: var(--clr-blue);
    font-weight: bold;
    text-decoration: none;
}

.portfolioName:hover {
    cursor: pointer;
    text-decoration: underline;
}

td {
    padding: 1rem 2rem;
    background-color: transparent;
    color: var(--clr-grey);
    font-weight: 400;
}

.td__number {
    text-align: right;
}

.threeDotsWrapper {
    width: 1px;
    padding: 1rem;
}

.threeDots {
    transition: 0.2s all;
    transform: scale(1.2);
}

.threeDots:hover {
    cursor: pointer;
 
}
</style>
<template>
    <p class="breadcrumbs u-flex-align-center">
        <section class="linkPart">
            <router-link class="u-margin-right" :to="baseLink">{{ baseLinkName }}</router-link>
        </section>
        <section class="linkPart">
            <Icon class="u-margin-right" icon="ep:arrow-right" color="var(--clr-grey)" height="12" />
            <router-link class="u-margin-right" :to="secondLink">{{ secondLinkName }}</router-link>
        </section>
        <section class="linkPart">
            <Icon v-if="thirdLink !== ''" class="u-margin-right" icon="ep:arrow-right" color="var(--clr-grey)" height="12" />
            <router-link v-if="thirdLink !== ''" class="u-margin-right" :to="thirdLink">{{ thirdLinkName }}</router-link>
        </section>
    </p>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
    name: 'Breadcrumbs',
    props: {
        baseLink: {
            type: String,
            default: '/dashboard',
        },
        baseLinkName: {
            type: String,
            default: '',
        },
        secondLink: {
            type: String,
            default: '#',
        },
        secondLinkName: {
            type: String,
            default: '',
        },
        thirdLink: {
            type: String,
            default: '',
        },
        thirdLinkName: {
            type: String,
            default: '',
        },
    },
    components: {
		Icon,
	},
}
</script>

<style scoped>
.linkPart {
    display:block;
}

.u-margin-right {
    margin-right: 0.4rem;
}

.breadcrumbs {
    display: flex;
    color: var(--clr-grey);
    font-weight: 400;
    font-size: 0.85rem;
}

.breadcrumbs > * {
    display: inline-block;
}

.u-flex-align-center {
    display: flex;
    align-items: center;
}

.breadcrumbs a {
    color: var(--clr-grey);
    text-decoration: none;
}

.breadcrumbs a:hover {
    text-decoration: underline;
}

.imagewrapper {
    display: flex;
    align-items: center;
}

img {
    margin-left: 0.3rem;
    margin-right: 0.3rem;
    height: 0.65rem;
}

@media screen and (max-width: 500px) {
    .breadcrumbs {
        display: inline;
    }
}
</style>
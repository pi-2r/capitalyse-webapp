<template>
    <p class="breadcrumbs u-flex-align-center">
        <router-link class="u-margin-right" :to="baseLink">{{ baseLinkName }}</router-link>
        
        <Icon class="u-margin-right" icon="ep:arrow-right" color="var(--clr-grey)" height="15" />

        <router-link class="u-margin-right" :to="secondLink">{{ secondLinkName }}</router-link>

        <section class="u-flex-align-center" v-if="thirdLink !== ''">

            <Icon class="u-margin-right" icon="ep:arrow-right" color="var(--clr-grey)" height="15" />

            <router-link class="u-margin-right" :to="thirdLink">{{ thirdLink }}</router-link>

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
            default: 'First link',
        },
        secondLink: {
            type: String,
            default: '#',
        },
        secondLinkName: {
            type: String,
            default: 'Second link',
        },
        thirdLink: {
            type: String,
            default: '',
        },
        thirdLinkName: {
            type: String,
            default: 'Third link',
        },
    },
    components: {
		Icon,
	},
}
</script>

<style scoped>
.u-margin-right {
    margin-right: 0.4rem;
}

.breadcrumbs {
    display: flex;
    color: var(--clr-grey);
    font-weight: 300;
   
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
</style>
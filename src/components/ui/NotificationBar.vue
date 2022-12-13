<template>
        <section class="bottomNotifBar__container" v-if="isVisible" :key="isVisible">
            <section class="bottomNotifBar" :class="type">
                <section class="bottomNotifBar__text">
                    <slot></slot>
                    {{ message }}
                </section>
                <section class="bottomNotifBar__close" >
                    <Icon @click="close" class="bottomNotifBar__closeIcon" icon="ep:close-bold" height="25" />
                </section>
            </section>
        </section>
</template>
<script>
import { Icon } from '@iconify/vue';

export default {
    components: {
        Icon,
    },
    name: 'BottomNotifBar',
    props: {
        message: {
            type: String,
            required: true,
            default: 'No message provided',
        },
        type: {
            type: String,
            required: true,
            default: 'success',
        },
    },
    data() {
        return {
            isVisible: true,
        }
    },
    methods: {
        close() {
            this.isVisible = false;
        },
    },
}
</script>
<style scoped>
.info {
    background-color: var(--clr-light-blue);
    border: 2px solid var(--clr-blue);
    color: var(--clr-blue);
}

.success {
    background-color: var(--clr-very-light-blue);
    border: 2px solid var(--clr-green);
    color: var(--clr-green);
}

.error {
    background-color: var(--clr-very-light-blue);
    border: 2px solid var(--clr-red);
    color: var(--clr-red);
}

.bottomNotifBar__container {
   display: flex;
    justify-content: center;
}

.bottomNotifBar {
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    bottom: 1.5rem;
    width: 40rem;
    max-width: 90%;
    min-height: 4rem;
    z-index: 100;
    border-radius: var(--btn-radius);
}

.bottomNotifBar__text {
    padding: 1rem;
}

.bottomNotifBar__close {
    padding: 0 1rem;
    display: flex;
    align-items: center;
}

.bottomNotifBar__closeIcon {
    margin-left: 0.5rem;
    border-radius: 0.2rem;
    transition: 0.15s all;
}

.bottomNotifBar__closeIcon:hover {
    cursor: pointer;
    transform: scale(1.02);
}


@media screen and (max-width: 400px) {
    .bottomNotifBar__container {
        height: 4rem;
    }
}
    
</style>
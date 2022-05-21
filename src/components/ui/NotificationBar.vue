<template>
    <transition name="slide-fade" mode="out-in">
        <section class="bottomNotifBar__container" v-if="isVisible">
            <section class="bottomNotifBar" :class="type">
                <section class="bottomNotifBar__text">
                    {{ message }}
                </section>
                <section class="bottomNotifBar__close" >
                    <Icon @click="close" class="bottomNotifBar__closeIcon" icon="ep:close-bold" height="20" />
                </section>
            </section>
        </section>
    </transition>
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
            isVisible: false,
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
    background-color: rgba(0, 187, 255, 0.1);
    border: 1px solid var(--clr-blue);
    color: var(--clr-blue);
}

.success {
    background-color: rgba(0, 255, 115, 0.1);
    border: 1px solid var(--clr-green);
    color: var(--clr-green);
}

.error {
    background-color: rgba(255, 0, 0, 0.1);
    border: 1px solid var(--clr-red);
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
    width: 30rem;
    max-width: 90%;
    height: 4rem;
    z-index: 100;
    border-radius: var(--btn-radius);
}

.bottomNotifBar__text {
    padding: 0 1rem;
}

.bottomNotifBar__close {
    padding: 0 1rem;
    display: flex;
    align-items: center;
}

.bottomNotifBar__closeIcon {
    margin-left: 0.5rem;
    border-radius: 0.2rem;
    transition: 0.2s all;
}

.bottomNotifBar__closeIcon:hover {
    cursor: pointer;
    transform: scale(1.02);
}

/* anims */
.slide-fade-enter-active {
    transition: all .25s ease-in-out;
}
.slide-fade-leave-active {
    transition: all .25s ease-in-out;
}
.slide-fade-enter-from {
    opacity: 0;
}

.slide-fade-leave-to {
    opacity: 0;
}

@media screen and (max-width: 400px) {
    .bottomNotifBar__container {
        height: 4rem;
    }
}
    
</style>
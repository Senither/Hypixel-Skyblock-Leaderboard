<template>
    <transition
        :name="transitionName"
        :mode="'out-in'"
        :enter-active-class="transitionEnterActiveClass"
        @beforeLeave="beforeLeave"
        @enter="enter"
        @afterEnter="afterEnter"
    >
        <slot />
    </transition>
</template>

<script>
    export default {
        props: {
            type: String,
        },
        mounted() {
            this.transitionName = this.type ?? 'fade-from-bottom';
            this.transitionEnterActiveClass = `${this.transitionName}-enter-active`;
        },
        data() {
            return {
                prevHeight: 0,
                transitionName: 'fade-from-bottom',
                transitionEnterActiveClass: '',
            };
        },
        methods: {
            beforeLeave(element) {
                this.prevHeight = getComputedStyle(element).height;
            },
            enter(element) {
                const { height } = getComputedStyle(element);

                element.style.height = this.prevHeight;

                setTimeout(() => {
                    element.style.height = height;
                });
            },
            afterEnter(element) {
                element.style.height = 'auto';
            },
        },
    };
</script>

<style lang="scss" scoped>
    // Fade animation
    .fade-from-bottom-enter-active,
    .fade-from-bottom-leave-active {
        transition-duration: .3s;
        transition-property: height, opacity, transform;
        transition-timing-function: ease-out-in;
        overflow: hidden;
    }

    .fade-from-bottom-enter,
    .fade-from-bottom-leave-active {
        opacity: 0;
        transform: translate3d(0, 25px, 0);
    }

    // Slide animation
    .slide-from-bottom-enter-active,
    .slide-from-bottom-leave-active {
        transition-duration: 1.5s;
        transition-property: height, opacity, transform;
        transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
        overflow: hidden;
    }

    .slide-from-bottom-leave-active {
        opacity: 0;
        transform: translate(0, -10em);
    }

    .slide-from-bottom-enter {
        opacity: 0;
        transform: translate(0, 10em);
    }
</style>

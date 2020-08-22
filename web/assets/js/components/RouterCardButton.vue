<template>
    <div
        @click="onClick"
        class="card"
        :style="{
            cursor: this.goTo == null ? 'no-drop' : 'pointer'
        }"
    >
        <div class="card-content has-text-centered">
            <p class="subtitle">
                <i :class="icon" class="card-icon"></i>
            </p>
            <p class="title">
                {{ name }}
            </p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .card {
        padding-top: 16%;
        padding-bottom: 16%;

        & .card-icon {
            font-size: 5rem;
        }
    }
</style>

<script>
    export default {
        props: {
            icon: String,
            name: String,
            goTo: String,
        },
        methods: {
            onClick() {
                if (this.goTo != null) {
                    this.$router.push({ name: this.goTo });
                }
            }
        }
    }
</script>

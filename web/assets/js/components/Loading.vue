<template>
    <div class="columns">
        <div class="column has-text-centered">
            <p class="button is-loading is-fullheight"></p>
            <p class="text" v-if="message != null">{{ message }}</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .is-loading {
        font-size: 30.5vh;
        border-color: rgba(0, 0, 0, 0);
        background-color: rgba(0, 0, 0, 0);
    }
    .text {
        font-size: 2.5vh;
        margin-top: -20vh;
    }
</style>

<script>
    export default {
        props: {
            message: String
        }
    }
</script>

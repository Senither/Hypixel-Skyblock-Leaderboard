<template>
    <div>
        <section class="hero has-text-centered has-no-background">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        {{ guild.name }} Metrics
                    </h1>

                    <div class="is-centered" style="display: flex">
                        <div class="field is-grouped is-centered is-grouped-multiline" style="margin: auto">
                            <div class="control">
                                <div class="tags has-addons">
                                    <span class="tag is-dark">Average Skill Progress</span>
                                    <span class="tag is-info">{{ guild.average_skill_progress }}</span>
                                </div>
                            </div>
                            <div class="control">
                                <div class="tags has-addons">
                                    <span class="tag is-dark">Average Skill</span>
                                    <span class="tag is-primary">{{ guild.average_skill }}</span>
                                </div>
                            </div>
                            <div class="control">
                                <div class="tags has-addons">
                                    <span class="tag is-dark">Slayer</span>
                                    <span class="tag is-danger">{{ formatNumber(guild.average_slayer) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 class="subtitle">
                        <a href="#"><i class="fas fa-arrow-alt-circle-left"></i> Return to guild list</a>
                    </h2>
                </div>
            </div>
        </section>

        <loading
            v-if="isLoading"
            :message="'Loading metrics & players data...'"
        />
    </div>
</template>

<script>
    import Loading from '../../components/Loading';

    import Store from '../../store';

    export default {
        components: {
            Loading,
        },
        mounted() {
            // TODO: Load player data here...
        },
        data() {
            return {
                isLoading: true,
            };
        },
        computed: {
            guild() {
                const id = this.$route.params.id;

                let guild = Store.get('guilds').filter(guild => {
                    return guild.id == id;
                });
                return guild.length == 0 ? null : guild[0];
            }
        }
    }
</script>

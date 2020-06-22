<template>
    <div>
        <section class="hero has-text-centered has-no-background">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        Hypixel Guild Leaderboard
                    </h1>
                    <h2 class="subtitle">
                        Currently tracking {{ formatNumber(stats.guilds) }} guilds with {{ formatNumber(stats.players) }} members!
                    </h2>
                </div>
            </div>
        </section>

        <div class="columns">
            <div class="column">
                <div class="box">
                    <table class="table is-striped is-hoverable is-fullwidth">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Members</th>
                                <th>Average Skills</th>
                                <th>Average Slayer</th>
                                <th>Last updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(guild, index) of guilds" @click="clickGuild(guild)">
                                <th>{{ index + 1 }}</th>
                                <td>{{ guild.name }}</td>
                                <td>
                                    <span class="tag is-warning">{{ guild.members }}</span>
                                </td>
                                <td>
                                    <div class="tags has-addons">
                                        <span class="tag is-info">{{ formatNumber(guild.average_skill_progress) }}</span>
                                        <span class="tag is-primary">{{ formatNumber(guild.average_skill) }}</span>
                                    </div>
                                </td>
                                <td>
                                    <span class="tag is-danger">{{ formatNumber(guild.average_slayer) }}</span>
                                </td>
                                <td>{{ guild.last_updated_at }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    tbody > tr {
        cursor: pointer;
    }
</style>

<script>
    import Store from '../../store';
    import moment from 'moment';

    export default {
        methods: {
            clickGuild(guild) {
                console.log(guild);
            }
        },
        computed: {
            stats() {
                return Store.get('stats');
            },
            guilds() {
                return Store.get('guilds').sort((v1, v2) => {
                    return v2.average_skill_progress - v1.average_skill_progress;
                }).map(guild => {
                    guild.last_updated_at = moment(guild.last_updated_at)
                        .toNow()
                        .split(' ')
                        .splice(1)
                        .join(' ') + ' ago';

                    return guild;
                });
            }
        }
    }
</script>

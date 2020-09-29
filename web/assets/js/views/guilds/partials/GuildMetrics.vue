<template>
    <loading
        v-if="isLoading"
        :message="'Loading metrics data...'"
    />

    <div v-else>
        <div class="columns">
            <div class="column has-text-centered">
                <h4 class="subtitle is-4">Skill Metrics</h4>

                <line-chart
                    v-if="this.sevenDaysSkillsMetrics.length > 0"
                    :name="'Average Skills (Last 7 days)'"
                    :type="'Average Skills'"
                    :keys="this.sevenDaysDates"
                    :values="this.sevenDaysSkillsMetrics"
                />

                <line-chart
                    v-if="this.monthSkillsMetrics.length > 7"
                    :name="'Average Skills (Last 30 days)'"
                    :type="'Average Skills'"
                    :keys="this.monthDates"
                    :values="this.monthSkillsMetrics"
                />

                <line-chart
                    v-if="this.quarterSkillsMetrics.length > 30"
                    :name="'Average Skills (90 Days)'"
                    :type="'Average Skills'"
                    :keys="this.quarterDates"
                    :values="this.quarterSkillsMetrics"
                />
            </div>
            <div class="column has-text-centered">
                <h4 class="subtitle is-4">Slayer Metrics</h4>

                <line-chart
                    v-if="this.sevenDaysSlayersMetrics.length > 0"
                    :name="'Average Slayers (Last 7 days)'"
                    :type="'Average Slayers'"
                    :keys="this.sevenDaysDates"
                    :values="this.sevenDaysSlayersMetrics"
                />

                <line-chart
                    v-if="this.monthSlayersMetrics.length > 7"
                    :name="'Average Slayers (Last 30 days)'"
                    :type="'Average Slayers'"
                    :keys="this.monthDates"
                    :values="this.monthSlayersMetrics"
                />

                <line-chart
                    v-if="this.quarterSlayersMetrics.length > 30"
                    :name="'Average Slayers (90 Days)'"
                    :type="'Average Slayers'"
                    :keys="this.quarterDates"
                    :values="this.quarterSlayersMetrics"
                />
            </div>
        </div>

        <div class="columns">
            <div class="column has-text-centered">
                <h4 class="subtitle is-4">Catacombs Metrics</h4>

                <line-chart
                    v-if="this.sevenDaysCatacombMetrics.length > 0"
                    :name="'Average Catacomb (Last 7 days)'"
                    :type="'Average Catacomb'"
                    :keys="this.sevenDaysDates"
                    :values="this.sevenDaysCatacombMetrics"
                />

                <line-chart
                    v-if="this.monthCatacombMetrics.length > 7"
                    :name="'Average Catacomb (Last 30 days)'"
                    :type="'Average Catacomb'"
                    :keys="this.monthDates"
                    :values="this.monthCatacombMetrics"
                />

                <line-chart
                    v-if="this.quarterCatacombMetrics.length > 30"
                    :name="'Average Catacomb (90 Days)'"
                    :type="'Average Catacomb'"
                    :keys="this.quarterDates"
                    :values="this.quarterCatacombMetrics"
                />
            </div>

            <div class="column has-text-centered">
                <h4 class="subtitle is-4">Member & Weight Metrics</h4>

                <line-chart
                    v-if="this.quarterMembersMetrics.length > 1"
                    :name="'Average Members (90 Days)'"
                    :type="'Average Members'"
                    :keys="this.quarterDates"
                    :values="this.quarterMembersMetrics"
                />


                <line-chart
                    v-if="this.sevenDaysWeightMetrics.length > 1"
                    :name="'Guild Weight (7 Days)'"
                    :type="'Guild Progress Weight'"
                    :keys="this.sevenDaysDates"
                    :values="this.sevenDaysWeightMetrics"
                />

                <line-chart
                    v-if="this.quarterWeightMetrics.length > 7"
                    :name="'Guild Weight (90 Days)'"
                    :type="'Guild Progress Weight'"
                    :keys="this.quarterDates"
                    :values="this.quarterWeightMetrics"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import LineChart from '@components/LineChart';
    import Loading from '@components/Loading';
    import moment from 'moment';

    export default {
        props: {
            id: String,
        },
        components: {
            LineChart,
            Loading,
        },
        mounted() {
             axios.get(`/metrics/${this.id}`).then(response => {
                this.metrics = response.data.data;

                this.getItemsFromMetrics(7).forEach(metric => {
                    this.sevenDaysDates.push(moment(metric.created_at).format("DD MMM YYYY - hh:mm"));

                    this.sevenDaysSkillsMetrics.push(metric.average_skill_progress);
                    this.sevenDaysSlayersMetrics.push(metric.average_slayer);
                    this.sevenDaysCatacombMetrics.push(metric.average_catacomb);
                    this.sevenDaysWeightMetrics.push(metric.weight.total);
                });

                this.getItemsFromMetrics(30).forEach(metric => {
                    this.monthDates.push(moment(metric.created_at).format("DD MMM YYYY - hh:mm"));

                    this.monthSkillsMetrics.push(metric.average_skill_progress);
                    this.monthSlayersMetrics.push(metric.average_slayer);
                    this.monthCatacombMetrics.push(metric.average_catacomb);
                });

                this.getItemsFromMetrics(90).forEach(metric => {
                    this.quarterDates.push(moment(metric.created_at).format("DD MMM YYYY - hh:mm"));

                    this.quarterSkillsMetrics.push(metric.average_skill_progress);
                    this.quarterSlayersMetrics.push(metric.average_slayer);
                    this.quarterCatacombMetrics.push(metric.average_catacomb);
                    this.quarterMembersMetrics.push(metric.members);
                    this.quarterWeightMetrics.push(metric.weight.total);
                });

                this.sevenDaysDates.reverse();
                this.monthDates.reverse();
                this.quarterDates.reverse();

                this.isLoading = false;
            });
        },
        data() {
            return {
                isLoading: true,
                metrics: null,
                sevenDaysDates: [],
                monthDates: [],
                quarterDates: [],
                sevenDaysSkillsMetrics: [],
                monthSkillsMetrics: [],
                quarterSkillsMetrics: [],
                sevenDaysSlayersMetrics: [],
                monthSlayersMetrics: [],
                quarterSlayersMetrics: [],
                sevenDaysCatacombMetrics: [],
                monthCatacombMetrics: [],
                quarterCatacombMetrics: [],
                quarterMembersMetrics: [],
                sevenDaysWeightMetrics: [],
                quarterWeightMetrics: [],
            };
        },
        methods: {
            getItemsFromMetrics(amount = 999999999) {
                let items = [];
                for (let i = 0; i < Math.min(amount, this.metrics.length); i++) {
                    items.push(this.metrics[i]);
                }
                return items;
            }
        },
    }
</script>

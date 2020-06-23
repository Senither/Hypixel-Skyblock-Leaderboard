<template>
    <apex-chart v-if="! isLoading"
        type="line"
        height="350"
        :options="options"
        :series="series"
    />
    <div v-else>Loading...</div>
</template>

<script>
    import ApexChart from 'vue-apexcharts'

    export default {
        components: {
            ApexChart,
        },
        props: {
            name: String,
            type: String,
            keys: Array,
            values: Array,
        },
        mounted() {
            this.options.title.text = this.name;
            this.options.yaxis.title.text = this.type;

            this.options.yaxis.min = Math.min.apply(Math, this.values) * 0.99;
            this.options.yaxis.max = Math.max.apply(Math, this.values) * 1.01;

            this.options.xaxis.categories = this.keys.reverse();
            this.series[0].data = this.values.reverse();

            this.isLoading = false;
        },
        data() {
            return {
                isLoading: true,
                series: [
                    {
                        name: '',
                        data: []
                    },
                ],
                options: {
                    chart: {
                        height: 350,
                        type: 'line',
                        toolbar: {
                            show: false
                        },
                        zoom: {
                            enabled: false,
                        }
                    },
                    colors: ['#209CEE'],
                    dataLabels: {
                        enabled: false,
                        colors: ['#000']
                    },
                    stroke: {
                        curve: 'straight'
                    },
                    title: {
                        text: 'Loading',
                        align: 'center'
                    },
                    grid: {
                        borderColor: '#375A7F',
                        row: {
                            colors: ['#f3f3f3', 'transparent'],
                            opacity: 0.2
                        },
                    },
                    markers: {
                        size: 1,
                        colors: ['#375A7F']
                    },
                    xaxis: {
                        categories: [],
                        title: {
                            text: 'Dates & Times'
                        },
                        labels: {
                            show: false,
                        },
                    },
                    yaxis: {
                        title: {
                            text: 'Loading'
                        },
                        min: 5,
                        max: 40
                    },
                    legend: {
                        position: 'bottom',
                        horizontalAlign: 'right',
                        floating: true,
                        offsetY: -25,
                        offsetX: -5
                    },
                    tooltip: {
                        theme: 'dark',
                    }
                },
            };
        }
    }
</script>

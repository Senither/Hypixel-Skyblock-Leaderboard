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
            values: [Array, Object],
        },
        mounted() {
            this.options.title.text = this.name;
            this.options.yaxis.title.text = this.type;

            this.options.xaxis.categories = this.keys.reverse();

            if (Array.isArray(this.values)) {
                this.options.yaxis.min = Math.min.apply(Math, this.values) * 0.99;
                this.options.yaxis.max = Math.max.apply(Math, this.values) * 1.01;

                this.series[0].data = this.values.reverse();
            } else {
                let totalValues = [];
                let localSeries = [];

                for (let name of Object.keys(this.values)) {
                    totalValues = totalValues.concat(this.values[name]);

                    localSeries.push({
                        name: name,
                        data: this.values[name].reverse()
                    });
                }

                this.series = localSeries;

                this.options.yaxis.min = Math.min.apply(Math, totalValues.filter(v => v != null)) * 0.99;
                this.options.yaxis.max = Math.max.apply(Math, totalValues.filter(v => v != null)) * 1.01;
            }


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
                        },
                        animations: {
                            dynamicAnimation: {
                                enabled: true,
                            }
                        }
                    },
                    colors: ['#209CEE', '#EE2020', '#20EE38', '#E7EE20', '#8B20EE'],
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
                        labels: {
                            formatter: value => {
                                if (value == null) {
                                    return 'No data';
                                }

                                let parts = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',').split('.');
                                if (parts[0].length > 3 || parts.length == 1) {
                                    return parts[0];
                                }
                                return parts[0] + '.' + parts[1].substr(0, 2);
                            },
                        },
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

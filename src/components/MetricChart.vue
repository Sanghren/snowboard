<template>
    <v-card
            class="pa-2"
            outlined
            height="100%"
            tile
    >
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title class="headline">{{ metric.name }}</v-list-item-title>
            </v-list-item-content>
            <v-tooltip>
                <template v-slot:activator="{ on }">
                                <span v-on="on" class="material-icons">
                                    help_outline
                                </span>
                </template>
                <span>{{ metric.help }}</span>
            </v-tooltip>
        </v-list-item>
            <div v-if="metric.type === 'HISTOGRAM'">
                <histogram-chart :chartdata="{labels: Object.keys(metric.metrics[0].buckets),
                datasets: [
      {
        label: metric.name,
        data: Object.values(metric.metrics[0].buckets)
      }
    ]}">
                </histogram-chart>
            </div>
            <div v-if="metric.type === 'GAUGE'">
                <doughnut-chart :chartdata="{
                labels: [ metric.name, 'unused'],
                datasets: [
      {
        label: ['value', 'unused'],
        backgroundColor: ['#008000', '#ff0000'],
        data: [metric.metrics[0].value, 100 - metric.metrics[0].value]
      }
    ]}"></doughnut-chart>
            </div>
            <div v-if="metric.type === 'COUNTER'">
                <v-card-text>
                    <p class="display-1 text--primary text-center">
                        {{ Object.values(metric.metrics[0])[0] }}
                    </p>
                </v-card-text>
            </div>
            <div v-else>
            </div>
    </v-card>
</template>

<script>
    import HistogramChart from "@/components/HistogramChart.vue";
    import DoughnutChart from "@/components/DoughnutChart.vue";

    export default {
        name: "MetricChart",
        components: {DoughnutChart, HistogramChart},
        props: ["metric"],
        methods: {}
    };
</script>

<style scoped>
</style>
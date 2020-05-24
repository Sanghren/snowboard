<template>
    <v-container class="#121212 lighten-5">
        <v-row no-gutters
               v-for="(metric, index) in this.$store.state.Metrics.metrics"
               :key="index"
        >
            <v-col :key="index">
                <v-card
                        class="pa-2"
                        outlined
                        tile
                >
                    <div v-if="metric.type === 'HISTOGRAM'">
                        <p><b>{{metric.help}}</b></p>
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
                        <p><b>{{metric.help}}</b></p>
                        <doughnut-chart :chartdata="{
                labels: [ metric.name, 'unused'],
                datasets: [
      {
        label: ['value', 'unused'],
        backgroundColor: ['#c61616', 'rgb(21,248,0)'],
        data: [metric.metrics[0].value, 100 - metric.metrics[0].value]
      }
    ]}"></doughnut-chart>
                    </div>
                    <div v-if="metric.type === 'COUNTER'">
                        <p><b>{{metric.help}}</b></p>
                        <p>Name : {{ metric.name }}</p>
                        <p>Value : {{ Object.values(metric.metrics[0])[0] }}</p>
                    </div>
                    <div v-else>
                    </div>
                </v-card>
            </v-col>
            <v-responsive
                    v-if="index === 2"
                    :key="`width-${index}`"
                    width="100%"
            ></v-responsive>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import HistogramChart from "@/components/HistogramChart.vue";
    import DoughnutChart from "@/components/DoughnutChart.vue";
    @Component({
        components: {DoughnutChart, HistogramChart}
    })
    export default class Dashboard extends Vue {
        @Prop() private msg!: string;
        @Prop() private metrics!: any[];

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>

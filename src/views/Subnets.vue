<template>
    <v-container>
        <v-row>
            <v-col class="text-center headline">
                {{ subnetsId.length }} Subnets
            </v-col>
        </v-row>
        <v-row>
            <v-col
                    xs="12"
                    md="6"
            >
                <v-select
                        v-model="selectedSubnet"
                        :items="subnetsId"
                        label="Subnet"
                        @change="fetchInfo()"
                        dense
                        class="text-center"
                ></v-select>
            </v-col>
            <v-col
                    xs="12"
                    md="6"
                    class="text-center"
            >
                Validators :<br/> {{ subnetValidators.length }}

            </v-col>
        </v-row>
        <v-row v-if="fetchCurrentSubnetValidatingStatus() !== undefined">
            <v-col
                    xs="12"
                    md="6"
                    class="text-center"
            >
                Your are currently validating this subnet !
            </v-col>
            <v-col
                    xs="12"
                    md="6"
                    class="text-center"
            >
                Start : <br/> {{ new Date(fetchCurrentSubnetValidatingStatus().startTime * 1000) }}
            </v-col>
            <v-col
                    xs="12"
                    md="6"
                    class="text-center"
            >
                End : <br/> {{ new Date(fetchCurrentSubnetValidatingStatus().endTime * 1000) }}
            </v-col>
            <v-col
                    xs="12"
                    md="6"
                    class="text-center"
            >
                Address : <br/> P-{{ fetchCurrentSubnetValidatingStatus().address }}
            </v-col>
            <v-col
                    xs="12"
                    md="6"
                    class="text-center"
            >
                Stake : <br/> {{ fetchCurrentSubnetValidatingStatus().stakeAmount }} nAVAX
            </v-col>
        </v-row>
<!--        <v-row v-else>-->
<!--            <v-col class="text-center">-->
<!--                <v-btn>Start staking</v-btn>-->
<!--            </v-col>-->
<!--        </v-row>-->
    </v-container>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Subnets, SubnetsMapper} from "@/store/modules/subnets.store";
    import {Validator} from '@/types';

    export default Vue.extend({
        data() {
            return {
                selectedSubnet: "11111111111111111111111111111111LpoYY"
            }
        },
        computed:
            SubnetsMapper.mapGetters([
                'subnetsId',
                'subnetValidators',
            ])
        ,
        async beforeMount() {
            const ctx = Subnets.context(this.$store);
            await ctx.actions.listSubnets()
            await ctx.actions.fetchSubnetCurrentValidators(this.selectedSubnet)
            await ctx.getters.subnetValidatingInfo(this.selectedSubnet)
        },
        methods: {
            async fetchInfo() {
                const subnetCtx = Subnets.context(this.$store);
                await subnetCtx.actions.fetchSubnetCurrentValidators(this.selectedSubnet)
            },
            fetchCurrentSubnetValidatingStatus(): Validator | undefined {
                const subnetCtx = Subnets.context(this.$store);
                const test = subnetCtx.getters.subnetValidatingInfo(this.selectedSubnet)
                return test;
            }
        }
    })
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .node-status-green-background {
        background-color: green;
    }

    .node-status-red-background {
        background-color: red;
    }

    .node-status-orange-background {
        background-color: orange;
    }

    .node-status-green-text-color {
        color: green;
    }

    .node-status-red-text-color {
        color: red;
    }

    .node-status-orange-text-color {
        color: orange;
    }
</style>

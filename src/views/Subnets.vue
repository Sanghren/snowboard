<template>
    <v-container>
        <v-row>
            <v-col>
                There are {{ subnetsId.length }} subnets
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-select
                        v-model="selectedSubnet"
                        :items="subnetsId"
                        label="Subnet"
                        @change="fetchInfo()"
                        dense
                ></v-select>
            </v-col>
        </v-row>
        <v-row>
            <v-col
                    xs="12"
                    md="6"
            >
                Validators : {{ subnetValidators.length }}
            </v-col>
            <v-col
                    xs="12"
                    md="6"
            >
                End Date
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Subnets, SubnetsMapper} from "@/store/modules/subnets.store";

    export default Vue.extend({
        data() {
            return {
                selectedSubnet: "11111111111111111111111111111111LpoYY"
            }
        },
        computed:
            SubnetsMapper.mapGetters([
                'subnetsId',
                'subnetValidators'
            ])
        ,
        beforeMount() {
            const ctx = Subnets.context(this.$store);
            ctx.actions.listSubnets()
        },
        methods: {
            async fetchInfo(){
                console.log(this.selectedSubnet)
                const ctx = Subnets.context(this.$store);
                ctx.getters.isValidator
                await ctx.actions.fetchSubnetCurrentValidators(this.selectedSubnet)
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

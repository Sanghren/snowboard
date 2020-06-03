<template>
    <div>
        <h1 class="text-lg-center">Settings</h1>
        <v-form
                ref="form"
                v-model="valid"
                lazy-validation
        >
            <v-container>
                <v-row>
                    <v-col
                            cols="12"
                            md="4"
                    >
                        <div>Current node is : {{ currentNodeUrl }}</div>

                        <v-text-field
                                v-model="protocol"
                                placeholder="http"
                                :rules="[rules.required, rules.http]"
                                label="Http / Https"
                                outline
                        ></v-text-field>
                        <v-text-field
                                v-model="host"
                                placeholder="localhost / 127.0.01"
                                :rules="[rules.required]"
                                label="Gecko node hostname or ip"
                                outline
                        ></v-text-field>
                        <v-text-field
                                v-model="port"
                                placeholder="9250"
                                :rules="[rules.required, rules.number]"
                                label="Gecko node port"
                                outline
                        ></v-text-field>
                        <v-text-field
                                v-model="chainId"
                                placeholder="X"
                                :rules="[rules.required]"
                                label="Chain Id"
                                outline
                        ></v-text-field>
                        <v-text-field
                                v-model="networkId"
                                :rules="[rules.required]"
                                placeholder="2"
                                label="Network Id"
                                outline
                        ></v-text-field>

                    </v-col>
                    <v-col
                            cols="12"
                            md="4"
                    >
                        <b><span>Be aware that if you are using snowboard on heroku, you will not be able to view the data from a node that is not accessible via https (browser restriction).</span></b><br/>
                        <span>If you are in that case, better to run snowboard locally, go check the github repo !</span>
                    </v-col>
                </v-row>
                <v-btn
                        :disabled="!valid"
                        @click="validate"
                        color="primary" dark
                        class="mr-4"
                >
                    Save
                </v-btn>
            </v-container>
        </v-form>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Dashboard} from "@/store/modules/dashboard.store";
    import {Api} from "@/store/modules/api.store";
    import {Health} from "@/store/modules/health.store";

    export default Vue.extend({
        data() {
            return {
                protocol: "",
                host: "",
                port: "",
                chainId: "",
                networkId: "",
                valid: true,
                rules: {
                    required: (value: any) => !!value || 'Required.',
                    http: (v: any) => (v === 'http' || v === 'https') || 'Must be either http or https',
                    number: (v: any) => parseInt(v) || 'must be a number',
                },
                currentNodeUrl: "",
            }
        },
        computed: {
            form(): Vue & { validate: () => boolean } {
                return this.$refs.form as Vue & { validate: () => boolean }
            }
        },
        beforeMount() {
            this.currentNodeUrl = this.$store.getters["Api/getNodeUrl"]
        },
        methods: {
            updateSettings() {
                const apiCtx = Api.context(this.$store);
                const healtCtx = Health.context(this.$store);

                apiCtx.actions.changeNodeUrl(
                    {
                        nodeUrl: this.host,
                        protocol: this.protocol,
                        chainId: this.chainId,
                        nodePort: this.port,
                        networkId: this.networkId
                    }
                )

                this.currentNodeUrl = apiCtx.getters.nodeUrl
                healtCtx.actions.fetchLiveness()
                //ToDo Somewhere we need to flush state
            },
            validate () {
                if (this.form.validate()) {
                    this.updateSettings()
                }
            }
        }
    })
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

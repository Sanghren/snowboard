<template>
    <div>
        <h1 class="text-lg-center">Settings</h1>
        <v-form>
            <v-container>
                <v-row>
                    <v-col
                            cols="12"
                            md="4"
                    >
                        <v-text-field
                                v-model="nodeUrl"
                                placeholder="localhost:9250"
                                label="Gecko node url"
                                required
                        ></v-text-field>

                    </v-col>
                    <v-col
                            cols="12"
                            md="4"
                    >
                        <span>By default we use the bootstrap node but you can set your own node.</span><br/>
                        <b><span>Be aware that if you are using snowboard on heroku, you will not be able to view the data from a node that is not accessible via https (browser restriction).</span></b><br/>
                        <span>If you are in that case, better to run snowboard locally, go check the github repo !</span>
                    </v-col>
                </v-row>
                <v-btn
                        color="success"
                        class="mr-4"
                        @click="updateSettings"
                >
                    Save
                </v-btn>
            </v-container>
        </v-form>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        props: {
            'nodeUrl': {
                required: false,
                default() {
                    return this.$store.state.nodeUrl;
                }
            }
        },
        methods: {
            updateSettings() {
                this.$store.dispatch('Metrics/updateSettings', this.nodeUrl)
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

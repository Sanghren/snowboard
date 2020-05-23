<template>
    <div>
        <h1>Settings</h1>
        <v-form v-model="valid">
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
                </v-row>
                <v-btn
                        color="success"
                        class="mr-4"
                        @click="updateSettings"
                >
                    Validate
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
                    return "";
                }
            }
        },
        methods: {
            updateSettings() {
                this.$store.commit('updateSettings', this.nodeUrl)
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

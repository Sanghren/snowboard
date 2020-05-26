<template>
    <div>
    <v-tooltip top>
        <template v-slot:activator="{ on }">
            <v-icon v-on="on" class="mr-2">fab fa-circle-notch fa-spin</v-icon>
        </template>
        <span>Bottom tooltip</span>
    </v-tooltip>
    {{ chainId }}
    </div>

</template>

<script>
    import {BlockchainStatus} from "../types";

    export default {
        name: "BlockchainStatusIcon",
        props: ["chainId", "status"],
        methods: {}
    };
</script>

<style scoped>
    button {
        background: lightsteelblue;
    }
</style>
<template>
    <div>
        <h1 class="text-lg-center">Blockchains</h1>
        <v-simple-table dense class="ml-5 mr-5">
            <thead>
            <tr>
                <th class="text-left">ID</th>
                <th class="text-left">Name</th>
                <th class="text-left">SubnetID</th>
                <th class="text-left">VmID</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="blockchain in this.$store.state.PChain.blockchains" :key="blockchain.id" class="mb-4">
                <td><BlockchainStatusIcon :chain-id="blockchain.id" :status="blockchain.status"></BlockchainStatusIcon></td>
                <td>{{ blockchain.name }}</td>
                <td>{{ blockchain.subnetID }}</td>
                <td>{{ blockchain.vmID }}</td>
            </tr>
            </tbody>
        </v-simple-table>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import BlockchainStatusIcon from "@/components/BlockchainStatus.vue";

    export default Vue.extend({
        components: {BlockchainStatusIcon},
        props: {},
        mounted() {
            this.$store.dispatch('PChain/fetchBlockchains')
        },
        methods: {}
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

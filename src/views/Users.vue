<template>
    <div>
        <h1>Users</h1>
        <v-simple-table>
            <thead>
            <tr>
                <th class="text-left">User</th>
                <th class="text-left">Export</th>
                <th class="text-left">Delete</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(user, index) in this.$store.state.Keystore.users" :key="index">
                <td>{{user}}</td>
                <td>BUTTON</td>
                <td>BUTTON</td>
            </tr>
            </tbody>
        </v-simple-table>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        beforeMount() {
            this.$store.dispatch('Keystore/fetchUsers');
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

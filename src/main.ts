import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store'
import axios from 'axios'
import vuetify from './plugins/vuetify';
import 'es6-promise/auto'
import {ValidationProvider} from 'vee-validate';
import VueClipboard from 'vue-clipboard2'
import DatetimePicker from 'vuetify-datetime-picker'

declare global {
    interface Window {
        VUE_APP_SNWBRD_BOOTSTRAP_HOST: string
        VUE_APP_SNWBRD_BOOTSTRAP_PROTOCOL: string
        VUE_APP_SNWBRD_BOOTSTRAP_CHAIN_ID: string
        VUE_APP_SNWBRD_BOOTSTRAP_PORT: string
        VUE_APP_SNWBRD_BOOTSTRAP_NETWORK_ID: string
        VUE_APP_SNWBRD_NODE_HOST: string
        VUE_APP_SNWBRD_NODE_PROTOCOL: string
        VUE_APP_SNWBRD_NODE_CHAIN_ID: string
        VUE_APP_SNWBRD_NODE_PORT: string
        VUE_APP_SNWBRD_NODE_NETWORK_ID: string
        VUE_APP_SNWBRD_DISABLED_KEYSTORE_CREATION: string
    }
}
Vue.use(VueClipboard)
Vue.use(DatetimePicker)

Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('ValidationProvider', ValidationProvider);
new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')

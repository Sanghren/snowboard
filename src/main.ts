import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store'
import axios from 'axios'
import vuetify from './plugins/vuetify';
import 'es6-promise/auto'
import {ValidationProvider} from 'vee-validate';

Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('ValidationProvider', ValidationProvider);
new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')

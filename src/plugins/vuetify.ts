import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
    },
    icons: {
        iconfont: 'fa',
    },
})

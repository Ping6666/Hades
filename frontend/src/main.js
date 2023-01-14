import '@babel/polyfill'
import 'mutationobserver-shim'
import './plugins/bootstrap-vue'

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(router);
app.mount('#app');

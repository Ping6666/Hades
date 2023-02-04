import { createStore } from 'vuex';

import ConnectionWorker from '@/javascript/ConnectionWorker'

const store = createStore({
    state: {
        auth_connection: new ConnectionWorker.AuthConnection(),
    },
    mutations: {
    },
});

export default store;

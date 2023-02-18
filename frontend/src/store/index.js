import { createStore } from 'vuex';

import ConnectionWorker from '@/javascript/ConnectionWorker'

const store = createStore({
    state: {
        auth_connection: new ConnectionWorker.AuthConnection(),
        db_connection: new ConnectionWorker.DatabaseConnection(),
    },
    mutations: {
    },
});

export default store;

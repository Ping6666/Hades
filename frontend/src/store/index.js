import { createStore } from 'vuex';

import ConnectionWorker from '@/javascript/ConnectionWorker'
import DatabaseWorker from '@/javascript/DatabaseWorker'

const store = createStore({
    state: {
        auth_connection: new ConnectionWorker.AuthConnection(),
        db_connection: new ConnectionWorker.DatabaseConnection(),
        db_struct: new DatabaseWorker.DatabaseStruct(
            [
                new DatabaseWorker.StructBase('search mode', 'or', ['and', 'or']),
                new DatabaseWorker.StructBase('display limit', 10, [10, 25, 50, 100]),
            ],
            [],
        ),
    },
    mutations: {
    },
});

export default store;

// workhouse

const _do_fetch = async function (url, method, mode, body,
    headers = { 'Content-Type': 'application/json' }
) {
    const init = {
        method: method,
        mode: mode,
    };

    if (headers) {
        init['headers'] = headers;
    }

    if (method === 'POST') {
        init['body'] = JSON.stringify(body);
    }

    const res = await (await fetch(url, init)).json();

    return res;
};

// class

class AuthConnection {

    constructor() {
        this.api_path = 'api/auth';

        this.set_uri();
    }

    destructor() {
        console.log(`${this.name} destructor`);
    }

    // setter

    set_uri() {
        // nginx will do the work
        this.uri_path = `${window.location.protocol}//${window.location.host}/${this.api_path}`;
    }

    // backend url

    async register(body) {
        // auth register
        const url = `${this.uri_path}/register`;
        return await _do_fetch(url, 'POST', 'cors', body);
    }

    async login(body) {
        // auth login
        const url = `${this.uri_path}/login`;
        return await _do_fetch(url, 'POST', 'cors', body);
    }

    async logout(body) {
        // auth logout
        const url = `${this.uri_path}/logout`;
        return await _do_fetch(url, 'POST', 'cors', body);
    }

    async valid_username(body) {
        // check auth valid_username
        const url = `${this.uri_path}/valid_username`;
        return await _do_fetch(url, 'POST', 'cors', body);
    }

    async can_logout(body) {
        // check auth can_logout
        const url = `${this.uri_path}/can_logout`;
        return await _do_fetch(url, 'POST', 'cors', body);
    }
}

class DatabaseConnection {

    constructor() {
        this.api_path = 'api/db/op';
        this.db_name = null;
        this.coll_name = null;
    }

    destructor() {
        console.log(`${this.name} destructor`);
    }

    // setter

    set_names(db_name, coll_name) {
        this.db_name = db_name;
        this.coll_name = coll_name;

        this.set_uri();
    }

    set_uri() {
        // nginx will do the work
        this.uri_path = `${window.location.protocol}//${window.location.host}/${this.api_path}`;

        // use query to access the mongodb
        this.uri_query = `db=${this.db_name}&coll=${this.coll_name}`;
    }

    // backend url -> database op.

    async columns() {
        const url = `${this.uri_path}?${this.uri_query}`;
        return await _do_fetch(url, 'GET', 'no-cors');
    }

    async create(body) {
        // database create / insert
        const url = `${this.uri_path}/create?${this.uri_query}`;
        return await _do_fetch(url, 'POST', 'cors', body);
    }

    async read(body) {
        // database read / find
        const url = `${this.uri_path}/read?${this.uri_query}`;
        return await _do_fetch(url, 'POST', 'cors', body);
    }

    async update(body) {
        // database update
        const url = `${this.uri_path}/update?${this.uri_query}`;
        return await _do_fetch(url, 'POST', 'cors', body);
    }

    async delete(body) {
        // database delete
        const url = `${this.uri_path}/delete?${this.uri_query}`;
        return await _do_fetch(url, 'POST', 'cors', body);
    }

    async upload(body) {
        // database upload
        const url = `${this.uri_path}/upload?${this.uri_query}`;
        const headers = null;
        return await _do_fetch(url, 'POST', 'no-cors', body, headers);
    }

    async download(body) {
        // database download
        return;
    }
}

export default {
    AuthConnection,
    DatabaseConnection,
};

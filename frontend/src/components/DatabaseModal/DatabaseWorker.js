class DatabaseConnection {
    constructor(backend_ip, backend_port, db_name, coll_name) {
        this.backend_ip = backend_ip;
        this.backend_port = backend_port;
        this.db_name = db_name;
        this.coll_name = coll_name;

        this.set_uri();
    }

    destructor() {
        console.log(`${this.name} destructor`);
    }

    // setter

    set_uri() {
        this.uri_path = `http://${this.backend_ip}:${this.backend_port}/db`;
        this.uri_query = `db=${this.db_name}&coll=${this.coll_name}`;
    }

    // database op.

    async create(body) {
        // database create / insert
        const url = `${this.uri_path}/create?${this.uri_query}`;
        return await this._do_fetch(url, 'POST', body);
    }

    async read(body) {
        // database read / find
        const url = `${this.uri_path}/read?${this.uri_query}`;
        return await this._do_fetch(url, 'POST', body);
    }

    async update(body) {
        // database update
        const url = `${this.uri_path}/update?${this.uri_query}`;
        return await this._do_fetch(url, 'POST', body);
    }

    async delete(body) {
        // database delete
        const url = `${this.uri_path}/delete?${this.uri_query}`;
        return await this._do_fetch(url, 'POST', body);
    }

    // workhouse

    async _do_fetch(url, method, body) {
        const res = await (await fetch(url, {
            method: method,
            mode: 'cors',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        })).json();

        return res;
    }
}

class StructEquipment {

    /*
    col_name: String // should be const
    editable: Boolean // should be const
    sortable: Boolean // should be const

    showable: Boolean
    filter_mode: Number
    filter_str: String
    */

    constructor(col_name, editable, sortable, showable = true, filter_mode = 0, filter_str = null) {
        this.col_name = col_name;
        this.editable = editable;
        this.sortable = sortable;

        this.showable = showable;
        this.filter_mode = filter_mode;
        this.filter_str = filter_str;
    }

    // setter

    // getter

    get_col_name() {
        return this.col_name;
    }

    // checker

    check_editable() {
        return this.editable;
    }

}

export default {
    DatabaseConnection,
    StructEquipment,
};

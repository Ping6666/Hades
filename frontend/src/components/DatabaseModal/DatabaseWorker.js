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

    constructor(col_name, editable, sortable, showable = true, fuzzy_search = false, search_string = null) {
        this.col_name = {
            name: 'column name',
            value: col_name,
            editable: false,
            type: 'string',
        };

        this.editable = {
            name: 'editable',
            value: editable,
            editable: false,
            type: 'checkbox_switch', // boolean
        };

        this.sortable = {
            name: 'sortable',
            value: sortable,
            editable: false,
            type: 'checkbox_switch',// boolean
        };

        this.showable = {
            name: 'showable',
            value: showable,
            editable: true,
            type: 'checkbox_switch',// boolean
        };

        this.fuzzy_search = {
            name: 'fuzzy search',
            value: fuzzy_search,
            editable: true,
            type: 'checkbox_switch',// boolean
        };

        this.search_string = {
            name: 'search string',
            value: search_string,
            editable: true,
            type: 'string',
        };

        this.attr_names = [
            'col_name',
            'editable',
            'sortable',
            'showable',
            'fuzzy_search',
            'search_string',
        ];
    }

    // setter

    // getter

    get_col_name() {
        return this.col_name.value;
    }

    // checker

    check_editable() {
        return this.editable.value;
    }

}

export default {
    DatabaseConnection,
    StructEquipment,
};

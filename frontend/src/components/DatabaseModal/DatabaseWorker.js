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
    constructor() {
        this.name = null;
        this.age = null;
    }

    // setter

    // getter

    get_json() {
        const res = {};

        if (this.name) {
            res.name = this.name;
        }

        if (this.age) {
            res.age = this.age;
        }

        return res;
    }

    // checker

    check_valid() {
        if (this.name && this.age) {
            return true;
        }

        return false;
    }
}

class DatabaseMode {
    constructor() {
        this.mode = null;

        this.ids = [];
        this.item = new StructEquipment();
    }

    destructor() {
        console.log(`${this.name} destructor`);
    }

    // setter

    set_mode(mode) {
        this.mode = mode;

        if (!mode || mode === 'create') {
            // clear current checked item(s)

            this.ids = [];
        }
    }

    // getter

    get_filter() {
        // use while read & update & delete

        const filter = {
            '_id': this.ids,
        };

        return filter;
    }

    get_item() {
        // use while create & update
        return this.item.get_json();
    }

    // checker

    check_cannot_switch(to) {
        if (to === 'create') {
            // do nothing
        } else if (to === 'read' && this.ids.length !== 1) {
            return true;
        } else if (to === 'update' && this.ids.length !== 1) {
            return true;
        } else if (to === 'delete' && this.ids.length === 0) {
            return true;
        }

        return false;
    }

    check_modal_cannot_switch(to) {
        if (this.mode && this.mode === to) {
            return true;
        }

        return this.check_cannot_switch(to);
    }

    check_cannot_save() {
        // for create & update
        return this.item.check_valid();
    }
}

export default {
    DatabaseConnection,
    DatabaseMode,
};

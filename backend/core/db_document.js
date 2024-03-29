class DatabaseDocument {

    constructor() {
        /**
         * collections
         *     a dict: given collection_name get content
         */
        this.collections = {};
    }

    /* setter */

    set_collection(collection_name) {
        // new and reset
        this.collections[collection_name] = {
            columns: [],
        };
    }

    add_column(collection_name, column_name, datatype, editable, searchable, modal_showable, duplicated_check) {
        /**
         * column_name: string
         * datatype: string
         * 
         * editable: boolean
         * sortable: boolean
         * searchable: boolean
         */

        if (!this.collections[collection_name]) {
            console.log(`clear the collection, name: ${collection_name}`);

            this.new_collection(collection_name);
        }

        const c_columns = this.collections[collection_name]['columns'];

        const c_json = {
            column_name: column_name,
            datatype: datatype,
            editable: editable,
            searchable: searchable,
            modal_showable: modal_showable,
            duplicated_check: duplicated_check,
        };

        c_columns.push(c_json);
    }

    /* getter */

    get_collection(collection_name) {
        return this.collections[collection_name];
    }

    get_collection_json(collection_name) {
        const _columns_json = {};

        const c_document = this.get_collection(collection_name);

        if (!c_document) {
            return _columns_json;
        }

        const c_columns = c_document['columns'];

        for (let i = 0; i < c_columns.length; i++) {
            _columns_json[c_columns[i].column_name] = c_columns[i];
        }

        return _columns_json;
    }

    get_collection_duplicated_check_json(collection_name) {
        const _columns_json = {};

        const c_document = this.get_collection(collection_name);

        if (!c_document) {
            return _columns_json;
        }

        const c_columns = c_document['columns'];

        for (let i = 0; i < c_columns.length; i++) {
            const _coll = c_columns[i];

            if (_coll.duplicated_check) {
                _columns_json[_coll.column_name] = _coll;
            }
        }

        return _columns_json;
    }
}

const hades_db_document = new DatabaseDocument();

/* announcement */

hades_db_document.set_collection('db.announcement');

hades_db_document.add_column('db.announcement', 'create_date', 'date', false, false, false, false);
hades_db_document.add_column('db.announcement', 'edit_date', 'date', false, false, false, false);

/* equipment */

hades_db_document.set_collection('db.equipment');

hades_db_document.add_column('db.equipment', '超過年限日期', 'date', false, true, false, false);
hades_db_document.add_column('db.equipment', '實際位置', 'string', true, true, false, false);
hades_db_document.add_column('db.equipment', '照片', 'picture', true, false, false, false);
hades_db_document.add_column('db.equipment', '其他備註', 'string', true, true, false, false);

hades_db_document.add_column('db.equipment', '財物編號', 'number', true, true, true, true);
hades_db_document.add_column('db.equipment', '校號', 'number', true, true, true, true);
hades_db_document.add_column('db.equipment', '附件', 'number', true, true, true, true);
hades_db_document.add_column('db.equipment', '財物名稱', 'string', true, true, true, false);
hades_db_document.add_column('db.equipment', '廠牌', 'string', true, true, false, false);
hades_db_document.add_column('db.equipment', '型式', 'string', true, true, false, false);
hades_db_document.add_column('db.equipment', '單價', 'number', true, true, false, false);
hades_db_document.add_column('db.equipment', '增加單號', 'string', true, true, false, false);
hades_db_document.add_column('db.equipment', '取得日期', 'date', true, true, false, false);
hades_db_document.add_column('db.equipment', '年限', 'number', true, true, false, false);
hades_db_document.add_column('db.equipment', '管理人', 'string', true, true, false, false);
hades_db_document.add_column('db.equipment', '存置地點', 'string', true, true, false, false);
hades_db_document.add_column('db.equipment', '報銷狀態', 'string', true, true, false, false);
hades_db_document.add_column('db.equipment', '保管組備註', 'string', true, true, false, false);
hades_db_document.add_column('db.equipment', '個人備註', 'string', true, true, false, false);

hades_db_document.add_column('db.equipment', 'create_date', 'date', false, false), false, false;
hades_db_document.add_column('db.equipment', 'edit_date', 'date', false, false, false, false);

/* property */

hades_db_document.set_collection('db.property');

hades_db_document.add_column('db.property', 'create_date', 'date', false, false, false, false);
hades_db_document.add_column('db.property', 'edit_date', 'date', false, false, false, false);

/* log */

hades_db_document.set_collection('db.log');

hades_db_document.add_column('db.log', 'db_name', 'string', true, true, true, true);
hades_db_document.add_column('db.log', 'coll_name', 'string', true, true, true, true);
hades_db_document.add_column('db.log', 'CRUD', 'string', true, true, true, true);
hades_db_document.add_column('db.log', 'content', 'string', true, true, false, true);

hades_db_document.add_column('db.log', 'create_date', 'date', false, false, false, false);
hades_db_document.add_column('db.log', 'edit_date', 'date', false, false, false, false);

/* module.exports */

module.exports = {
    hades_db_document,
};

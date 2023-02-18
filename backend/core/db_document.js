const db_document = {};

const db_document_new_collection = function (collection_name) {
    db_document[collection_name] = {
        columns: [],
    };
};

const db_document_add_column = function (collection_name, column_name, datatype, editable, searchable) {
    /**
     * column_name: string
     * datatype: string
     * 
     * editable: boolean
     * sortable: boolean
     * searchable: boolean
     */

    const c_columns = db_document[collection_name]['columns'];

    const c_json = {
        column_name: column_name,
        datatype: datatype,
        editable: editable,
        searchable: searchable,
    };

    c_columns.push(c_json);
};

/* getter */

const get_db_document = function (collection_name) {
    return db_document[collection_name];
}

/* TEST */

db_document_new_collection('Hi.AA');

db_document_add_column('Hi.AA', 'name', 'string', true, true);
db_document_add_column('Hi.AA', 'age', 'number', true, true);
db_document_add_column('Hi.AA', 'create_date', 'date', false, false);
db_document_add_column('Hi.AA', 'edit_date', 'date', false, false);

/* announcement */

db_document_new_collection('db.announcement');

/* equipment */

db_document_new_collection('db.equipment');

db_document_add_column('db.equipment', 'name', 'string', true, true);
db_document_add_column('db.equipment', 'age', 'number', true, true);
db_document_add_column('db.equipment', 'create_date', 'date', false, false);
db_document_add_column('db.equipment', 'edit_date', 'date', false, false);

/* property */

db_document_new_collection('db.property');

/* log */

db_document_new_collection('db.log');

module.exports = {
    get_db_document,
};

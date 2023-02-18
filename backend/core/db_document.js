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

/* announcement */

db_document_new_collection('db.announcement');

db_document_add_column('db.announcement', 'create_date', 'date', false, false);
db_document_add_column('db.announcement', 'edit_date', 'date', false, false);

/* equipment */

db_document_new_collection('db.equipment');

db_document_add_column('db.equipment', 'name', 'string', true, true);
db_document_add_column('db.equipment', 'age', 'number', true, true);
db_document_add_column('db.equipment', 'create_date', 'date', false, false);
db_document_add_column('db.equipment', 'edit_date', 'date', false, false);

/* property */

db_document_new_collection('db.property');

db_document_add_column('db.property', 'create_date', 'date', false, false);
db_document_add_column('db.property', 'edit_date', 'date', false, false);

/* log */

db_document_new_collection('db.log');

db_document_add_column('db.log', 'create_date', 'date', false, false);
db_document_add_column('db.log', 'edit_date', 'date', false, false);

/* module.exports */

module.exports = {
    get_db_document,
};

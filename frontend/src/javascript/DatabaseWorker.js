class StructBase {

    constructor(op_name, op_value, ops) {
        this.op_name = {
            name: 'name',
            value: op_name,
            type: 'string',
        };

        this.op_value = {
            name: 'value',
            value: op_value,
            type: 'form_select',// options
        };

        this.ops = ops; // array

        this.attr_names = [
            'op_name',
            'op_value',
        ];
    }
}

class StructEquipment {

    constructor(col_name, editable, sortable, datatype, showable = true, fuzzy_search = true, searchable = true) {
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
            type: 'form_checkbox_switch', // boolean
        };

        this.sortable = {
            name: 'sortable',
            value: sortable,
            editable: false,
            type: 'form_checkbox_switch',// boolean
        };

        this.datatype = {
            name: 'datatype',
            value: datatype,
            editable: false,
            type: 'string',
        };

        this.showable = {
            name: 'showable',
            value: showable,
            editable: true,
            type: 'form_checkbox_switch',// boolean
        };

        this.fuzzy_search = {
            name: 'fuzzy search',
            value: fuzzy_search,
            editable: searchable,
            type: 'form_checkbox_switch',// boolean
        };

        this.search_string = {
            name: 'search string',
            value: null,
            editable: searchable,
            type: 'string',
        };

        this.attr_names = [
            'col_name',
            'editable',
            'sortable',
            'datatype',
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

class DatabaseStruct {

    constructor(controls, columns) {
        this.controls = controls;
        this.columns = columns;
    }
}

export default {
    DatabaseStruct,
    StructBase,
    StructEquipment,
};

var express = require('express');
var router = express.Router();

var object_id = require('mongodb').ObjectId;
const db_server = require('../core/db_server');
const db_document = require('../core/db_document');
const db_csv = require('../core/db_csv');

const auth = require('../middleware/auth');

const multer = require("multer");
const file_multipart = require('../middleware/file_multipart');

/* core worker */

const get_object_id = (c_id) => {
    return new object_id(c_id);
};

const item_recon_worker = (mode, _query, _item) => {
    /* input check */

    if (!mode || !_query || (!_query.db || !_query.coll) || !_item) {
        return null;
    }

    /* get the db columns */

    const _columns_json = db_document.hades_db_document.get_collection_json(`${_query.db}.${_query.coll}`);

    const _item_key = Object.keys(_item);
    const _columns_key = Object.keys(_columns_json);

    /* reconstruct the item */

    const pending_item = {};

    for (let i = 0; i < _item_key.length; i++) {
        const _key = _item_key[i];

        // check item columns that in the db columns
        if (!_columns_key.includes(_key)) {
            continue;
        }

        if (_columns_json[_key].editable) {
            const _item_col = _item[_key];
            if (_columns_json[_key].datatype === 'number') {
                // remove " & ,
                const _num = _item_col.replace(/["',]/g, '');

                pending_item[_key] = _num;
            } else {
                // default

                pending_item[_key] = _item_col;
            }
        }
    }

    if (pending_item === {}) {
        console.log(`Error | no match column, given: ${_item_key} and db need: ${_columns_key}.`);

        return null;
    }

    /* auto generate from the backend */

    if (mode === 'create') {
        pending_item.create_date = new Date();
        pending_item.edit_date = new Date();
    } else if (mode === 'update') {
        pending_item.edit_date = new Date();
    } else {
        console.log(`Error | given mode: ${mode} not found`);

        return null;
    }

    return pending_item;
};

const item_dupl_worker = (_query, _item) => {
    /* input check */

    if (!_query || (!_query.db || !_query.coll) || !_item) {
        return null;
    }

    /* get the db columns */

    const _columns_json = db_document.hades_db_document.get_collection_duplicated_check_json(`${_query.db}.${_query.coll}`);

    const _item_key = Object.keys(_item);
    const _columns_key = Object.keys(_columns_json);

    /* reconstruct the item */

    const pending_item = {};

    for (let i = 0; i < _item_key.length; i++) {
        const _key = _item_key[i];

        // check item columns that in the db columns
        if (!_columns_key.includes(_key)) {
            continue;
        }

        pending_item[_key] = _item[_key];
    }

    return pending_item;
};

const single_dupl_check_worker = async (_query, _item) => {
    var _state = null;

    /* read if duplicate by given constraint */

    const pending_item = item_dupl_worker(_query, _item);
    const db_res = await db_server.db_read(_query.db, _query.coll, pending_item);

    /* check read result */

    if (!db_res || db_res.length === 0) {
        // no duplicated item has been found

        _state = false;
    } else if (db_res.length >= 1) {
        if (db_res.length !== 1) {
            // multi. duplicated items have been found

            console.log('Error | multi. duplicated item has been found');
        }

        // duplicated item(s) has (have) been found

        _state = db_res[0]._id;
    }

    return _state;
};

/**
 * 
 * @param {*} _query 
 * @param {*} _item 
 * @returns
 *     -2: catch error \
 *     -1: item_recon_worker reconstruct fail \
 *      0: create failed \
 *      1: create successfully \
 *    _id: create hit (aka. update) need user confirm (return a hitted _id)
 * 
 */
const single_create_worker = async (_query, _item) => {
    var _state = null;

    try {
        const pending_item = item_recon_worker('create', _query, _item);

        if (!pending_item) {
            _state = -1;

            return; // jump to finally-block
        }

        /* check potential duplicated */

        const _dupl = await single_dupl_check_worker(_query, _item);

        if (!_dupl) {
            /* no duplicated */

            // do db create
            const _res = await db_server.db_create(_query.db, _query.coll, pending_item);

            if (_res && _res['insertedId']) {
                _state = 1;
            } else {
                _state = 0;
            }

        } else {
            /* duplicated */

            _state = _dupl;
        }

    } catch (err) {
        console.log(err);

        _state = -2;
    } finally {
        return _state;
    }
};

/* router */

router.get('/', async function (req, res, next) {
    const c_document = db_document.hades_db_document.get_collection(`${req.query.db}.${req.query.coll}`);

    var c_columns = null;

    if (c_document) {
        c_columns = c_document['columns'];
    }

    res.json({ 'message': 'this is db', 'columns': c_columns });
});

router.post('/create', auth.session_verify, async function (req, res, next) {
    if (!res.locals.state_verify) {
        return res.status(404).send({ log: ['Please login first!'] });
    }

    console.log(req.body);

    const db_res = await single_create_worker(req.query, req.body);

    res.json({ 'message': db_res });
});

router.post('/read', async function (req, res, next) {
    console.log(req.body);

    if (req.body._id) {
        req.body._id = get_object_id(req.body._id[0]);
    }

    const db_res = await db_server.db_read(req.query.db, req.query.coll, req.body);
    res.json({ 'message': db_res });
});

router.post('/update', auth.session_verify, async function (req, res, next) {
    if (!res.locals.state_verify) {
        return res.status(404).send({ log: ['Please login first!'] });
    }

    console.log(req.body);

    const c_id = get_object_id(req.body._id[0]);

    const _set = item_recon_worker('update', req.query, req.body.item);
    const c_item = { $set: _set };

    const db_res = await db_server.db_update(req.query.db, req.query.coll, c_id, c_item);
    res.json({ 'message': db_res });
});

router.post('/delete', auth.session_verify, async function (req, res, next) {
    if (!res.locals.state_verify) {
        return res.status(404).send({ log: ['Please login first!'] });
    }

    console.log(req.body);

    const c_ids = req.body._id;

    c_ids.forEach(async (_id) => {
        const c_id = get_object_id(_id);

        db_server.db_delete(req.query.db, req.query.coll, c_id);
    });

    res.json({ 'message': '' });
});

router.post('/upload', auth.session_verify, file_multipart.upload.single(), async function (req, res, next) {
    if (!res.locals.state_verify) {
        // TODO activate session_verify
        // return res.status(404).send({ log: ['Please login first!'] });
    }

    var log = "upload";
    var detail = '';

    try {
        console.log(req.body);

        /* upload selected content as json */

        const _json = JSON.parse(req.body['json']);
        const _json_keys = Object.keys(_json);

        const _res = [];

        // result
        var _successfully = 0;
        var _failed = 0;

        for (let i = 0; i < _json_keys.length; i++) {
            const _key = _json_keys[i];
            const _item = _json[_key];

            // do create
            const db_res = await single_create_worker(req.query, _item);

            if (typeof db_res === 'number') {
                if (db_res === 1) {
                    _successfully += 1;
                } else {
                    _failed += 1;
                }
            } else {
                _res.push({ 'key': _key, 'id': db_res });
            }
        }

        log = `File uploaded | ${_successfully} successfully and ${_failed} failed and ${_res.length} duplicated!`;
        detail = _res;
    } catch (error) {
        detail = error;

        if (error instanceof multer.MulterError) {
            log = 'File uploaded fail! (multer)';
        } else {
            log = 'File uploaded fail!';
        }
    } finally {
        res.json({ log: log, detail: detail });
    }
});

module.exports = router;

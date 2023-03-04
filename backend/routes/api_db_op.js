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

const single_create_worker = async (_query, _item) => {
    var _state = null;

    try {
        /* input check */

        if (!_query || (!_query.db || !_query.coll) || !_item) {
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

        // add some content that auto gen. in the backend
        pending_item.create_date = new Date();
        pending_item.edit_date = new Date();

        // TODO check potential dulp.

        // do db create
        const _res = await db_server.db_create(_query.db, _query.coll, pending_item);

        if (_res && _res['insertedId']) {
            _state = true;
        } else {
            _state = false;
        }
    } catch (err) {
        console.log(err);

        _state = false;
    } finally {
        return _state;
    }
}

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

    const c_content = req.body.item;
    c_content.edit_date = new Date();

    const c_item = { $set: c_content };

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
        /* upload selected content as json */

        const _json = JSON.parse(req.body['json']);
        const _json_keys = Object.keys(_json);

        const _res = [];

        for (let i = 0; i < _json_keys.length; i++) {
            const _key = _json_keys[i];
            const _item = _json[_key];

            // do create
            const db_res = await single_create_worker(req.query, _item);

            _res.push(db_res);
        }

        log = 'File uploaded successfully!';
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

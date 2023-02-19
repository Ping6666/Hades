var express = require('express');
var router = express.Router();

var object_id = require('mongodb').ObjectId;
const db_server = require('../core/db_server');
const db_document = require('../core/db_document');

const auth = require('../middleware/auth');

var get_object_id = (c_id) => {
    return new object_id(c_id);
};

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

    const c_item = req.body;
    c_item.create_date = new Date();
    c_item.edit_date = new Date();

    const db_res = await db_server.db_create(req.query.db, req.query.coll, c_item);
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

module.exports = router;

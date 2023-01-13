var express = require('express');
var router = express.Router();

var db_server = require('../database/server')

router.get('/', async function (req, res, next) {
    res.json({ 'message': 'this is db' });
});

router.post('/create', async function (req, res, next) {
    console.log(req.body);
    var db_rt_message = await db_server.db_create(req.query.db, req.query.coll, req.body);
    res.json({ 'message': db_rt_message });
});

router.post('/read', async function (req, res, next) {
    var db_rt_message = await db_server.db_read(req.query.db, req.query.coll, req.body);
    res.json({ 'message': db_rt_message });
});

module.exports = router;

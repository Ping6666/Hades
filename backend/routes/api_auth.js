var express = require('express');
var router = express.Router();

const auth = require('../middleware/auth');

router.post('/valid_username', auth.username_check, function (req, res, next) {
    res.json({ 'message': res.locals.valid_username });
});

router.post('/register', auth.username_check, auth.register_workhouse, async function (req, res, next) {
    const res_json = {};

    try {
        res_json['result'] = res.locals.result;
        res_json['log'] = [res.locals.register_log];
    } catch (error) {
        console.log(error);
    } finally {
        res.json(res_json);
    }
});

router.post('/login', auth.login_workhouse, async function (req, res, next) {
    const res_json = {};

    try {
        res_json['result'] = res.locals.result;
        res_json['message'] = res.locals.message;
        res_json['log'] = [res.locals.login_log];
    } catch (error) {
        console.log(error);
    } finally {
        res.json(res_json);
    }
});

router.post('/logout', auth.session_verify, auth.logout_workhouse, function (req, res, next) {
    const res_json = {};

    try {
        res_json['log'] = [res.locals.logout_log];
    } catch (error) {
        console.log(error);
    } finally {
        res.json(res_json);
    }
});

router.post('/change_password', function (req, res, next) {
    // TODO
});

router.post('/can_logout', auth.session_verify, function (req, res, next) {
    const res_json = {};

    try {
        res_json['message'] = res.locals.state_verify;
    } catch (error) {
        console.log(error);
    } finally {
        res.json(res_json);
    }
});

module.exports = router;

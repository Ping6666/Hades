var express = require('express');
var router = express.Router();

const auth = require('../middleware/auth');

router.post('/valid_username', auth.username_check, function (req, res, next) {
    res.json({ 'message': res.locals.valid_username });
});

router.post('/signup', auth.username_check, auth.signup_workhouse, async function (req, res, next) {
    const res_json = {};

    try {
        res_json['log'] = [res.locals.signup_log];
    } catch (error) {
        console.log(error);
    } finally {
        res.json(res_json);
    }
});

router.post('/signin', auth.signin_workhouse, async function (req, res, next) {
    const res_json = {};

    try {
        res_json['message'] = res.locals.message;
        res_json['log'] = [res.locals.signin_log];
    } catch (error) {
        console.log(error);
    } finally {
        res.json(res_json);
    }
});

router.post('/signout', auth.session_verify, auth.signout_workhouse, function (req, res, next) {
    const res_json = {};

    try {
        res_json['log'] = [res.locals.signout_log];
    } catch (error) {
        console.log(error);
    } finally {
        res.json(res_json);
    }
});

router.post('/change_password', function (req, res, next) {
    // TODO
});

module.exports = router;

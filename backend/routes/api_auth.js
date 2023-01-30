var express = require('express');
var router = express.Router();

const auth = require('../middleware/auth');

router.post('/valid_username', auth.username_check, function (req, res, next) {
    res.json({ 'message': res.locals.valid_username });
});

router.post('/signup', auth.username_check, auth.signup_check, async function (req, res, next) {
    try {
        if (res.locals.result) {
            // successful
            console.log('successful');
        } else {
            // fail
            console.log('fail');
        }

        res.json({ 'token': res.locals.token });
    } catch (error) {
        console.log(error);
    }
});

router.post('/signin', auth.signin_check, async function (req, res, next) {
    try {
        if (res.locals.result) {
            // successful
            console.log('successful');
        } else {
            // fail
            console.log('fail');
        }

        res.json({ 'message': res.locals.message, 'token': res.locals.token });
    } catch (error) {
        console.log(error);
    }
});

router.post('/token_test', auth.jwt_verify, function (req, res, next) {
    res.json({ 'message': res.locals.decoded });
});

router.post('/signout', function (req, res, next) {
    // TODO
});

router.post('/change_password', function (req, res, next) {
    // TODO
});

module.exports = router;

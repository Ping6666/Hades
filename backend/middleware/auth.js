const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db_server = require('../database/server');
var config = require('./config');

const db_name = 'Users';
const coll_name = 'user';

const jwt_sign = function (id) {
    // TODO store jwt in redis

    return jwt.sign(
        {
            id: id
        },
        config.JWT_SECRET,
        {
            expiresIn: '1m', // 2h
        }
    );
};

const jwt_verify = async function (req, res, next) {
    const token = req.body.token;

    if (token) {
        jwt.verify(token, config.JWT_SECRET, function (err, decoded) {
            if (err) {
                return res.status(401).send({ log: 'Unauthorized | invalid token.' });
            } else {
                res.locals.decoded = decoded;

                const time_diff = Date.now() - decoded.iat * 1000;
                const time_total = (decoded.exp - decoded.iat) * 1000;

                console.log(time_diff);
                console.log(time_total);

                if (time_diff >= time_total * 0.5) {
                    // TODO renew the token
                    console.log('renew the token');
                }

                next();
            }
        });
    } else {
        return res.status(403).send({ log: 'Forbidden | token required.' });
    }
};

const username_check = async function (req, res, next) {
    res.locals.valid_username = true;

    if (!req.body.username) {
        /* frontend check */
        // username check fail

        res.locals.valid_username = false;
        return next();
    }

    const item = { 'username': req.body.username };
    const db_res = await db_server.db_read(db_name, coll_name, item);

    if (db_res.length !== 0) {
        // make sure uesrname has not been used.

        res.locals.valid_username = false;
        return next();
    }

    next();
};

const signup_check = async function (req, res, next) {
    if ((!req.body.username || !res.locals.valid_username) || (!req.body.password || !req.body.repeat_password || (req.body.password.length < 8)) ||
        (req.body.password !== req.body.repeat_password) || (!req.body.checkbox_term)) {
        /* frontend check */
        // password check fail
        // password and repeat password should be the same
        // term check fail

        return res.status(401).send({ log: 'Unauthorized | frontend check fail.' });
    }

    const item = {
        'username': req.body.username,
        'password': await bcrypt.hash(req.body.password, 8),
    };

    const db_res = await db_server.db_create(db_name, coll_name, item);

    if (db_res) {
        res.locals.result = db_res.acknowledged;

        res.locals.token = jwt_sign(db_res.insertedId);
    }

    next();
};

const signin_check = async function (req, res, next) {
    const item = { 'username': req.body.username };
    const db_res = await db_server.db_read(db_name, coll_name, item);

    res.locals.message = 'signin_check fail';
    console.log(db_res);

    if (!db_res || db_res.length === 0) {
        return res.status(401).send({ log: 'Unauthorized' });
    } else if (db_res.length > 1) {
        console.log('signin_check | duplicate user alert!');

        return res.status(401).send({ log: 'Unauthorized' });
    }

    const c_user = db_res[0];
    res.locals.result = await bcrypt.compare(req.body.password, c_user.password);

    if (res.locals.result) {
        res.locals.message = 'signin_check successful';

        res.locals.token = jwt_sign(c_user._id);
    }

    next();
};

module.exports = {
    username_check,
    signup_check,
    signin_check,
    jwt_verify,
};

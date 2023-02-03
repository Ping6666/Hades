const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db_server = require('../core/db_server');

const JWT_SECRET = process.env.JWT_SECRET;

const db_name = 'Users';
const coll_name = 'user';

const jwt_sign = function (id) {
    // TODO store jwt in redis

    return jwt.sign(
        {
            id: id
        },
        JWT_SECRET,
        {
            expiresIn: '1m', // 2h
        }
    );
};

const jwt_verify = async function (req, res, next) {
    const token = req.body.token;

    if (token) {
        jwt.verify(token, JWT_SECRET, function (err, decoded) {
            if (err) {
                return res.status(401).send({ log: ['Unauthorized | invalid token.'] });
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
        return res.status(403).send({ log: ['Forbidden | token required.'] });
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
    }

    next();
};

const signup_workhouse = async function (req, res, next) {
    if ((!req.body.username || !res.locals.valid_username) || (!req.body.password || !req.body.repeat_password || (req.body.password.length < 8)) ||
        (req.body.password !== req.body.repeat_password) || (!req.body.checkbox_term)) {
        /* frontend check */
        // password check fail
        // password and repeat password should be the same
        // term check fail

        return res.status(401).send({ log: ['Sign up fail! Frontend check fail.'] });
    }

    const item = {
        'username': req.body.username,
        'password': await bcrypt.hash(req.body.password, 8),
    };

    const db_res = await db_server.db_create(db_name, coll_name, item);
    res.locals.result = db_res.acknowledged;

    if (!res.locals.result) {
        return res.status(401).send({ log: ['Sign up fail!'] });
    }

    req.session.regenerate(function (err) {
        if (err) {
            return res.status(401).send({ log: ['Sign up fail! Backend store error.'] });
        }

        req.session._id = db_res.insertedId;
        res.locals.signup_log = 'Sign up successful!';

        next();
    });
};

const signin_workhouse = async function (req, res, next) {
    const item = { 'username': req.body.username };
    const db_res = await db_server.db_read(db_name, coll_name, item);

    if (!db_res || db_res.length === 0) {
        return res.status(401).send({ log: ['Sign in fail!'] });
    } else if (db_res.length > 1) {
        console.log('signin_check | duplicate user alert!');

        return res.status(401).send({ log: ['Sign in fail! Backend server error, please contact the admin.'] });
    }

    const c_user = db_res[0];
    res.locals.result = await bcrypt.compare(req.body.password, c_user.password);

    if (!res.locals.result) {
        return res.status(401).send({ log: ['Sign in fail!'] });
    }

    req.session.regenerate(function (err) {
        if (err) {
            return res.status(401).send({ log: ['Sign in fail! Backend store error.'] });
        }

        req.session._id = c_user._id;
        res.locals.signin_log = 'Sign in successful!';

        next();
    });
};

const signout_workhouse = function (req, res, next) {
    if (!res.locals.state_verify) {
        res.locals.signout_log = 'Please Sign in first.';
        return next();
    }

    req.session.regenerate(function (err) {
        if (err) {
            return res.status(401).send({ log: ['Sign out fail! Backend store error.'] });
        }

        res.locals.signout_log = 'Sign out successful!';

        next();
    });
};

const session_verify = function (req, res, next) {
    res.locals.state_verify = false;

    if (req.session._id) {
        /**
         * if got _id in session means that it is a sign in user.
         */

        res.locals.state_verify = true;
    }

    next();
};

module.exports = {
    username_check,
    signup_workhouse,
    signin_workhouse,
    signout_workhouse,
    session_verify,
    jwt_verify,
};

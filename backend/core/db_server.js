const { MongoClient } = require('mongodb');

const USERNAME = process.env.MONGO_USERNAME;
const PASSWORD = process.env.MONGO_PASSWORD;
const HOST = process.env.MONGO_HOST;
const PORT = process.env.MONGO_PORT;

const uri = `mongodb://${HOST}:${PORT}`;
const auth_uri = `mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}`;

const client = new MongoClient(uri);
const auth_client = new MongoClient(auth_uri);

const pass_log = ['db.log', 'Users.user'];

async function db_create(db_name, coll_name, item) {
    var c_client = new MongoClient(auth_uri);
    var result = 'db_create fail';
    try {
        await c_client.connect();
        const database = c_client.db(db_name);
        const collection = database.collection(coll_name);

        result = await collection.insertOne(item);
        c_client.close();

        /* backup into log */

        if (!pass_log.includes(`${db_name}.${coll_name}`)) {
            const _item = {};
            _item['db_name'] = db_name;
            _item['coll_name'] = coll_name;
            _item['CRUD'] = 'create';
            _item['content'] = JSON.stringify(item);

            _item.create_date = new Date();
            _item.edit_date = new Date();

            /* Warning */
            // recursion end condition need to be meet
            this.db_create('db', 'log', _item);
        }

    } catch (error) {
        console.log(error);
    } finally {
        return result;
    }
};

async function db_read(db_name, coll_name, item) {
    var c_client = new MongoClient(auth_uri);
    var result = 'db_read fail';
    try {
        await c_client.connect();
        const database = c_client.db(db_name);
        const collection = database.collection(coll_name);

        result = await collection.find(item).toArray();
        c_client.close();

        /* no need to backup into log */

    } catch (error) {
        console.log(error);
    } finally {
        return result;
    }
};

async function db_update(db_name, coll_name, id, item) {
    var c_client = new MongoClient(auth_uri);
    var result = 'db_update fail';
    try {
        await c_client.connect();
        const database = c_client.db(db_name);
        const collection = database.collection(coll_name);

        result = await collection.findOneAndUpdate({ _id: id }, item);
        c_client.close();

        /* backup into log */

        if (!pass_log.includes(`${db_name}.${coll_name}`)) {
            const _item = {};
            _item['db_name'] = db_name;
            _item['coll_name'] = coll_name;
            _item['CRUD'] = 'update';
            _item['content'] = JSON.stringify({ '_id': id, 'item': item });

            _item.create_date = new Date();
            _item.edit_date = new Date();

            /* Warning */
            // recursion end condition need to be meet
            this.db_create('db', 'log', _item);
        }

    } catch (error) {
        console.log(error);
    } finally {
        return result;
    }
};

async function db_delete(db_name, coll_name, id) {
    var c_client = new MongoClient(auth_uri);
    var result = 'db_delete fail';
    try {
        await c_client.connect();
        const database = c_client.db(db_name);
        const collection = database.collection(coll_name);

        result = await collection.findOneAndDelete({ _id: id });
        c_client.close();

        /* backup into log */

        if (!pass_log.includes(`${db_name}.${coll_name}`)) {
            const _item = {};
            _item['db_name'] = db_name;
            _item['coll_name'] = coll_name;
            _item['CRUD'] = 'delete';
            _item['content'] = JSON.stringify({ '_id': id });

            _item.create_date = new Date();
            _item.edit_date = new Date();

            /* Warning */
            // recursion end condition need to be meet
            this.db_create('db', 'log', _item);
        }

    } catch (error) {
        console.log(error);
    } finally {
        return result;
    }
};

module.exports = {
    db_create,
    db_read,
    db_update,
    db_delete,
};

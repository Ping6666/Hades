const { MongoClient } = require('mongodb');

const USERNAME = process.env.MONGO_USERNAME;
const PASSWORD = process.env.MONGO_PASSWORD;
const HOST = process.env.MONGO_HOST;
const PORT = process.env.MONGO_PORT;

const uri = `mongodb://${HOST}:${PORT}`;
const auth_uri = `mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}`;

const client = new MongoClient(uri);
const auth_client = new MongoClient(auth_uri);

async function db_create(db_name, coll_name, item) {
    var c_client = new MongoClient(auth_uri);
    var result = 'db_create fail';
    try {
        await c_client.connect();
        const database = c_client.db(db_name);
        const collection = database.collection(coll_name);

        result = await collection.insertOne(item);
        c_client.close();
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

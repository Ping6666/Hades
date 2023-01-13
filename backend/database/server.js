const { MongoClient } = require('mongodb');

var config = require('./config');

const uri = `mongodb://${config.HOST}:${config.PORT}`
const auth_uri = `mongodb://${config.USERNAME}:${config.PASSWORD}@${config.HOST}:${config.PORT}`

const client = new MongoClient(uri);
const auth_client = new MongoClient(auth_uri);

async function db_create(db_name, cool_name, item) {
    var c_client = new MongoClient(auth_uri);
    var result = 'db_create fail';
    try {
        await c_client.connect();
        const database = c_client.db(db_name);
        const collection = database.collection(cool_name);
        result = await collection.insertOne(item);
    } finally {
        await c_client.close();
        return result;
    }
}

async function db_read(db_name, cool_name, item) {
    var c_client = new MongoClient(auth_uri);
    var result = 'db_read fail';
    try {
        await c_client.connect();
        const database = c_client.db(db_name);
        const collection = database.collection(cool_name);
        result = await collection.find(item).toArray();
    } finally {
        await c_client.close();
        return result;
    }
}

async function db_update(db_name, cool_name, id, item) {
    var c_client = new MongoClient(auth_uri);
    var result = 'db_update fail';
    try {
        await c_client.connect();
        const database = c_client.db(db_name);
        const collection = database.collection(cool_name);
        result = await collection.findOneAndUpdate({ _id: id }, item);
    } finally {
        await c_client.close();
        return result;
    }
}

async function db_replace(db_name, cool_name, id, item) {
    var c_client = new MongoClient(auth_uri);
    var result = 'db_replace fail';
    try {
        await c_client.connect();
        const database = c_client.db(db_name);
        const collection = database.collection(cool_name);
        result = await collection.findOneAndReplace({ _id: id }, item);
    } finally {
        await c_client.close();
        return result;
    }
}

async function db_delete(db_name, cool_name, id) {
    var c_client = new MongoClient(auth_uri);
    var result = 'db_delete fail';
    try {
        await c_client.connect();
        const database = c_client.db(db_name);
        const collection = database.collection(cool_name);
        result = await collection.findOneAndDelete({ _id: id });
    } finally {
        await c_client.close();
        return result;
    }
}

module.exports = {
    db_create,
    db_read,
    db_update,
    db_replace,
    db_delete,
};

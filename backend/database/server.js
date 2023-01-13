const { MongoClient } = require('mongodb');

var config = require('./config');

const uri = `mongodb://${config.HOST}:${config.PORT}`
const auth_uri = `mongodb://${config.USERNAME}:${config.PASSWORD}@${config.HOST}:${config.PORT}`

const client = new MongoClient(uri);
const auth_client = new MongoClient(auth_uri);

// Update
// Delete

async function db_create(db_name, cool_name, item) {
    var c_client = new MongoClient(auth_uri);
    try {
        await c_client.connect();
        const database = c_client.db(db_name);
        const collection = database.collection(cool_name);
        await collection.insertOne(item);
    } finally {
        await c_client.close();
        console.log('DONE');
    }
}

async function db_read(db_name, cool_name, item) {
    var c_client = new MongoClient(auth_uri);
    try {
        await c_client.connect();
        const database = c_client.db(db_name);
        const collection = database.collection(cool_name);
        var result = await collection.find(item).toArray();
        console.log('result:', result);
    } finally {
        await c_client.close();
        console.log('DONE');
    }
}

async function db_update(db_name, cool_name, id, item) {
    var c_client = new MongoClient(auth_uri);
    try {
        await c_client.connect();
        const database = c_client.db(db_name);
        const collection = database.collection(cool_name);
        var result = await collection.find(item).toArray();
        await collection.findOneAndUpdate({ _id: id }, item);
        console.log('result:', result);
    } finally {
        await c_client.close();
        console.log('DONE');
    }
}

async function db_replace(db_name, cool_name, id, item) {
    var c_client = new MongoClient(auth_uri);
    try {
        await c_client.connect();
        const database = c_client.db(db_name);
        const collection = database.collection(cool_name);
        var result = await collection.find(item).toArray();
        await collection.findOneAndReplace({ _id: id }, item);
        console.log('result:', result);
    } finally {
        await c_client.close();
        console.log('DONE');
    }
}

db_create('Hi', 'AA', { name: 'DO', age: 19 });
db_read('Hi', 'AA', { name: 'DO' });

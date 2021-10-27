const express = require('express');
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port=5000;

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z45ex.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run () {
    try{
        await client.connect();
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services')

        // get api
        app.get('/services', async (req, res)=>{
            const courser = servicesCollection.find({})
            const services = await courser.toArray();
            res.send(services)
        })

        // get single service
        app.get('/services/:id', async (req,res)=>{
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = {_id: ObjectId(id)}
            const service = await servicesCollection.findOne(query);
            res.json(service)
        })
        // post api
        app.post('/services', async (req,res)=>{
            const service = req.body;
        console.log('hit the api', service);
            const result =await servicesCollection.insertOne(service);
            res.json(result)
        })

        // Delete api
        app.delete('/services/:id', async (req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await servicesCollection.deleteOne(query);
            res.json(result)
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send('genious car service')
})

app.listen(port,()=>{
    console.log('running genious server on car port', port);
})
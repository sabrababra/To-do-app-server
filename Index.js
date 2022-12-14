const express = require('express');
const cors = require('cors');
const port = process.env.port || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const app = express();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cuhhdyu.mongodb.net/?retryWrites=true&w=majority`;
//console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const todoCollection = client.db('todoBook').collection('todoData');

        //Get all todo with Pagination
        app.get('/gettododata', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const info = await todoCollection.find(query).toArray();
            res.send(info);
        })

        //Add a single todo 
        app.post('/addtodo', async (req, res) => {
            const addData = req.body;
            const info = await todoCollection.insertOne(addData);
            res.send(info);
        })

        //Update a single todo by id
        app.patch('/updatetodo/:id', async (req, res) => {
            const id = req.params.id;
            const updateData = req.body;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updateDoc = {
                $set: updateData
            }
            const info = await todoCollection.updateOne(filter, updateDoc, option);
            res.send(info);
        })

        //Delete single todo by id
        app.delete('/deletetodo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const info = await todoCollection.deleteOne(query);
            res.send(info);
        })
    }
    finally {

    }
}
run().catch(console.log())



app.get('/', async (req, res) => {
    res.send('todo book running');
})

app.listen(port, () => console.log('todo book', port))
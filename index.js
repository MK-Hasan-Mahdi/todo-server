const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e9hj3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        // console.log("database connected");
        const taskCollection = client.db('todoApp').collection('tasks');

        app.post('/addTask', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result)
        })

        app.get('/task', async (req, res) => {
            const result = await taskCollection.find({ isCompelete: false }).toArray()
            res.send(result)
        })

        app.get('/compeltetask', async (req, res) => {
            const result = await taskCollection.find({ isCompelete: true }).toArray()
            res.send(result)
        })

        app.put('/updateTask/:id', async (req, res) => {
            const id = req.params.id;
            const task = req.body;

            if (!id) { return }
            const filter = { _id: ObjectId(id) }

            const updateDoc = {
                $set: task
            };
            const result = await taskCollection.updateOne(filter, updateDoc)
            res.send({ result });
        })

        app.delete('/deleteTask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await taskCollection.deleteOne(query);
            res.send(result)
        })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running todo server');
});

app.listen(port, () => {
    console.log('Alhamdulillah todo server running');
})
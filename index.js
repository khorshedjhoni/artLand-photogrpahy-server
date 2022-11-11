const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId,} = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xv6ozfs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
   try{
    const serviceCollection = client.db('artLand').collection('services');
    const reviewsCollection = client.db('artLand').collection('reviews');


    app.get('/services', async(req,res)=>{   
        const query = {}
        const cursor = serviceCollection.find(query).skip(3)
        const services = await cursor.toArray();
        res.send(services)
    })
    app.get('/service', async(req,res)=>{   
        const query = {}
        const cursor = serviceCollection.find(query)
        const services = await cursor.toArray();
        res.send(services)
    })
    app.get('/service/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const services= await serviceCollection.findOne(query)
        res.send(services)
    })
    app.post('/services', async(req,res)=>{
        const order = req.body;
        const result =await serviceCollection.insertOne(order);
        res.send(result)
    })
    // review-part

    app.post('/reviews',async(req,res)=>{
        const reviews = req.body
        const result = await reviewsCollection.insertOne(reviews)
        res.send(result)
    })

    // review by email
    app.get('/reviews',async(req,res)=>{   
        let query = {}

        if(req.query.email){
            query={
                email:req.query.email
            }
        }
        const cursor = reviewsCollection.find(query)
        const reviews = await cursor.toArray();
        res.send(reviews)
    })

    // review by id 
    app.get('/review',async(req,res)=>{   
        let query = {}

        if(req.query.service){
            query={
                service:req.query.service
            }
        }
        const cursor = reviewsCollection.find(query).limit(0).sort({$natural:-1})
        const reviews = await cursor.toArray();
        res.send(reviews)
    })

    // rev update
    app.patch('/reviews/:id',async(req,res)=>{
        const id = req.params.id 
        const status = req.body.status
        const query = {_id: ObjectId(id)}
        const updatedDoc = {
            $set:{
                status:status
            }
        }
        const result = await reviewsCollection.updateOne(query,updatedDoc)
        res.send(result)
    })
    // rev delete

    app.delete('/reviews/:id',async(req,res)=>{
        const id = req.params.id 
        const query = {_id:ObjectId(id)}
        const result = await reviewsCollection.deleteOne(query)
        res.send(result)
    })
    

   }
   finally{
    //  
   }

}
run().catch(err=> console.error(err))

app.get('/', (req,res)=>{
    res.send('artLand server running')
})

app.listen(port, ()=>{
    console.log(`ArtLand running on ${port}`)
})
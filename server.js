const express = require('express');
const bodyParser = require('body-parser');
const http = require("http");
const app= express();
const cors = require('cors');
const env = require("./env");
const port = 3000;

const MongoClient = require('mongodb').MongoClient;
const url = `mongodb+srv://${env.dev.db.user}:${env.dev.db.password}@discussion-board-cluster-e1mbo.mongodb.net/test?retryWrites=true&w=majority`;
const client = new MongoClient(url, { useUnifiedTopology: true });

client.connect(function(err) {
   if(err){
      console.log(err);
   }
   console.log("Connected successfully to server");
   //const collection = client.db(env.dev.db.dbName).collection(env.dev.db.collection);
   client.close();
 });

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.listen(3000, () => {
   console.log("server running on port 3000");
});
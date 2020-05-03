const express = require('express');
const bodyParser = require('body-parser');
const app= express();
const cors = require('cors');
const env = require("./env");
const port = 3000;

const mongoose = require('mongoose');
const url = `mongodb+srv://${env.dev.db.user}:${env.dev.db.password}@discussion-board-cluster-e1mbo.mongodb.net/test?retryWrites=true&w=majority`;

const postRoute = require('./routes/postRoute');


mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());

app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Credentials", "true");
   res.header("Access-Control-Allow-Methods", "GET", "POST", "DELETE", "PUT");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(postRoute);

app.listen(3000, () => {
   console.log("server running on port 3000");
});
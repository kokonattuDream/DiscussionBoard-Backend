const express = require('express');
const bodyParser = require('body-parser');
const app= express();
const cors = require('cors');
const env = require("./env");
const port = 3000;

const mongoose = require('mongoose');
const url = `mongodb+srv://${env.dev.db.user}:${env.dev.db.password}@discussion-board-cluster-e1mbo.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.listen(3000, () => {
   console.log("server running on port 3000");
});
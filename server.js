const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app= express();
const cors = require('cors');
const env = require("./env");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const url = `mongodb+srv://${env.dev.db.user}:${env.dev.db.password}@discussion-board-cluster-e1mbo.mongodb.net/test?retryWrites=true&w=majority`;
const postRoute = require('./routes/postRoute');
const userRoute = require('./routes/userRoute');
const passport = require('./lib/passport-local');


mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
app.use(cors());

app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Credentials", "true");
   res.header("Access-Control-Allow-Methods", "GET", "POST", "DELETE", "PUT");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
   secret: 'thisisasecretkey',
   resave: false,
   saveUninitialized: false,
   store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(userRoute);
app.use(postRoute);

app.listen(3000, () => {
   console.log("server running on port 3000");
});
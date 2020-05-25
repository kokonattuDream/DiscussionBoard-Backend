const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app= express();
const cors = require('cors');
const env = require("./env");

const mongoose = require('mongoose');
const url = `mongodb+srv://${env.dev.db.user}:${env.dev.db.password}@cluster0-wup3f.mongodb.net/test?retryWrites=true&w=majority`;
const postRoute = require('./routes/postRoute');
const userRoute = require('./routes/userRoute');
const replyRoute = require('./routes/replyRoute');
const passport = require('./lib/passport-local');

mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

app.use(cors({
   origin: env.dev.fronend.api,
   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
   credentials: true
}))

app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", env.dev.fronend.api);
   res.header("Access-Control-Allow-Credentials", "true");
   res.header("Access-Control-Allow-Methods", "GET", "POST", "DELETE", "PUT");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
const sessionMiddleware = require('./middleware/sessionMiddleware');
app.use(sessionMiddleware);
app.use(userRoute);
app.use(postRoute);
app.use(replyRoute);

let serverPort = 3000;
app.listen(process.env.PORT || serverPort, () => {
   console.log("server running on port 3000");
});
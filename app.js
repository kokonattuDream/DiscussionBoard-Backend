const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

const frontendUrl = process.env.FRONT_END_URL;
const mongoose = require('mongoose');
const postRoute = require('./routes/postRoute');
const userRoute = require('./routes/userRoute');
const replyRoute = require('./routes/replyRoute');
const healthRoute = require('./routes/healthRoute');

const dbUrl = process.env.NODE_ENV !== "test" ? process.env.DB_URL : process.env.TEST_DB_URL;
mongoose.connect(dbUrl,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });


app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", frontendUrl);
   res.header("Access-Control-Allow-Credentials", "true");
   res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
   res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
   next();
});
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const sessionMiddleware = require('./middleware/sessionMiddleware');

app.use(sessionMiddleware);
app.use(userRoute);
app.use(postRoute);
app.use(replyRoute);
app.use(healthRoute);

if(process.env.NODE_ENV !== "test"){
   app.listen(process.env.PORT || 3000);
}

module.exports = app;
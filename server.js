require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3300;
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');

// Database connection
mongoose.connect(process.env.MONGO_CONNECTION_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});
const connection = mongoose.connection;
connection
  .once("open", () => {
    console.log("Database connected...");
  })
  .catch((err) => {
    console.log("Connection failed...");
  });

// Session Store
// let mongoStore = MongoDbStore({
//   mongooseConnection: connection,
//   collection: 'sessions'
// })

// Session config
app.use(
  session({
    secret: process.env.COOKIES_SECRET,
    resave: false,
    store: MongoDbStore.create({
      mongoUrl: process.env.MONGO_CONNECTION_URL
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, //24 hours
  })
);


app.use(flash());

// Assets
app.use(express.static('public'));
app.use(express.json());

// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
})

// set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

require('./routes/web')(app);



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
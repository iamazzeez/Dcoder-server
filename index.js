const mongoose = require('mongoose');
var express = require("express");
const cors = require('cors');
var app = express();
var port = process.env.PORT || 8080;
const HOST = '0.0.0.0';
const bodyParser = require("body-parser");
const controller = require("./api/controller");
const UserModel = require('./api/schema/user')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors())
app.use(bodyParser.json());






controller(app);


app.get('/', (req,res) => res.send('Hello'));

//Connecting to db
const dbURI = "mongodb+srv://admin:admin@cluster0-u6qx9.mongodb.net/test?retryWrites=true&w=majority"

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10,
  useNewUrlParser: true  
};

mongoose.connect(dbURI, options).then(
  () => {
    app.listen(port,HOST,() => {
        console.log("Server listening on port " + port);
       
       });
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);


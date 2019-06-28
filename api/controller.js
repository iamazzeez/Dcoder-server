
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const UserModel = require('./schema/user');
const Threads = require('./schema/threads');

module.exports = function(app) {
 
//Register user
app.post("/register", (req, res, next) => {
  UserModel.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new UserModel({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});


//Login user
app.post("/login", (req, res, next) => {
  UserModel.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            'mykey123',
            {
                expiresIn: "10h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
            email: user[0].email,
            userId: user[0]._id
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//Create Thread
app.post('/threads', verifyToken, (req,res, next) => {
  const thread = new Threads({
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      email: req.body.email,
      username: req.body.userId
  
  })
   thread.save()
   .then(result =>  res.send(result))
   .catch(err => res.send(err))
      
})
  

  //Get all threads 
  app.get('/threads', verifyToken, (req, res) => {  
  
    Threads.find()
    .then(threads => {
      res.json(threads);
    })
    .catch(error => {
      res.json(error);
    });
  });
  
 
  
  // FORMAT OF TOKEN
  // Authorization: Bearer <access_token>
  
  // Verify Token
  function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      next();
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  
  }
  

};


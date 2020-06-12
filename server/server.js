const express = require('express')
const app = express()
const port = 3000
const morgan = require('morgan')
const cors = require('cors')
const mongoClient = require('mongodb').MongoClient
const objectID = require('mongodb').ObjectID
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')

//Middleware
app.use(morgan('tiny'))
app.use(cors())
app.use(bodyParser.json())

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))

mongoClient.connect(
    "mongodb+srv://admin:iy9IdwCPawjukzhy@crud-mongo-express-bcorw.mongodb.net/test?retryWrites=true&w=majority",
    { useUnifiedTopology: true }
  )
    .then((client) => {
      console.log("Connected to Database");
      const db = client.db("database");
      const guidesCollection = db.collection("guides");
      const usersCollection = db.collection("users");

      app.get("/guides", (req, res) => {
        guidesCollection.find({}).toArray()
        .then(result => res.send(result))
        .catch(err => console.error(err))
      })
      app.post("/guides", (req, res) => {
          guidesCollection.insertOne({"title": "xd"}) // Replace with req.body
          .then(console.log(res.send(req.body)))
          .catch(err => console.error(err))
      })
      app.post("/register", (req, res) => {
        let user = {email: "test@gmail.com", password: "sputnik24"}
        const saltRounds = 10;
        usersCollection.findOne({email: user.email})
        .then(result => {
          if (!result) {
            bcrypt.hash(user.password, saltRounds)
            .then((hash) => {
              usersCollection.insertOne({email: user.email, password: hash})
            });
            res.send("User was successfully added.")
          }
          res.send("A user with that email is already created.")
        })
      })
      app.post("/login", (req, res) => {
        let user = {email: "test@gmail.com", password: "sputnik24"}
        usersCollection.findOne({email: user.email})
        .then(result => {
          if (result) {
            bcrypt.compare(user.password, result.password).then((equal) => {
              if (equal) res.send({email: result.email})
              else res.send("Password is wrong")
          })
          }
          else res.send("Wrong email")
        })
      })
    })
    .catch((error) => console.error(error));
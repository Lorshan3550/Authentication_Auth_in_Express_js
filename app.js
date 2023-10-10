//jshint esversion:6
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption");


const app = express()
const port = 3000

app.use(express.static("public"))
app.set("view engine", 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email : String,
    password : String
})

var secret = "Thisisourlittlesecret";
userSchema.plugin(encrypt, { secret: secret , encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema)


app.get('/', function(req,res){
    res.render('home')
})

app.get('/register' , function(req,res){
    res.render('register')
})

app.get('/login', function(req,res){
    res.render('login')
})

app.post("/register", function(req, res){
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    })

    newUser.save()
    .then(res.render("secrets"))
    .catch((err) => {
        console.log(err)
    })
})

app.post("/login", function(req,res){
    const username = req.body.username
    const password = req.body.password

    User.findOne({email : username})
    .then((foundUser) => {
        if(foundUser.password === password){
            console.log(foundUser.password)
            res.render("secrets")
        }
        else{
            res.redirect("/")
        }
    })
    .catch((err) => {
        console.log(err)
    })
})

app.listen(port , () => {
    console.log(`Server running on port ${port}`)
})
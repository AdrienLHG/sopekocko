const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); 
const saucesRoutes = require("./routes/sauces"); 
const userRoutes = require("./routes/user"); 
const path = require('path');

// connexion à la base de donnée Mongo DB
mongoose.connect('mongodb+srv://Adrien:Admin@sauces.0opu2.mongodb.net/<dbname>?retryWrites=true&w=majority',
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// définition des headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); 
    next();
});

app.use(bodyParser.json()); 

app.use('/images', express.static(path.join(__dirname, 'images'))); 

app.use('/api/sauces', saucesRoutes); 
app.use('/api/auth', userRoutes); 

module.exports = app; // 
const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();

const db = require('./config.js');
const recipeRoutes = require('./routes/recipes.js');
const userRoutes = require('./routes/users.js');
const measureRoutes = require('./routes/measures.js');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use('/recipes',recipeRoutes);
app.use('/users',userRoutes);
// app.use('/measures',measureRoutes);

// app.post('/create', async (req, res) => {
//     try {
//         const recipe = req.body;
//         const response = await db.collection('recipes').add(recipe);
//         res.send(response).status(200);
//     }
//     catch {
//         console.log('error creating recipe');
//         res.send({msg:"Error creating recipe"}).status(400);
//     }
// })

 const PORT = 4000;
 app.listen(PORT, () => {
    console.log("Running on port "+PORT);
 })
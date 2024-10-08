const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();

const recipeRoutes = require('./routes/recipes.js');
const userRoutes = require('./routes/users.js');
const householdRoutes = require('./routes/households.js');
const shoppingListRoutes = require('./routes/shoppingList.js');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use('/recipes',recipeRoutes);
app.use('/users',userRoutes);
app.use('/household',householdRoutes);
app.use('/shoppingList', shoppingListRoutes);

const PORT = 4000;
app.listen(PORT, () => {
    console.log("Running on port "+PORT);
})
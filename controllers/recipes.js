
const db = require('../config.js');

const getRecipeUsers =  (doc,users) => {
    // const recipeUsers = []
    // users.forEach(user => {
    //     if (doc.data().users.includes(user.id)) {
    //         recipeUsers.push({...user.data(),id:user.id});
    //     }
    // })
    const recipeUsers = doc.data().users;
    return recipeUsers;

}
exports.getAll = async (req, res) => {
    const response = await db.collection('recipes').get();
    const users = await db.collection('users').get();
    const recipes = []
    response.forEach(  doc => {
        recipes.push({...doc.data(),users: getRecipeUsers(doc,users),id:doc.id})
    }
    )
    console.log(recipes);
    res.send(recipes).status(200);
}

exports.delete = async (req, res) => {
    const response = await db.collection('recipes').doc(req.params.id).delete();
    res.send(response).status(200);
}
exports.getOne = async (req, res) => {
    const response = await db.collection('recipes').doc(req.params.id).get();
    const users = await db.collection('users').get();
    res.send({...response.data(),id:response.id,users:getRecipeUsers(response,users)}).status(200);
}


exports.getForUser = async (req, res) => {
    const response = await db.collection('recipes').get();
    const filteredRecipes = []
    response.forEach(async doc => {
        if (doc.data().users.includes(req.params.id)) {
            filteredRecipes.push({...doc.data(),id: doc.id});
        }
    })
    res.send(filteredRecipes).status(200);
}

const checkRecipes = (recipes,inventory,conversionTable) => {
    recipes.forEach(recipe => {
        recipe.makeable = true;
        recipe.makeableScore = 0;
        Object.keys(recipe.ingredients).forEach(async ingredientName => {
            if (!inventory.hasOwnProperty(ingredientName)) {
                recipe.makeable = false;
            }
            else if (inventory[ingredientName].measure == recipe.ingredients[ingredientName].measure && inventory[ingredientName].amount < recipe.ingredients[ingredientName].amount) {
                recipe.makeable = false;
            }
            else {
                if (inventory[ingredientName].measure !== recipe.ingredients[ingredientName].measure) {
                    const conversions = {}
                    conversionTable.forEach(async unit => {
                        conversions[unit.id] = unit.data();
                    })
                    if (conversions.hasOwnProperty(recipe.ingredients[ingredientName].measure) && conversions.hasOwnProperty(inventory[ingredientName].measure)) {
                        // console.log('amount in recipe',conversions[recipe.ingredients[ingredientName].measure][inventory[ingredientName].measure] * recipe.ingredients[ingredientName].amount)
                        // console.log('amount in inventory',inventory[ingredientName].amount)
                        if (conversions[recipe.ingredients[ingredientName].measure][inventory[ingredientName].measure] * recipe.ingredients[ingredientName].amount > inventory[ingredientName].amount) {
                            recipe.makeable = false;
                        }
                        else {
                            recipe.makeableScore++;
                        }
                    }
                    else {
                        console.log('unknown measure, assuming unavailable');
                        recipe.makeable = false;
                        recipe.makeableScore++;
                    }
                }
                else {
                    recipe.makeableScore++;
                }
            }
        })
    })
    return recipes;
}


exports.getMakeableForUser = async (req, res) => {
    const response = await db.collection('recipes').get();
    const recipes = [];
    response.forEach(doc => {
        recipes.push(doc.data())
    })
    const userInfo = await db.collection('users').doc(req.params.id).get();
    const inventory = userInfo.data().inventory;
    const conversionTable = await db.collection('measures').get();
    // const checkedRecipes = await checkRecipes(recipes,inventory,conversionTable);
    res.send(await checkRecipes(recipes,inventory,conversionTable)).status(200);
}

exports.update = async (req, res) => {
    const newRecipe = req.body;
    const response = await db.collection('recipes').doc(req.params.id).set(newRecipe);
    res.send(response).status(200);
}

exports.updateIngredients = async (req, res) => {
    // const response = await db.collection('recipes').doc(req.params.id).get()
    // const recipe = await response.json();
    // recipe.ingredients = req.body;
    try {
        const updateResponse = await db.collection('recipes').doc(req.params.id).update({ingredients:req.body});
        res.send(updateResponse).status(200);
    }
    catch (err) {
        console.log(err);
    }
}
exports.updateIngredient = async (req, res) => {
    const changes = {}
    changes['ingredients.' + req.body.name] = {amount:req.body.amount,measure:req.body.measure};
    const updateResponse = await db.collection('recipes').doc(req.params.id).update(changes);
    res.send(updateResponse).status(200);
    
}
const {FieldValue} = require('firebase-admin/firestore');
exports.deleteIngredient = async (req, res) => {
    const changes = {}
    changes['ingredients.' + req.body.name] = FieldValue.delete();
    const updateResponse = await db.collection('recipes').doc(req.params.id).update(changes);
    res.send(updateResponse).status(200);
}

exports.create = async (req, res) => {
    try {
        const recipe = req.body;
        const response = await db.collection('recipes').add(recipe);
        res.send(response).status(200);
    }
    catch (error){
        res.send({msg:"Error creating recipe" + error}).status(400);
    }
}
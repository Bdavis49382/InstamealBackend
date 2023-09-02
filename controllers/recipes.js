
const db = require('../config.js');

const getRecipeUsers = async (doc) => {
    const users = await db.collection('users').get();
    const recipeUsers = []
    users.forEach(user => {
        if (doc.data().users.includes(user.id)) {
            recipeUsers.push({...user.data(),id:user.id});
        }
    })
    return recipeUsers;

}
exports.getAll = async (req, res) => {
    const response = await db.collection('recipes').get();
    const recipes = []
    response.forEach(async doc => {
        recipes.push({...doc.data(),users:await getRecipeUsers(doc),id:doc.id})
    }
    )
    res.send(recipes).status(200);
}

exports.getOne = async (req, res) => {
    const response = await db.collection('recipes').doc(req.params.id).get();
    res.send({...response.data(),id:response.id,users:await getRecipeUsers(response)}).status(200);
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

const db = require('../config.js');

const getRecipeUsers =  (doc,users) => {
    // const recipeUsers = []
    // users.forEach(user => {
    //     if (doc.data().users.includes(user.id)) {
    //         recipeUsers.push({...user.data(),id:user.id});
    //     }
    // })
    if (doc.data()) {
        const recipeUsers = doc.data().users;
        return recipeUsers;
    }

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

const sortRecipes = (recipe1,recipe2) => {
    if (recipe1.name.toLowerCase() < recipe2.name.toLowerCase()) {
        return -1;
    }
    else if (recipe1.name.toLowerCase() > recipe2.name.toLowerCase()) {
        return 1;
    }
    else {
        return 0;
    }
}


exports.getForUser = async (req, res) => {
    try {

        const response = await db.collection('recipes').get();
        const filteredRecipes = []
        response.forEach(async doc => {
            if (doc.data().users.includes(req.params.id)) {
                filteredRecipes.push({...doc.data(),id: doc.id});
            }
        })
        res.send(filteredRecipes.sort(sortRecipes)).status(200);
    }
    catch (error) {
        res.send(error).status(400);
    }
}
const greaterAmount = (ingredient1,ingredient2,conversions) => {
    // Returns how much greater the first ingredient is from the second
    if (ingredient1.measure === ingredient2.measure) {
        return Number(ingredient1.amount) - Number(ingredient2.amount);
    }
    else if (conversions.hasOwnProperty(ingredient1.measure) && conversions.hasOwnProperty(ingredient2.measure)) {
        return Number(ingredient1.amount) * conversions[ingredient1.measure][ingredient2.measure] - Number(ingredient2.amount)
    }
    else {
        return 0;
    }
}
const checkRecipes = (recipes,inventory,conversions) => {
    return recipes.map(recipe => {
        const missingIngredients = Object.keys(recipe.ingredients)
            .filter(ingredientName => !inventory.hasOwnProperty(ingredientName) || (inventory.hasOwnProperty(ingredientName) && greaterAmount(recipe.ingredients[ingredientName],inventory[ingredientName],conversions) >= 0))
        return {...recipe,makeable:missingIngredients.length==0,missingIngredients}
    })
}

const getConversions = async () => {
    const conversionTable = await db.collection('measures').get();
    const conversions = {}
    conversionTable.forEach( unit => {
        conversions[unit.id] = unit.data();
    })
    return conversions;
}

exports.getMakeableForUser = async (req, res) => {
    try {
    const response = await db.collection('recipes').get();
    const recipes = [];
    response.forEach(doc => {
        if (doc.data().users.includes(req.params.id)) {
            recipes.push(doc.data())
        }
    })
    const userInfo = await db.collection('users').doc(req.params.id).get();
    const inventory = userInfo.data().inventory;
    const conversions = await getConversions();
    res.send(await checkRecipes(recipes,inventory,conversions)).status(200);
    }
    catch (error) {
        res.send(error).status(400);
    }
}

exports.make = async (req, res) => {
    let response = await db.collection('recipes').doc(req.params.id).get();
    const recipe = response.data();
    response = await db.collection('users').doc(req.params.uid).get();
    const inventory = response.data().inventory; 
    const conversions = await getConversions();
    console.log(inventory)
    for ([item,value] of Object.entries(recipe.ingredients)) {
        if (inventory.hasOwnProperty(item)) {
            const amount_left = greaterAmount(inventory[item],value,conversions);
            if (amount_left > 0) {
                inventory[item].amount = amount_left;
            }
            else {
                res.send({"msg":`There was not enough ${item} in the inventory. Low by ${amount_left}`});
                return;
            }

        }
        else {
            res.send({"msg":`Inventory did not have ${item}`});
            return;
        }
    } 
    response = await db.collection('users').doc(req.params.uid).set({...response.data(),inventory})
    res.send(response).status(200)

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
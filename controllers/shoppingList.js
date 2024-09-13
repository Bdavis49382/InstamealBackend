const db = require('../config.js');

exports.getShoppingList = async (req, res) => {
    try {
        const shoppingListData = (await db.collection('shoppingLists').doc(req.headers.householdid).get()).data();
        res.send(shoppingListData.list);
    }
    catch (error) {
        res.send({"msg": "Error retrieving shopping list: " + error}).status(400);
    }
}

exports.addItems = async (req, res) => {
    try {
        const shoppingListData = (await db.collection('shoppingLists').doc(req.headers.householdid).get()).data();
        const changes = {};
        changes.list = [...shoppingListData.list, ...req.body.items];
        const updateResponse = await db.collection('shoppingLists').doc(req.headers.householdid).update(changes);
        res.send(updateResponse).status(200);
    }
    catch (error) {
        res.send({"msg": "Error adding to shopping list: " + error}).status(400);
    }
    
}

exports.removeItem = async (req, res) => {
    try {
        const shoppingListData = (await db.collection('shoppingLists').doc(req.headers.householdid).get()).data();
        const changes = {};
        changes.list = shoppingListData.list;
        changes.list.splice(req.params.index,1);
        const updateResponse = await db.collection('shoppingLists').doc(req.headers.householdid).update(changes);
        res.send(updateResponse).status(200);
    }
    catch (error) {
        res.send({"msg": "Error deleting from shopping list: " + error}).status(400);
    }
}

exports.updateItem = async (req, res) => {
    try {
        const shoppingListData = (await db.collection('shoppingLists').doc(req.headers.householdid).get()).data();
        const changes = {};
        changes.list = shoppingListData.list;
        changes.list[req.params.index,1] = req.body.item;
        const updateResponse = await db.collection('shoppingLists').doc(req.headers.householdid).update(changes);
        res.send(updateResponse).status(200);
    }
    catch (error) {
        res.send({"msg": "Error updating item in shopping list: " + error}).status(400);
    }
}
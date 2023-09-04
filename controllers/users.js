const db = require('../config.js');


exports.getAll = async (req, res) => {
    const response = await db.collection('users').get();
    const users = []
    response.forEach(doc => users.push({...doc.data(),id:doc.id}))
    res.send(users).status(200);
}

exports.getOne = async (req, res) => {
    const response = await db.collection('users').doc(req.params.id).get();
    res.send(response.data()).status(200);
}

exports.updateIngredient = async (req, res) => {
    const response = await db.collection('users').doc(req.params.id).get();
    const user = response.data();
    user.inventory[req.body.ingredient].amount = req.body.newAmount;
    if (req.body.measure) {
        user.inventory[req.body.ingredient].measure = req.body.measure;
    }
    const updateResponse = await db.collection('users').doc(req.params.id).set(user);
    res.send({msg:'successfully updated value'}).status(200);
}

exports.deleteIngredient = async (req, res) => {
    const response = await db.collection('users').doc(req.params.id).get();
    const user = response.data();
    delete user.inventory[req.body.ingredient]
    const deleteResponse = await db.collection('users').doc(req.params.id).set(user);
    res.send({msg:'deleted value'}).status(200);
}

exports.addIngredient = async (req, res) => {
    const response = await db.collection('users').doc(req.params.id).get();
    const user = response.data();
    user.inventory[req.body.ingredient] = {"amount":req.body.amount,"measure":req.body.measure,"category":req.body.category};
    const addResponse = await db.collection('users').doc(req.params.id).set(user);
    res.send({msg:'added value'}).status(200);
}

exports.create = async (req, res) => {
    try {
        const user = req.body;
        const response = await db.collection('users').add(user);
        res.send(response).status(200);
    }
    catch (error){
        res.send({msg:"Error creating user" + error}).status(400);
    }
}
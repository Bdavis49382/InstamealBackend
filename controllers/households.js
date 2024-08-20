
const db = require('../config.js');


exports.getAll = async (req, res) => {
    const response = await db.collection('households').get();
    const households = []
    response.forEach(doc => households.push(doc.data()))
    res.send(households).status(200);
}

exports.getOne = async (req, res) => {
    const response = await db.collection('households').doc(req.params.id).get();
    console.log(req.headers);
    res.send(response.data()).status(200);
}
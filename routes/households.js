const express = require('express');
const router = express.Router();

const householdsController = require('../controllers/households.js');

router.get('/',householdsController.getAll);
router.get('/:id',householdsController.getOne);
// router.put('/:id/addUser',householdsController.addUser);

// router.get('/shoppingList',householdsController.getShoppingList);
// router.delete('/shoppingList/:itemId', householdsController.removeListItem);
// router.post('/shoppingList', householdsController.addListItems);
// router.put('/shoppingList/:itemId', householdsController.updateListItem);


module.exports = router;
const express = require('express');
const router = express.Router();

const shoppingListController = require('../controllers/shoppingList.js');


router.get('/',shoppingListController.getShoppingList);
router.post('/', shoppingListController.addItems);
router.delete('/:index', shoppingListController.removeItem);
router.put('/:index', shoppingListController.updateItem);


module.exports = router;
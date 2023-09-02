const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.js');

router.get('/',usersController.getAll);
router.get('/:id',usersController.getOne);
router.post('/create',usersController.create);
router.post('/:id/addIngredient',usersController.addIngredient);
router.put('/:id/updateIngredient',usersController.updateIngredient);
router.delete('/:id/deleteIngredient',usersController.deleteIngredient);

module.exports = router;
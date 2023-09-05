const express = require('express');
const router = express.Router();

const recipesController = require('../controllers/recipes.js');

router.get('/',recipesController.getAll);
router.get('/:id',recipesController.getOne);
router.get('/forUser/:id',recipesController.getForUser);
router.get('/makeableForUser/:id',recipesController.getMakeableForUser);
router.post('/create',recipesController.create);
router.put('/update/:id',recipesController.update);
router.put('/updateIngredients/:id',recipesController.updateIngredients);
router.delete('/delete/:id',recipesController.delete);

module.exports = router;
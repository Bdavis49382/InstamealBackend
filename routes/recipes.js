const express = require('express');
const router = express.Router();

const recipesController = require('../controllers/recipes.js');

router.get('/',recipesController.getAll);
// router.get('/:id',recipesController.getOne);
router.get('/chalkboard', recipesController.getChalkboard);
router.put('/chalkboard/:id', recipesController.addRecipeToChalkboard);
router.delete('/chalkboard/:id', recipesController.makeRecipe);
router.get('/suggested', recipesController.getSuggestedRecipes);
router.post('/search', recipesController.searchRecipes);
router.post('/save', recipesController.saveRecipe);
router.put('/toggleFavorite/:id', recipesController.toggleFavorite);

router.get('/forUser/:id',recipesController.getForUser);
router.get('/makeableForUser/:id',recipesController.getMakeableForUser);
router.post('/create',recipesController.create);
router.post('/make/:id/user=:uid',recipesController.make);
router.post('/addIngredient/:id',recipesController.updateIngredient);
router.put('/update/:id',recipesController.update);
router.put('/updateIngredients/:id',recipesController.updateIngredients);
router.put('/updateIngredient/:id',recipesController.updateIngredient);
router.delete('/delete/:id',recipesController.delete);
router.delete('/deleteIngredient/:id',recipesController.deleteIngredient);

module.exports = router;
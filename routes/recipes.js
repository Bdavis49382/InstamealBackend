const express = require('express');
const router = express.Router();

const recipesController = require('../controllers/recipes.js');

router.get('/',recipesController.getAll);
router.get('/:id',recipesController.getOne);
router.get('/forUser/:id',recipesController.getForUser);
router.get('/makeableForUser/:id',recipesController.getMakeableForUser);
router.post('/create',recipesController.create);

module.exports = router;
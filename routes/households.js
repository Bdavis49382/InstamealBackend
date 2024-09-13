const express = require('express');
const router = express.Router();

const householdsController = require('../controllers/households.js');

router.get('/',householdsController.getAll);
router.get('/:id',householdsController.getOne);
// router.put('/:id/addUser',householdsController.addUser);


module.exports = router;
const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('/', auth, multer, sauceCtrl.createSauce); // On rajoute les middlewares auth et multer sur les routes qu'on veut protéger //
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.findOneSauce);
router.get('/', auth, sauceCtrl.findAllSauces);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);



module.exports = router;

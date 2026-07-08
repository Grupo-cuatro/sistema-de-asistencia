const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.post('/', loginController.ingresar);
router.post('/salir', loginController.salir);
router.get('/sesion', loginController.sesionActual);

module.exports = router;

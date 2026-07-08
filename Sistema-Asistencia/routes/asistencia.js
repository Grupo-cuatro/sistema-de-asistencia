const express = require('express');
const router = express.Router();
const controlador = require('../controllers/asistenciaController');
const { requiereSesion } = require('./middlewares');

router.use(requiereSesion);

router.get('/', controlador.listar);
router.post('/', controlador.registrar);

module.exports = router;

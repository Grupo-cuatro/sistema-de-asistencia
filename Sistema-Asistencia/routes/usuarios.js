const express = require('express');
const router = express.Router();
const controlador = require('../controllers/usuariosController');
const { requiereSesion, requiereAdmin } = require('./middlewares');

router.use(requiereSesion, requiereAdmin);

router.get('/', controlador.listar);
router.post('/', controlador.registrar);
router.put('/:id', controlador.editar);
router.delete('/:id', controlador.eliminar);

module.exports = router;

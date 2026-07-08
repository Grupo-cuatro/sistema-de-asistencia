const express = require('express');
const router = express.Router();
const controlador = require('../controllers/estudiantesController');
const { requiereSesion } = require('./middlewares');

router.use(requiereSesion);

router.get('/', controlador.listar);
router.get('/buscar', controlador.buscar);
router.post('/', controlador.registrar);
router.put('/:id', controlador.editar);
router.patch('/:id/desactivar', controlador.desactivar);
router.delete('/:id', controlador.eliminar);

module.exports = router;

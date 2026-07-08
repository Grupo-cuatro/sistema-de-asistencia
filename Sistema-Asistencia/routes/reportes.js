const express = require('express');
const router = express.Router();
const controlador = require('../controllers/reportesController');
const { requiereSesion, requiereAdmin } = require('./middlewares');

router.use(requiereSesion);

router.get('/estudiante/:id', controlador.porEstudiante);
router.get('/carrera/:carrera', controlador.porCarrera);
router.get('/ciclo/:ciclo', controlador.porCiclo);
router.get('/fecha/:fecha', controlador.porFecha);
router.get('/exportar/csv', controlador.exportarCSV);
router.get('/auditoria', requiereAdmin, controlador.auditoria);

module.exports = router;

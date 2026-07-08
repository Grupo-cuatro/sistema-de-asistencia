// =====================================================
// CONTROLADOR DE REPORTES
// =====================================================

const db = require('../database/conexion');

// ===== REPORTE POR ESTUDIANTE =====
function porEstudiante(req, res) {

    const { id } = req.params;

    db.all(
        `SELECT a.fecha, a.hora, a.estado, a.observacion
         FROM asistencia a WHERE a.estudiante_id = ?
         ORDER BY a.fecha DESC`,
        [id],
        (err, filas) => {
            if (err) return res.status(500).json({ error: 'Error al generar el reporte' });
            res.json(filas);
        }
    );
}

// ===== REPORTE POR CARRERA =====
function porCarrera(req, res) {

    const { carrera } = req.params;

    db.all(
        `SELECT e.dni, e.nombres, e.apellidos, e.ciclo, a.fecha, a.hora, a.estado
         FROM asistencia a
         JOIN estudiantes e ON e.id = a.estudiante_id
         WHERE e.carrera = ?
         ORDER BY a.fecha DESC`,
        [carrera],
        (err, filas) => {
            if (err) return res.status(500).json({ error: 'Error al generar el reporte' });
            res.json(filas);
        }
    );
}

// ===== REPORTE POR CICLO =====
function porCiclo(req, res) {

    const { ciclo } = req.params;

    db.all(
        `SELECT e.dni, e.nombres, e.apellidos, e.carrera, a.fecha, a.hora, a.estado
         FROM asistencia a
         JOIN estudiantes e ON e.id = a.estudiante_id
         WHERE e.ciclo = ?
         ORDER BY a.fecha DESC`,
        [ciclo],
        (err, filas) => {
            if (err) return res.status(500).json({ error: 'Error al generar el reporte' });
            res.json(filas);
        }
    );
}

// ===== REPORTE POR FECHA =====
function porFecha(req, res) {

    const { fecha } = req.params;

    db.all(
        `SELECT e.dni, e.nombres, e.apellidos, e.carrera, e.ciclo, a.hora, a.estado
         FROM asistencia a
         JOIN estudiantes e ON e.id = a.estudiante_id
         WHERE a.fecha = ?
         ORDER BY e.apellidos`,
        [fecha],
        (err, filas) => {
            if (err) return res.status(500).json({ error: 'Error al generar el reporte' });
            res.json(filas);
        }
    );
}

// ===== EXPORTAR CSV =====
function exportarCSV(req, res) {

    const { tipo, valor } = req.query; // tipo: general | estudiante | carrera | ciclo | fecha

    let sql = `
        SELECT e.dni, e.nombres, e.apellidos, e.carrera, e.ciclo, a.fecha, a.hora, a.estado, a.observacion
        FROM asistencia a
        JOIN estudiantes e ON e.id = a.estudiante_id
        WHERE 1=1
    `;
    const params = [];

    if (tipo === 'estudiante' && valor) { sql += ' AND e.id = ?'; params.push(valor); }
    if (tipo === 'carrera' && valor) { sql += ' AND e.carrera = ?'; params.push(valor); }
    if (tipo === 'ciclo' && valor) { sql += ' AND e.ciclo = ?'; params.push(valor); }
    if (tipo === 'fecha' && valor) { sql += ' AND a.fecha = ?'; params.push(valor); }

    sql += ' ORDER BY a.fecha DESC';

    db.all(sql, params, (err, filas) => {

        if (err) return res.status(500).json({ error: 'Error al exportar el reporte' });

        const encabezado = 'DNI,Nombres,Apellidos,Carrera,Ciclo,Fecha,Hora,Estado,Observacion\n';

        const cuerpo = filas.map(f => [
            f.dni, f.nombres, f.apellidos, f.carrera || '', f.ciclo || '',
            f.fecha, f.hora, f.estado, (f.observacion || '').replace(/,/g, ';')
        ].join(',')).join('\n');

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="reporte_asistencia.csv"');
        res.send(encabezado + cuerpo);
    });
}

// ===== AUDITORÍA (solo administrador) =====
function auditoria(req, res) {

    db.all('SELECT * FROM auditoria ORDER BY fecha DESC LIMIT 200', (err, filas) => {
        if (err) return res.status(500).json({ error: 'Error al obtener auditoría' });
        res.json(filas);
    });
}

module.exports = { porEstudiante, porCarrera, porCiclo, porFecha, exportarCSV, auditoria };

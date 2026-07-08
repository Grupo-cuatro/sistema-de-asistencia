// =====================================================
// CONTROLADOR DE ASISTENCIA
// =====================================================

const db = require('../database/conexion');
const { registrarAuditoria } = require('./auditoriaHelper');

const ESTADOS_VALIDOS = ['Presente', 'Tarde', 'Falta', 'Justificado'];

// ===== REGISTRAR ASISTENCIA =====
function registrar(req, res) {

    const { estudiante_id, dni, estado, observacion } = req.body;

    if (!estado || !ESTADOS_VALIDOS.includes(estado)) {
        return res.status(400).json({ error: 'Estado de asistencia inválido' });
    }

    const ahora = new Date();
    const fecha = ahora.toISOString().split('T')[0];
    const hora = ahora.toTimeString().split(' ')[0];

    // Permite identificar al estudiante por id o por DNI
    const obtenerId = (cb) => {

        if (estudiante_id) return cb(null, estudiante_id);

        db.get('SELECT id FROM estudiantes WHERE dni = ?', [dni], (err, fila) => {
            if (err) return cb(err);
            if (!fila) return cb(new Error('NO_ENCONTRADO'));
            cb(null, fila.id);
        });
    };

    obtenerId((err, idEstudiante) => {

        if (err) {
            if (err.message === 'NO_ENCONTRADO') {
                return res.status(404).json({ error: 'Estudiante no encontrado' });
            }
            return res.status(500).json({ error: 'Error del servidor' });
        }

        db.get(
            'SELECT id FROM asistencia WHERE estudiante_id = ? AND fecha = ?',
            [idEstudiante, fecha],
            (err, existe) => {

                if (err) return res.status(500).json({ error: 'Error del servidor' });

                if (existe) {
                    return res.status(409).json({ error: 'El estudiante ya tiene asistencia registrada hoy' });
                }

                db.run(
                    `INSERT INTO asistencia (estudiante_id, fecha, hora, estado, observacion)
                     VALUES (?, ?, ?, ?, ?)`,
                    [idEstudiante, fecha, hora, estado, observacion || null],
                    function (err) {

                        if (err) return res.status(500).json({ error: 'Error al registrar asistencia' });

                        registrarAuditoria(req.session.usuario, `Registró asistencia (${estado}) para estudiante ID ${idEstudiante}`);
                        res.json({ id: this.lastID, mensaje: 'Asistencia registrada' });
                    }
                );
            }
        );
    });
}

// ===== LISTAR / HISTORIAL (con filtros opcionales) =====
function listar(req, res) {

    const { estudiante_id, fecha, estado } = req.query;

    let sql = `
        SELECT a.*, e.dni, e.nombres, e.apellidos, e.carrera, e.ciclo
        FROM asistencia a
        JOIN estudiantes e ON e.id = a.estudiante_id
        WHERE 1=1
    `;
    const params = [];

    if (estudiante_id) { sql += ' AND a.estudiante_id = ?'; params.push(estudiante_id); }
    if (fecha) { sql += ' AND a.fecha = ?'; params.push(fecha); }
    if (estado) { sql += ' AND a.estado = ?'; params.push(estado); }

    sql += ' ORDER BY a.fecha DESC, a.hora DESC';

    db.all(sql, params, (err, filas) => {
        if (err) return res.status(500).json({ error: 'Error al listar asistencia' });
        res.json(filas);
    });
}

module.exports = { registrar, listar };

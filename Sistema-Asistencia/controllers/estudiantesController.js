// =====================================================
// CONTROLADOR DE ESTUDIANTES
// =====================================================

const db = require('../database/conexion');
const { registrarAuditoria } = require('./auditoriaHelper');

// ===== LISTAR TODOS =====
function listar(req, res) {

    db.all('SELECT * FROM estudiantes ORDER BY apellidos, nombres', (err, filas) => {

        if (err) return res.status(500).json({ error: 'Error al listar estudiantes' });
        res.json(filas);
    });
}

// ===== BUSCAR (dni, nombres, apellidos, carrera, ciclo) =====
function buscar(req, res) {

    const q = `%${req.query.q || ''}%`;

    db.all(
        `SELECT * FROM estudiantes
         WHERE dni LIKE ? OR nombres LIKE ? OR apellidos LIKE ?
            OR carrera LIKE ? OR ciclo LIKE ?
         ORDER BY apellidos, nombres`,
        [q, q, q, q, q],
        (err, filas) => {
            if (err) return res.status(500).json({ error: 'Error en la búsqueda' });
            res.json(filas);
        }
    );
}

// ===== REGISTRAR =====
function registrar(req, res) {

    const { codigo, dni, nombres, apellidos, correo, carrera, ciclo, foto } = req.body;

    if (!dni || !nombres || !apellidos) {
        return res.status(400).json({ error: 'Complete DNI, nombres y apellidos' });
    }

    if (!/^\d{8}$/.test(dni)) {
        return res.status(400).json({ error: 'El DNI debe tener 8 dígitos' });
    }

    db.run(
        `INSERT INTO estudiantes (codigo, dni, nombres, apellidos, correo, carrera, ciclo, foto, estado)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Activo')`,
        [codigo || null, dni, nombres, apellidos, correo || null, carrera || null, ciclo || null, foto || null],
        function (err) {

            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(409).json({ error: 'DNI ya registrado' });
                }
                return res.status(500).json({ error: 'Error al registrar estudiante' });
            }

            registrarAuditoria(req.session.usuario, `Registró al estudiante ${nombres} ${apellidos} (DNI ${dni})`);
            res.json({ id: this.lastID, mensaje: 'Estudiante registrado' });
        }
    );
}

// ===== EDITAR =====
function editar(req, res) {

    const { id } = req.params;
    const { codigo, dni, nombres, apellidos, correo, carrera, ciclo, foto } = req.body;

    db.get('SELECT * FROM estudiantes WHERE id = ?', [id], (err, existente) => {

        if (err) return res.status(500).json({ error: 'Error del servidor' });
        if (!existente) return res.status(404).json({ error: 'Estudiante no encontrado' });

        const fotoFinal = foto && foto !== '' ? foto : existente.foto;

        db.run(
            `UPDATE estudiantes SET
                codigo = ?, dni = ?, nombres = ?, apellidos = ?,
                correo = ?, carrera = ?, ciclo = ?, foto = ?
             WHERE id = ?`,
            [codigo || null, dni, nombres, apellidos, correo || null, carrera || null, ciclo || null, fotoFinal, id],
            function (err) {

                if (err) return res.status(500).json({ error: 'Error al actualizar estudiante' });

                registrarAuditoria(req.session.usuario, `Actualizó al estudiante ID ${id}`);
                res.json({ mensaje: 'Estudiante actualizado' });
            }
        );
    });
}

// ===== DESACTIVAR (baja lógica) =====
function desactivar(req, res) {

    const { id } = req.params;

    db.run('UPDATE estudiantes SET estado = ? WHERE id = ?', ['Inactivo', id], function (err) {

        if (err) return res.status(500).json({ error: 'Error al desactivar estudiante' });

        registrarAuditoria(req.session.usuario, `Desactivó al estudiante ID ${id}`);
        res.json({ mensaje: 'Estudiante desactivado' });
    });
}

// ===== ELIMINAR =====
function eliminar(req, res) {

    const { id } = req.params;

    db.run('DELETE FROM estudiantes WHERE id = ?', [id], function (err) {

        if (err) return res.status(500).json({ error: 'Error al eliminar estudiante' });
        if (this.changes === 0) return res.status(404).json({ error: 'Estudiante no encontrado' });

        registrarAuditoria(req.session.usuario, `Eliminó al estudiante ID ${id}`);
        res.json({ mensaje: 'Estudiante eliminado' });
    });
}

module.exports = { listar, buscar, registrar, editar, desactivar, eliminar };

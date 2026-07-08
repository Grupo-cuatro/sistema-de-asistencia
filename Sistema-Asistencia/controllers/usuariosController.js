// =====================================================
// CONTROLADOR DE USUARIOS (Administración de accesos)
// =====================================================

const db = require('../database/conexion');
const bcrypt = require('bcrypt');
const { registrarAuditoria } = require('./auditoriaHelper');

// ===== LISTAR =====
function listar(req, res) {

    db.all(
        'SELECT id, usuario, rol, activo, fecha_creacion FROM usuarios ORDER BY usuario',
        (err, filas) => {
            if (err) return res.status(500).json({ error: 'Error al listar usuarios' });
            res.json(filas);
        }
    );
}

// ===== REGISTRAR =====
function registrar(req, res) {

    const { usuario, password, rol } = req.body;

    if (!usuario || !password || !rol) {
        return res.status(400).json({ error: 'Complete usuario, contraseña y rol' });
    }

    if (!['Administrador', 'Docente'].includes(rol)) {
        return res.status(400).json({ error: 'Rol inválido' });
    }

    const hash = bcrypt.hashSync(password, 10);

    db.run(
        'INSERT INTO usuarios (usuario, password, rol) VALUES (?, ?, ?)',
        [usuario, hash, rol],
        function (err) {

            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(409).json({ error: 'El usuario ya existe' });
                }
                return res.status(500).json({ error: 'Error al registrar usuario' });
            }

            registrarAuditoria(req.session.usuario, `Creó al usuario ${usuario} (${rol})`);
            res.json({ id: this.lastID, mensaje: 'Usuario creado' });
        }
    );
}

// ===== EDITAR (rol / contraseña / estado) =====
function editar(req, res) {

    const { id } = req.params;
    const { password, rol, activo } = req.body;

    const campos = [];
    const valores = [];

    if (rol) { campos.push('rol = ?'); valores.push(rol); }
    if (typeof activo !== 'undefined') { campos.push('activo = ?'); valores.push(activo ? 1 : 0); }
    if (password) { campos.push('password = ?'); valores.push(bcrypt.hashSync(password, 10)); }

    if (campos.length === 0) {
        return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    valores.push(id);

    db.run(`UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`, valores, function (err) {

        if (err) return res.status(500).json({ error: 'Error al actualizar usuario' });
        if (this.changes === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

        registrarAuditoria(req.session.usuario, `Modificó al usuario ID ${id}`);
        res.json({ mensaje: 'Usuario actualizado' });
    });
}

// ===== ELIMINAR =====
function eliminar(req, res) {

    const { id } = req.params;

    db.run('DELETE FROM usuarios WHERE id = ?', [id], function (err) {

        if (err) return res.status(500).json({ error: 'Error al eliminar usuario' });
        if (this.changes === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

        registrarAuditoria(req.session.usuario, `Eliminó al usuario ID ${id}`);
        res.json({ mensaje: 'Usuario eliminado' });
    });
}

module.exports = { listar, registrar, editar, eliminar };

// =====================================================
// CONTROLADOR DE LOGIN
// =====================================================

const db = require('../database/conexion');
const bcrypt = require('bcrypt');
const { registrarAuditoria } = require('./auditoriaHelper');

// ===== INICIAR SESIÓN =====
function ingresar(req, res) {

    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ error: 'Complete usuario y contraseña' });
    }

    db.get(
        'SELECT * FROM usuarios WHERE usuario = ? AND activo = 1',
        [usuario],
        (err, fila) => {

            if (err) return res.status(500).json({ error: 'Error del servidor' });

            if (!fila) {
                return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
            }

            const claveValida = bcrypt.compareSync(password, fila.password);

            if (!claveValida) {
                return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
            }

            req.session.usuario = fila.usuario;
            req.session.rol = fila.rol;
            req.session.usuarioId = fila.id;

            registrarAuditoria(fila.usuario, 'Inicio de sesión');

            res.json({
                usuario: fila.usuario,
                rol: fila.rol,
                mensaje: 'Bienvenido ' + fila.rol
            });
        }
    );
}

// ===== CERRAR SESIÓN =====
function salir(req, res) {

    const usuario = req.session.usuario;

    req.session.destroy(() => {
        if (usuario) registrarAuditoria(usuario, 'Cierre de sesión');
        res.json({ mensaje: 'Sesión finalizada' });
    });
}

// ===== OBTENER SESIÓN ACTUAL =====
function sesionActual(req, res) {

    if (!req.session.usuario) {
        return res.status(401).json({ error: 'No hay sesión activa' });
    }

    res.json({
        usuario: req.session.usuario,
        rol: req.session.rol
    });
}

module.exports = { ingresar, salir, sesionActual };

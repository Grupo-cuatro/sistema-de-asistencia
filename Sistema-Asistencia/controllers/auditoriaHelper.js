// =====================================================
// HELPER DE AUDITORÍA
// Usado por los demás controladores para registrar acciones
// =====================================================

const db = require('../database/conexion');

function registrarAuditoria(usuario, accion) {

    db.run(
        'INSERT INTO auditoria (usuario, accion) VALUES (?, ?)',
        [usuario || 'desconocido', accion],
        (err) => {
            if (err) console.error('❌ Error al registrar auditoría:', err.message);
        }
    );
}

module.exports = { registrarAuditoria };

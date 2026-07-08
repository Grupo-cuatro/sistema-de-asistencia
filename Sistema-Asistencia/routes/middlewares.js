// =====================================================
// MIDDLEWARES DE AUTENTICACIÓN Y ROLES
// =====================================================

function requiereSesion(req, res, next) {

    if (!req.session || !req.session.usuario) {
        return res.status(401).json({ error: 'Debe iniciar sesión' });
    }
    next();
}

function requiereAdmin(req, res, next) {

    if (!req.session || req.session.rol !== 'Administrador') {
        return res.status(403).json({ error: 'Acceso solo para administradores' });
    }
    next();
}

module.exports = { requiereSesion, requiereAdmin };

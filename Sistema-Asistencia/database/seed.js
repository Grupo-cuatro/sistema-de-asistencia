// =====================================================
// SEED - USUARIOS INICIALES
// Mantiene los mismos usuarios de prueba del Sprint 2
// (admin / 1234) y (docente / 1234)
// =====================================================

const db = require('./conexion');
const bcrypt = require('bcrypt');

function seed() {

    db.get('SELECT COUNT(*) AS total FROM usuarios', (err, row) => {

        if (err) {
            console.error('❌ Error al verificar usuarios:', err.message);
            return;
        }

        if (row.total === 0) {

            const claveHash = bcrypt.hashSync('1234', 10);

            const usuarios = [
                ['admin', claveHash, 'Administrador'],
                ['docente', claveHash, 'Docente']
            ];

            const stmt = db.prepare(
                'INSERT INTO usuarios (usuario, password, rol) VALUES (?, ?, ?)'
            );

            usuarios.forEach(u => stmt.run(u));

            stmt.finalize(() => {
                console.log('✅ Usuarios de prueba creados: admin/1234, docente/1234');
            });

        } else {
            console.log('ℹ️  Usuarios ya existentes, no se ejecuta el seed');
        }

    });
}

module.exports = seed;

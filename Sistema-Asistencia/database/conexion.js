// =====================================================
// CONEXIÓN A LA BASE DE DATOS SQLITE
// =====================================================

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const rutaBD = path.join(__dirname, '..', 'database.db');

const db = new sqlite3.Database(rutaBD, (err) => {
    if (err) {
        console.error('❌ Error al conectar con la base de datos:', err.message);
    } else {
        console.log('✅ Conectado a la base de datos SQLite (database.db)');
        db.run('PRAGMA foreign_keys = ON');
    }
});

module.exports = db;

// =====================================================
// CREACIÓN DE TABLAS - SPRINT 3
// =====================================================

const db = require('./conexion');

function crearTablas() {

    db.serialize(() => {

        // ===== USUARIOS =====
        db.run(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                rol TEXT NOT NULL CHECK(rol IN ('Administrador','Docente')),
                activo INTEGER DEFAULT 1,
                fecha_creacion TEXT DEFAULT (datetime('now','localtime'))
            )
        `);

        // ===== ESTUDIANTES =====
        db.run(`
            CREATE TABLE IF NOT EXISTS estudiantes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                codigo TEXT,
                dni TEXT UNIQUE NOT NULL,
                nombres TEXT NOT NULL,
                apellidos TEXT NOT NULL,
                correo TEXT,
                carrera TEXT,
                ciclo TEXT,
                foto TEXT,
                estado TEXT DEFAULT 'Activo',
                fecha_registro TEXT DEFAULT (datetime('now','localtime'))
            )
        `);

        // ===== ASISTENCIA =====
        db.run(`
            CREATE TABLE IF NOT EXISTS asistencia (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                estudiante_id INTEGER NOT NULL,
                fecha TEXT NOT NULL,
                hora TEXT NOT NULL,
                estado TEXT NOT NULL CHECK(estado IN ('Presente','Tarde','Falta','Justificado')),
                observacion TEXT,
                FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE
            )
        `);

        // ===== AUDITORÍA =====
        db.run(`
            CREATE TABLE IF NOT EXISTS auditoria (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario TEXT,
                accion TEXT,
                fecha TEXT DEFAULT (datetime('now','localtime'))
            )
        `);

        console.log('✅ Tablas verificadas/creadas correctamente');
    });
}

module.exports = crearTablas;

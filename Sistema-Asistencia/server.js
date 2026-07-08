// =====================================================
// SERVIDOR PRINCIPAL - SISTEMA DE ASISTENCIA ESCOLAR
// Sprint 3 - Node.js + Express + SQLite
// =====================================================

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const crearTablas = require('./database/crearBD');
const seed = require('./database/seed');

const rutasLogin = require('./routes/login');
const rutasEstudiantes = require('./routes/estudiantes');
const rutasAsistencia = require('./routes/asistencia');
const rutasUsuarios = require('./routes/usuarios');
const rutasReportes = require('./routes/reportes');
const { requiereSesion } = require('./routes/middlewares');

const app = express();
const PUERTO = process.env.PORT || 3000;

// ===== INICIALIZAR BASE DE DATOS =====
crearTablas();
setTimeout(seed, 300); // pequeño margen para asegurar que las tablas ya existen

// ===== MIDDLEWARES GLOBALES =====
app.use(cors());
app.use(express.json({ limit: '5mb' })); // limit alto por las fotos en base64
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use(session({
    secret: 'sistema-asistencia-sprint3-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 4 // 4 horas
    }
}));

// ===== ARCHIVOS ESTÁTICOS (public) =====
app.use(express.static(path.join(__dirname, 'public')));

// ===== API REST =====
app.use('/api/login', rutasLogin);
app.use('/api/estudiantes', rutasEstudiantes);
app.use('/api/asistencia', rutasAsistencia);
app.use('/api/usuarios', rutasUsuarios);
app.use('/api/reportes', rutasReportes);

// ===== VISTAS PROTEGIDAS (views/) =====
// Estas páginas requieren sesión iniciada; si no hay sesión, redirige al login.

function servirVista(nombreArchivo) {

    return (req, res) => {

        if (!req.session || !req.session.usuario) {
            return res.redirect('/login.html');
        }

        res.sendFile(path.join(__dirname, 'views', nombreArchivo));
    };
}

app.get('/dashboard.html', servirVista('dashboard.html'));
app.get('/estudiantes.html', servirVista('estudiantes.html'));
app.get('/asistencia.html', servirVista('asistencia.html'));
app.get('/usuarios.html', servirVista('usuarios.html'));
app.get('/reportes.html', servirVista('reportes.html'));

// ===== RUTA RAÍZ =====
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== INICIO DEL SERVIDOR =====
app.listen(PUERTO, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PUERTO}`);
});

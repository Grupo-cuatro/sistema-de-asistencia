# Sistema de Asistencia Escolar — Sprint 3

Backend con **Node.js + Express + SQLite**, manteniendo el diseño (HTML/CSS) del Sprint 2.
No usa Python, MySQL ni PHP.

## Estructura

```
Sistema-Asistencia/
├── server.js
├── package.json
├── database.db            <- se crea solo al iniciar el servidor
├── database/
│   ├── crearBD.js          <- crea las tablas si no existen
│   ├── conexion.js         <- conexión a database.db
│   └── seed.js             <- crea usuarios admin/docente de prueba
├── routes/                 <- rutas Express (una por módulo)
├── controllers/            <- lógica de negocio de cada módulo
├── public/                 <- front-end (servido como estático)
│   ├── css/styles.css
│   ├── js/                 <- login.js, auth.js, estudiantes.js, asistencia.js, usuarios.js, reportes.js, dashboard.js
│   ├── img/
│   ├── index.html          <- landing pública
│   └── login.html          <- inicio de sesión
└── views/                  <- páginas protegidas (requieren sesión)
    ├── dashboard.html
    ├── estudiantes.html
    ├── asistencia.html
    ├── usuarios.html        (solo Administrador)
    └── reportes.html
```

## Instalación y ejecución

Requiere Node.js instalado (v18+ recomendado).

```bash
cd Sistema-Asistencia
npm install
node server.js
```

El servidor queda en: **http://localhost:3000**

Al iniciar, `server.js` crea automáticamente `database.db` con las tablas
(`usuarios`, `estudiantes`, `asistencia`, `auditoria`) y siembra dos usuarios
de prueba (contraseñas cifradas con bcrypt):

| Usuario | Contraseña | Rol            |
|---------|-----------|----------------|
| admin   | 1234      | Administrador  |
| docente | 1234      | Docente        |

## Funcionalidades del Sprint 3

- **Login** con sesiones de servidor (`express-session`) y contraseñas con `bcrypt`.
- **Roles**: Administrador y Docente (el módulo Usuarios se oculta para Docente).
- **Estudiantes**: registrar, editar, desactivar, eliminar, buscar, listar (con foto en base64).
- **Asistencia**: Presente, Tarde, Falta, Justificado — con validación de un registro por estudiante/día.
- **Reportes**: por estudiante, por carrera, por ciclo y por fecha.
- **Exportación a CSV** de cualquier reporte.
- **Auditoría**: registra inicios/cierres de sesión, altas, ediciones y eliminaciones de estudiantes,
  usuarios y registros de asistencia. Visible en la vista de Usuarios (solo Administrador).

## Notas

- La base de datos es un único archivo `database.db`, fácil de respaldar o entregar.
- Si necesitas reiniciar los datos, simplemente borra `database.db` y vuelve a iniciar el servidor
  (se recreará vacío con los usuarios de prueba).

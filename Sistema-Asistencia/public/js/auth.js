// =========================================
// SESIÓN COMPARTIDA - SPRINT 3
// Verifica la sesión contra el servidor y
// pinta el usuario/rol actual en el header.
// =========================================

let SESION_ACTUAL = null;

async function verificarSesion() {

    try {

        const respuesta = await fetch('/api/login/sesion');

        if (!respuesta.ok) {
            window.location.href = '/login.html';
            return null;
        }

        const datos = await respuesta.json();
        SESION_ACTUAL = datos;

        const elUsuario = document.getElementById('usuarioActual');
        const elRol = document.getElementById('rolActual');

        if (elUsuario) elUsuario.textContent = datos.usuario;

        if (elRol) {
            elRol.textContent = datos.rol;
            elRol.className = 'badge ' + (datos.rol === 'Administrador' ? 'badge-admin' : 'badge-docente');
        }

        // Oculta módulos exclusivos de Administrador para Docentes
        if (datos.rol !== 'Administrador') {
            document.querySelectorAll('.solo-admin').forEach(el => el.style.display = 'none');
        }

        return datos;

    } catch (error) {

        window.location.href = '/login.html';
        return null;
    }

}

async function cerrarSesion() {

    if (!confirm('¿Desea cerrar sesión?')) return;

    try {
        await fetch('/api/login/salir', { method: 'POST' });
    } catch (error) {
        // Aunque falle la petición, igual se redirige al login
    }

    window.location.href = '/login.html';
}

// Se ejecuta automáticamente en cada vista protegida
verificarSesion();

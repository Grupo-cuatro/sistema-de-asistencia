// =========================================
// LOGIN - SPRINT 3 (llama a la API)
// =========================================

function mostrarError(texto) {

    const caja = document.getElementById('errorLogin');
    caja.textContent = texto;
    caja.classList.add('mostrar');
}

function ocultarError() {

    const caja = document.getElementById('errorLogin');
    caja.classList.remove('mostrar');
}

async function ingresar() {

    ocultarError();

    const usuario = document.getElementById('usuario').value.trim();
    const clave = document.getElementById('clave').value.trim();

    if (usuario === '' || clave === '') {
        mostrarError('Complete usuario y contraseña');
        return;
    }

    try {

        const respuesta = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, password: clave })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarError(datos.error || 'Usuario o contraseña incorrectos');
            return;
        }

        window.location.href = '/dashboard.html';

    } catch (error) {
        mostrarError('No se pudo conectar con el servidor');
    }

}

// =========================
// ENTER PARA INGRESAR
// =========================

document.addEventListener('keypress', function (event) {

    if (event.key === 'Enter') {
        ingresar();
    }

});

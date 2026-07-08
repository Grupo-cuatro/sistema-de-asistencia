// =========================================
// USUARIOS Y AUDITORÍA - SPRINT 3 (solo Administrador)
// =========================================

function mostrarMensaje(texto) {

    const toast = document.getElementById('toast');
    toast.innerHTML = texto;
    toast.classList.add('mostrar');

    setTimeout(() => toast.classList.remove('mostrar'), 3000);
}

cargarUsuarios();
cargarAuditoria();

// ===== CREAR USUARIO =====

async function crearUsuario() {

    const usuario = document.getElementById('usuario').value.trim();
    const password = document.getElementById('password').value.trim();
    const rol = document.getElementById('rol').value;

    if (usuario === '' || password === '') {
        mostrarMensaje('⚠️ Complete usuario y contraseña');
        return;
    }

    try {

        const respuesta = await fetch('/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, password, rol })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarMensaje('⚠️ ' + (datos.error || 'No se pudo crear el usuario'));
            return;
        }

        mostrarMensaje('✅ Usuario creado');
        document.getElementById('usuario').value = '';
        document.getElementById('password').value = '';
        cargarUsuarios();

    } catch (error) {
        mostrarMensaje('⚠️ No se pudo conectar con el servidor');
    }

}

// ===== LISTAR USUARIOS =====

async function cargarUsuarios() {

    try {

        const respuesta = await fetch('/api/usuarios');
        const datos = await respuesta.json();

        const tabla = document.getElementById('tablaUsuarios');
        tabla.innerHTML = '';

        if (datos.length === 0) {
            tabla.innerHTML = '<tr><td colspan="5">No hay usuarios registrados</td></tr>';
            return;
        }

        datos.forEach(u => {

            tabla.innerHTML += `
            <tr>
                <td>${u.usuario}</td>
                <td><span class="badge ${u.rol === 'Administrador' ? 'badge-admin' : 'badge-docente'}">${u.rol}</span></td>
                <td>${u.activo ? 'Activo' : 'Inactivo'}</td>
                <td>${u.fecha_creacion}</td>
                <td>
                    <button class="btn-editar" onclick="alternarEstado(${u.id}, ${u.activo})">
                        ${u.activo ? 'Desactivar' : 'Activar'}
                    </button>
                    <button class="btn-eliminar" onclick="eliminarUsuario(${u.id})">Eliminar</button>
                </td>
            </tr>
            `;

        });

    } catch (error) {
        mostrarMensaje('⚠️ No se pudo cargar la lista de usuarios');
    }

}

// ===== ACTIVAR / DESACTIVAR =====

async function alternarEstado(id, activoActual) {

    try {

        await fetch(`/api/usuarios/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activo: activoActual ? 0 : 1 })
        });

        mostrarMensaje('✅ Estado actualizado');
        cargarUsuarios();

    } catch (error) {
        mostrarMensaje('⚠️ No se pudo actualizar el estado');
    }

}

// ===== ELIMINAR =====

async function eliminarUsuario(id) {

    if (!confirm('¿Eliminar este usuario?')) return;

    try {

        const respuesta = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarMensaje('⚠️ ' + (datos.error || 'No se pudo eliminar'));
            return;
        }

        mostrarMensaje('✅ Usuario eliminado');
        cargarUsuarios();

    } catch (error) {
        mostrarMensaje('⚠️ No se pudo conectar con el servidor');
    }

}

// ===== AUDITORÍA =====

async function cargarAuditoria() {

    try {

        const respuesta = await fetch('/api/reportes/auditoria');
        const datos = await respuesta.json();

        const tabla = document.getElementById('tablaAuditoria');
        tabla.innerHTML = '';

        if (datos.length === 0) {
            tabla.innerHTML = '<tr><td colspan="3">Sin registros de auditoría</td></tr>';
            return;
        }

        datos.forEach(a => {

            tabla.innerHTML += `
            <tr>
                <td>${a.usuario}</td>
                <td>${a.accion}</td>
                <td>${a.fecha}</td>
            </tr>
            `;

        });

    } catch (error) {
        mostrarMensaje('⚠️ No se pudo cargar la auditoría');
    }

}

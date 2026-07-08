// =========================================
// ASISTENCIA - SPRINT 3 (API REST + SQLite)
// =========================================

function mostrarMensaje(texto) {

    const toast = document.getElementById('toast');
    toast.innerHTML = texto;
    toast.classList.add('mostrar');

    setTimeout(() => toast.classList.remove('mostrar'), 3000);
}

// ===== INICIO =====

cargarHistorial();

// ===== REGISTRAR ASISTENCIA =====

async function registrarAsistencia(estado) {

    const dni = document.getElementById('dniAsistencia').value.trim();
    const observacion = document.getElementById('observacion').value.trim();

    if (dni === '') {
        mostrarMensaje('⚠️ Ingrese el DNI del estudiante');
        return;
    }

    try {

        const respuesta = await fetch('/api/asistencia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dni, estado, observacion })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarMensaje('⚠️ ' + (datos.error || 'No se pudo registrar la asistencia'));
            return;
        }

        mostrarMensaje('✅ Asistencia registrada');
        document.getElementById('dniAsistencia').value = '';
        document.getElementById('observacion').value = '';
        cargarHistorial();

    } catch (error) {
        mostrarMensaje('⚠️ No se pudo conectar con el servidor');
    }

}

// ===== HISTORIAL (con filtros) =====

function claseBadge(estado) {

    switch (estado) {
        case 'Presente': return 'badge-presente';
        case 'Tarde': return 'badge-tarde';
        case 'Falta': return 'badge-falta';
        case 'Justificado': return 'badge-justificado';
        default: return '';
    }
}

async function cargarHistorial() {

    const fecha = document.getElementById('filtroFecha').value;
    const estado = document.getElementById('filtroEstado').value;

    const params = new URLSearchParams();
    if (fecha) params.append('fecha', fecha);
    if (estado) params.append('estado', estado);

    try {

        const respuesta = await fetch('/api/asistencia?' + params.toString());
        const datos = await respuesta.json();

        const tabla = document.getElementById('tablaAsistencias');
        tabla.innerHTML = '';

        if (datos.length === 0) {
            tabla.innerHTML = '<tr><td colspan="7">No hay registros de asistencia</td></tr>';
            return;
        }

        datos.forEach(a => {

            tabla.innerHTML += `
            <tr>
                <td>${a.dni}</td>
                <td>${a.nombres}</td>
                <td>${a.apellidos}</td>
                <td>${a.fecha}</td>
                <td>${a.hora}</td>
                <td><span class="badge ${claseBadge(a.estado)}">${a.estado}</span></td>
                <td>${a.observacion || '-'}</td>
            </tr>
            `;

        });

    } catch (error) {
        mostrarMensaje('⚠️ No se pudo cargar el historial');
    }

}

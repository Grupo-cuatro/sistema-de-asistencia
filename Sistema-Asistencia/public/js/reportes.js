// =========================================
// REPORTES - SPRINT 3 (API REST + SQLite)
// =========================================

function mostrarMensaje(texto) {

    const toast = document.getElementById('toast');
    toast.innerHTML = texto;
    toast.classList.add('mostrar');

    setTimeout(() => toast.classList.remove('mostrar'), 3000);
}

function cambiarTipo() {

    const tipo = document.getElementById('tipoReporte').value;
    const input = document.getElementById('valorReporte');
    const label = document.getElementById('labelValor');

    if (tipo === 'fecha') {
        label.textContent = 'Fecha';
        input.type = 'date';
        input.placeholder = '';
    } else if (tipo === 'carrera') {
        label.textContent = 'Carrera';
        input.type = 'text';
        input.placeholder = 'Ej. Ingeniería de Sistemas';
    } else if (tipo === 'ciclo') {
        label.textContent = 'Ciclo';
        input.type = 'text';
        input.placeholder = 'Ej. V';
    } else if (tipo === 'estudiante') {
        label.textContent = 'DNI del estudiante';
        input.type = 'text';
        input.placeholder = 'Ingrese DNI';
    }

}

function claseBadge(estado) {

    switch (estado) {
        case 'Presente': return 'badge-presente';
        case 'Tarde': return 'badge-tarde';
        case 'Falta': return 'badge-falta';
        case 'Justificado': return 'badge-justificado';
        default: return '';
    }
}

function pintarReporte(filas) {

    const tabla = document.getElementById('tablaReporte');
    tabla.innerHTML = '';

    if (!filas || filas.length === 0) {
        tabla.innerHTML = '<tr><td colspan="8">No se encontraron registros</td></tr>';
        return;
    }

    filas.forEach(f => {

        tabla.innerHTML += `
        <tr>
            <td>${f.dni || '-'}</td>
            <td>${f.nombres || '-'}</td>
            <td>${f.apellidos || '-'}</td>
            <td>${f.carrera || '-'}</td>
            <td>${f.ciclo || '-'}</td>
            <td>${f.fecha || '-'}</td>
            <td>${f.hora || '-'}</td>
            <td><span class="badge ${claseBadge(f.estado)}">${f.estado || '-'}</span></td>
        </tr>
        `;

    });

}

// ===== GENERAR REPORTE =====

async function generarReporte() {

    const tipo = document.getElementById('tipoReporte').value;
    const valor = document.getElementById('valorReporte').value.trim();

    if (valor === '') {
        mostrarMensaje('⚠️ Ingrese un valor para el filtro');
        return;
    }

    try {

        let filas = [];

        if (tipo === 'fecha') {

            const respuesta = await fetch(`/api/reportes/fecha/${encodeURIComponent(valor)}`);
            filas = await respuesta.json();

        } else if (tipo === 'carrera') {

            const respuesta = await fetch(`/api/reportes/carrera/${encodeURIComponent(valor)}`);
            filas = await respuesta.json();

        } else if (tipo === 'ciclo') {

            const respuesta = await fetch(`/api/reportes/ciclo/${encodeURIComponent(valor)}`);
            filas = await respuesta.json();

        } else if (tipo === 'estudiante') {

            // Primero se busca el estudiante por DNI para obtener su ID
            const respBusqueda = await fetch('/api/estudiantes/buscar?q=' + encodeURIComponent(valor));
            const encontrados = await respBusqueda.json();
            const estudiante = encontrados.find(e => e.dni === valor);

            if (!estudiante) {
                mostrarMensaje('⚠️ No se encontró un estudiante con ese DNI');
                pintarReporte([]);
                return;
            }

            const respuesta = await fetch(`/api/reportes/estudiante/${estudiante.id}`);
            const historial = await respuesta.json();

            filas = historial.map(h => ({
                dni: estudiante.dni,
                nombres: estudiante.nombres,
                apellidos: estudiante.apellidos,
                carrera: estudiante.carrera,
                ciclo: estudiante.ciclo,
                fecha: h.fecha,
                hora: h.hora,
                estado: h.estado
            }));

        }

        pintarReporte(filas);

    } catch (error) {
        mostrarMensaje('⚠️ No se pudo generar el reporte');
    }

}

// ===== EXPORTAR CSV =====

function exportarCSV() {

    const tipo = document.getElementById('tipoReporte').value;
    const valor = document.getElementById('valorReporte').value.trim();

    if (valor === '') {
        mostrarMensaje('⚠️ Ingrese un valor para el filtro antes de exportar');
        return;
    }

    let tipoParam = tipo;
    let valorParam = valor;

    if (tipo === 'estudiante') {
        // El endpoint de exportación espera el ID, no el DNI; se resuelve antes de exportar
        buscarIdYExportar(valor);
        return;
    }

    window.location.href = `/api/reportes/exportar/csv?tipo=${tipoParam}&valor=${encodeURIComponent(valorParam)}`;

}

async function buscarIdYExportar(dni) {

    try {

        const respuesta = await fetch('/api/estudiantes/buscar?q=' + encodeURIComponent(dni));
        const encontrados = await respuesta.json();
        const estudiante = encontrados.find(e => e.dni === dni);

        if (!estudiante) {
            mostrarMensaje('⚠️ No se encontró un estudiante con ese DNI');
            return;
        }

        window.location.href = `/api/reportes/exportar/csv?tipo=estudiante&valor=${estudiante.id}`;

    } catch (error) {
        mostrarMensaje('⚠️ No se pudo exportar el reporte');
    }

}

// =========================================
// ESTUDIANTES - SPRINT 3 (API REST + SQLite)
// =========================================

let fotoBase64 = '';

function mostrarMensaje(texto) {

    const toast = document.getElementById('toast');
    toast.innerHTML = texto;
    toast.classList.add('mostrar');

    setTimeout(() => toast.classList.remove('mostrar'), 3000);
}

// ===== CARGAR FOTO =====

document.getElementById('foto').addEventListener('change', function (e) {

    const archivo = e.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = function () { fotoBase64 = lector.result; };
    lector.readAsDataURL(archivo);

});

// ===== INICIO =====

mostrar();

// ===== GUARDAR (crear o editar) =====

async function guardar() {

    const id = document.getElementById('estudianteId').value;
    const codigo = document.getElementById('codigo').value.trim();
    const dni = document.getElementById('dni').value.trim();
    const nombres = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const carrera = document.getElementById('carrera').value.trim();
    const ciclo = document.getElementById('ciclo').value.trim();

    if (dni === '' || nombres === '' || apellidos === '') {
        alert('Complete DNI, nombres y apellidos');
        return;
    }

    if (!/^\d{8}$/.test(dni)) {
        alert('El DNI debe tener 8 dígitos');
        return;
    }

    const cuerpo = { codigo, dni, nombres, apellidos, correo, carrera, ciclo, foto: fotoBase64 };

    try {

        const url = id ? `/api/estudiantes/${id}` : '/api/estudiantes';
        const metodo = id ? 'PUT' : 'POST';

        const respuesta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cuerpo)
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarMensaje('⚠️ ' + (datos.error || 'Error al guardar'));
            return;
        }

        mostrarMensaje(id ? '✅ Estudiante actualizado' : '✅ Estudiante registrado');
        limpiar();
        mostrar();

    } catch (error) {
        mostrarMensaje('⚠️ No se pudo conectar con el servidor');
    }

}

// ===== MOSTRAR ESTUDIANTES =====

function pintarTabla(lista) {

    const tabla = document.getElementById('contenidoTabla');
    tabla.innerHTML = '';

    if (lista.length === 0) {
        tabla.innerHTML = `<tr><td colspan="8">No existen estudiantes registrados</td></tr>`;
        return;
    }

    lista.forEach(e => {

        tabla.innerHTML += `
        <tr>
            <td><img src="${e.foto || ''}" width="60" height="60" style="border-radius:50%;object-fit:cover;"></td>
            <td>${e.dni}</td>
            <td>${e.nombres}</td>
            <td>${e.apellidos}</td>
            <td>${e.carrera || '-'}</td>
            <td>${e.ciclo || '-'}</td>
            <td>${e.estado}</td>
            <td>
                <button class="btn-editar" onclick="editar(${e.id})">Editar</button>
                <button class="btn-desactivar" onclick="desactivar(${e.id})">Desactivar</button>
                <button class="btn-eliminar" onclick="eliminar(${e.id})">Eliminar</button>
            </td>
        </tr>
        `;

    });

}

let ESTUDIANTES_CACHE = [];

async function mostrar() {

    try {

        const respuesta = await fetch('/api/estudiantes');
        const datos = await respuesta.json();
        ESTUDIANTES_CACHE = datos;
        pintarTabla(datos);

    } catch (error) {
        mostrarMensaje('⚠️ No se pudo cargar la lista de estudiantes');
    }

}

// ===== EDITAR =====

function editar(id) {

    const e = ESTUDIANTES_CACHE.find(est => est.id === id);
    if (!e) return;

    document.getElementById('estudianteId').value = e.id;
    document.getElementById('codigo').value = e.codigo || '';
    document.getElementById('dni').value = e.dni;
    document.getElementById('nombres').value = e.nombres;
    document.getElementById('apellidos').value = e.apellidos;
    document.getElementById('correo').value = e.correo || '';
    document.getElementById('carrera').value = e.carrera || '';
    document.getElementById('ciclo').value = e.ciclo || '';

    fotoBase64 = '';
    document.getElementById('tituloFormulario').textContent = 'Editando Estudiante #' + e.id;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== DESACTIVAR =====

async function desactivar(id) {

    try {

        await fetch(`/api/estudiantes/${id}/desactivar`, { method: 'PATCH' });
        mostrarMensaje('✅ Estudiante desactivado');
        mostrar();

    } catch (error) {
        mostrarMensaje('⚠️ No se pudo desactivar');
    }

}

// ===== ELIMINAR =====

async function eliminar(id) {

    if (!confirm('¿Eliminar estudiante?')) return;

    try {

        const respuesta = await fetch(`/api/estudiantes/${id}`, { method: 'DELETE' });
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarMensaje('⚠️ ' + (datos.error || 'No se pudo eliminar'));
            return;
        }

        mostrarMensaje('✅ Estudiante eliminado');
        mostrar();

    } catch (error) {
        mostrarMensaje('⚠️ No se pudo conectar con el servidor');
    }

}

// ===== BUSCAR =====

let temporizadorBusqueda = null;

function buscar() {

    clearTimeout(temporizadorBusqueda);

    const texto = document.getElementById('buscar').value.trim();

    temporizadorBusqueda = setTimeout(async () => {

        try {

            const respuesta = await fetch('/api/estudiantes/buscar?q=' + encodeURIComponent(texto));
            const datos = await respuesta.json();
            ESTUDIANTES_CACHE = datos;
            pintarTabla(datos);

        } catch (error) {
            mostrarMensaje('⚠️ Error en la búsqueda');
        }

    }, 300);

}

// ===== LIMPIAR =====

function limpiar() {

    document.getElementById('estudianteId').value = '';
    document.getElementById('codigo').value = '';
    document.getElementById('dni').value = '';
    document.getElementById('nombres').value = '';
    document.getElementById('apellidos').value = '';
    document.getElementById('correo').value = '';
    document.getElementById('carrera').value = '';
    document.getElementById('ciclo').value = '';
    document.getElementById('foto').value = '';

    fotoBase64 = '';
    document.getElementById('tituloFormulario').textContent = 'Registro de Estudiantes';

}

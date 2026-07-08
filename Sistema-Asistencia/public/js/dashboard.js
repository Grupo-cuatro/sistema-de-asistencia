// =========================================
// DASHBOARD - ESTADÍSTICAS
// =========================================

async function cargarEstadisticas() {

    try {

        const [respEstudiantes, respAsistencia] = await Promise.all([
            fetch('/api/estudiantes'),
            fetch('/api/asistencia?fecha=' + new Date().toISOString().split('T')[0])
        ]);

        const estudiantes = await respEstudiantes.json();
        const asistenciaHoy = await respAsistencia.json();

        document.getElementById('totalEstudiantes').textContent = estudiantes.length;

        document.getElementById('totalPresentesHoy').textContent =
            asistenciaHoy.filter(a => a.estado === 'Presente').length;

        document.getElementById('totalTardeHoy').textContent =
            asistenciaHoy.filter(a => a.estado === 'Tarde').length;

        document.getElementById('totalFaltaHoy').textContent =
            asistenciaHoy.filter(a => a.estado === 'Falta').length;

    } catch (error) {
        console.error('Error al cargar estadísticas', error);
    }

}

cargarEstadisticas();

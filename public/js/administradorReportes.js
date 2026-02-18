import { get } from '../services/fetch.js';

async function cargarReportes() {
    const listaReportes = document.getElementById('lista-reportes-ciudadanos');
    if (!listaReportes) return;

    try {
        const reportes = await get('reportes');
        listaReportes.innerHTML = '';

        if (reportes && reportes.length > 0) {
            const ul = document.createElement('ul');
            ul.style.listStyle = 'none';
            ul.style.padding = '0';

            reportes.forEach(reporte => {
                const li = document.createElement('li');
                li.style.borderBottom = '1px solid #eee';
                li.style.padding = '15px';
                li.style.display = 'flex';
                li.style.justifyContent = 'space-between';
                li.style.alignItems = 'center';

                const infoDiv = document.createElement('div');
                infoDiv.innerHTML = `<strong>${reporte.type}</strong> - ${reporte.status}<br>
                                   <small>${reporte.location}</small><br>
                                   <p style="margin: 5px 0;">${reporte.description}</p>
                                   <small style="color: #888;">${new Date(reporte.timestamp).toLocaleString()}</small>`;

                li.appendChild(infoDiv);
                ul.appendChild(li);
            });
            listaReportes.appendChild(ul);
        } else {
            listaReportes.innerHTML = '<p>No hay reportes ciudadanos registrados.</p>';
        }
    } catch (error) {
        console.error('Error al cargar reportes:', error);
        listaReportes.innerHTML = '<p>Error al cargar los reportes.</p>';
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', cargarReportes);

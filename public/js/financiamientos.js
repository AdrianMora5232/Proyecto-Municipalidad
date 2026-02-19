import { get, post, patch, del } from '../services/fetch.js';
import { navigateToSection } from './administrador.js';

const ENDPOINT = 'financiamientos';

const btnGuardar = document.getElementById('btnGuardarFinanciamiento');
const listaFinanciamientos = document.getElementById('lista-financiamientos');
const inputId = document.getElementById('financiamientoId');

// Form Inputs
const inputNombre = document.getElementById('FinProyectoNombre');
const inputDescripcion = document.getElementById('FinDescripcion');
const inputMontoSolicitado = document.getElementById('MontoSolicitado');
const inputMontoAprobado = document.getElementById('MontoAprobado');
const inputEntidad = document.getElementById('EntidadFinanciera');
const inputFecha = document.getElementById('FechaSolicitud');
const inputFechaResolucion = document.getElementById('FechaResolucion');
const inputEstado = document.getElementById('EstadoFinanciamiento');

btnGuardar.addEventListener('click', async () => {
    const data = {
        nombreProyecto: inputNombre.value,
        descripcion: inputDescripcion.value,
        montoSolicitado: inputMontoSolicitado.value,
        montoAprobado: inputMontoAprobado.value,
        entidadFinanciera: inputEntidad.value,
        fechaSolicitud: inputFecha.value,
        fechaResolucion: inputFechaResolucion.value,
        estado: inputEstado.value
    };

    const id = inputId.value;

    if (!data.nombreProyecto || !data.entidadFinanciera || !data.montoSolicitado) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor complete los campos obligatorios (Nombre, Entidad y Monto Solicitado)',
            confirmButtonColor: '#3498db'
        });
        return;
    }

    try {
        if (id) {
            // Update existing
            await patch(`${ENDPOINT}/${id}`, data);
            await Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'Financiamiento actualizado exitosamente',
                timer: 2000,
                showConfirmButton: false
            });
            btnGuardar.textContent = 'Guardar Financiamiento';
        } else {
            // Create new
            await post(ENDPOINT, data);
            await Swal.fire({
                icon: 'success',
                title: '¡Registrado!',
                text: 'Financiamiento registrado exitosamente',
                timer: 2000,
                showConfirmButton: false
            });
        }

        limpiarFormulario();
        cargarFinanciamientos();
        navigateToSection('financiamientos');
    } catch (error) {
        console.error('Error al guardar:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al procesar la solicitud. Verifique la conexión con el servidor.',
            confirmButtonColor: '#e74c3c'
        });
    }
});

function limpiarFormulario() {
    inputId.value = '';
    inputNombre.value = '';
    inputDescripcion.value = '';
    inputMontoSolicitado.value = '';
    inputMontoAprobado.value = '';
    inputEntidad.value = '';
    inputFecha.value = '';
    inputFechaResolucion.value = '';
    inputEstado.value = 'pendiente';
    btnGuardar.textContent = 'Guardar Financiamiento';
}

async function cargarFinanciamientos() {
    try {
        const financiamientos = await get(ENDPOINT);
        listaFinanciamientos.innerHTML = '';

        if (financiamientos && financiamientos.length > 0) {
            const table = document.createElement('table');
            table.className = 'admin-table'; // Assuming there's a table style in admin.css
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.marginTop = '20px';

            table.innerHTML = `
                <thead>
                    <tr style="background: #f4f4f4; text-align: left;">
                        <th style="padding: 12px; border: 1px solid #ddd;">Proyecto</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Entidad</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Montos (Sol./Apr.)</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Fechas (Sol./Res.)</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Estado</th>
                        <th style="padding: 12px; border: 1px solid #ddd;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            `;

            const tbody = table.querySelector('tbody');

            financiamientos.forEach(fin => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid #eee';

                const statusColor = fin.estado === 'aprobado' ? '#27ae60' : fin.estado === 'rechazado' ? '#e74c3c' : '#f39c12';

                tr.innerHTML = `
                    <td style="padding: 12px; border: 1px solid #ddd;">${fin.nombreProyecto}</td>
                    <td style="padding: 12px; border: 1px solid #ddd;">${fin.entidadFinanciera}</td>
                    <td style="padding: 12px; border: 1px solid #ddd;">
                        <div>Sol: ₡${Number(fin.montoSolicitado).toLocaleString()}</div>
                        <div style="color: #27ae60; font-weight: 500;">Apr: ₡${Number(fin.montoAprobado || 0).toLocaleString()}</div>
                    </td>
                    <td style="padding: 12px; border: 1px solid #ddd;">
                        <div>Sol: ${fin.fechaSolicitud || 'N/A'}</div>
                        <div>Res: ${fin.fechaResolucion || 'N/A'}</div>
                    </td>
                    <td style="padding: 12px; border: 1px solid #ddd;"><span style="color: ${statusColor}; font-weight: bold;">${fin.estado.toUpperCase()}</span></td>
                    <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">
                        <button class="btn-action btn-edit" style="color: #3498db;" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" style="color: #e74c3c;" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;

                tr.querySelector('.btn-edit').onclick = () => cargarDatosEdicion(fin);
                tr.querySelector('.btn-delete').onclick = () => confirmarEliminacion(fin.id);

                tbody.appendChild(tr);
            });
            listaFinanciamientos.appendChild(table);
        } else {
            listaFinanciamientos.innerHTML = '<p>No hay solicitudes de financiamiento registradas.</p>';
        }
    } catch (error) {
        console.error('Error al cargar financiamientos:', error);
        listaFinanciamientos.innerHTML = '<p style="color: red;">Error al cargar los datos.</p>';
    }
}

function cargarDatosEdicion(fin) {
    inputId.value = fin.id;
    inputNombre.value = fin.nombreProyecto;
    inputDescripcion.value = fin.descripcion;
    inputMontoSolicitado.value = fin.montoSolicitado;
    inputMontoAprobado.value = fin.montoAprobado;
    inputEntidad.value = fin.entidadFinanciera;
    inputFecha.value = fin.fechaSolicitud || '';
    inputFechaResolucion.value = fin.fechaResolucion || '';
    inputEstado.value = fin.estado;

    btnGuardar.textContent = 'Actualizar Financiamiento';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function confirmarEliminacion(id) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            await del(`${ENDPOINT}/${id}`);
            await Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'El registro ha sido eliminado correctamente',
                timer: 1500,
                showConfirmButton: false
            });
            cargarFinanciamientos();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el registro',
                confirmButtonColor: '#e74c3c'
            });
        }
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', cargarFinanciamientos);

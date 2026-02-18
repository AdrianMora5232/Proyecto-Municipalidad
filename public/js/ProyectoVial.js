import { get, post, patch, del } from '../services/fetch.js';
import { navigateToSection } from './administrador.js';

const API_BASE = 'http://localhost:3001/proyectos';

const btnAgregar = document.getElementById('agregarProyecto');
const listaProyectos = document.getElementById('lista-proyectos');
const inputId = document.getElementById('proyectoId');

// Form Inputs
const inputNombre = document.getElementById('ProyectoNombre');
const inputDescripcion = document.getElementById('descripcionProyecto');
const inputPresupuesto = document.getElementById('prosupuesto');
const inputFecha = document.getElementById('fechaInicio');
const inputEstado = document.getElementById('estado');

btnAgregar.addEventListener('click', async () => {
    const nombre = inputNombre.value;
    const descripcion = inputDescripcion.value;
    const presupuesto = inputPresupuesto.value;
    const fechaInicio = inputFecha.value;
    const estado = inputEstado.value;
    const id = inputId.value;

    if (!nombre || !descripcion) {
        alert('Por favor complete los campos obligatorios');
        return;
    }

    const proyectoData = {
        nombre,
        descripcion,
        presupuesto,
        fechaInicio,
        estado
    };

    if (id) {
        // Update existing project
        await patch(id, proyectoData);
        alert('Proyecto actualizado exitosamente');
        btnAgregar.textContent = 'Agregar Proyecto'; // Reset button text
    } else {
        // Create new project
        await post("proyectos", proyectoData);
        alert('Proyecto agregado exitosamente');
    }

    limpiarFormulario();
    cargarProyectos();

    // Auto-navigate to "Proyectos Viales" to show the list
    navigateToSection('viales');
});

function limpiarFormulario() {
    inputId.value = '';
    inputNombre.value = '';
    inputDescripcion.value = '';
    inputPresupuesto.value = '';
    inputFecha.value = '';
    inputEstado.value = '';
}

async function cargarProyectos() {
    const proyectos = await get('proyectos');
    listaProyectos.innerHTML = '';

    if (proyectos && proyectos.length > 0) {
        const ul = document.createElement('ul');
        ul.style.listStyle = 'none';
        ul.style.padding = '0';

        proyectos.forEach(proyecto => {
            const li = document.createElement('li');
            li.style.borderBottom = '1px solid #eee';
            li.style.padding = '15px';
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';

            const infoDiv = document.createElement('div');
            infoDiv.innerHTML = `<strong>${proyecto.nombre}</strong> - ${proyecto.estado}<br><small>${proyecto.fechaInicio}</small>`;

            const btnDiv = document.createElement('div');

            const btnEdit = document.createElement('button');
            btnEdit.innerHTML = '<i class="fas fa-edit"></i>';
            btnEdit.className = 'btn-action btn-edit';
            btnEdit.style.color = '#f39c12';
            btnEdit.onclick = () => cargarDatosEdicion(proyecto);

            const btnDelete = document.createElement('button');
            btnDelete.innerHTML = '<i class="fas fa-trash"></i>';
            btnDelete.className = 'btn-action btn-delete';
            btnDelete.style.color = '#e74c3c';
            btnDelete.onclick = () => confirmarEliminacion(proyecto.id);

            btnDiv.appendChild(btnEdit);
            btnDiv.appendChild(btnDelete);

            li.appendChild(infoDiv);
            li.appendChild(btnDiv);
            ul.appendChild(li);
        });
        listaProyectos.appendChild(ul);
    } else {
        listaProyectos.innerHTML = '<p>No hay proyectos registrados.</p>';
    }
}

function cargarDatosEdicion(proyecto) {
    inputId.value = proyecto.id;
    inputNombre.value = proyecto.nombre;
    inputDescripcion.value = proyecto.descripcion;
    inputPresupuesto.value = proyecto.presupuesto;
    inputFecha.value = proyecto.fechaInicio;
    inputEstado.value = proyecto.estado;

    btnAgregar.textContent = 'Actualizar Proyecto';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function confirmarEliminacion(id) {
    if (confirm('¿Estás seguro de eliminar este proyecto?')) {
        await deleteProyecto(id);
        cargarProyectos();
    }
}

// Initial load
cargarProyectos();

import { get, post, put, del } from '../services/fetch.js';

document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const pageTitle = document.getElementById('page-title');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add active class to clicked item
            item.classList.add('active');

            // Get target section
            const targetId = item.getAttribute('data-target');

            // Update page title
            const titleText = item.querySelector('span').textContent;
            pageTitle.textContent = titleText;

            // Hide all sections and show the target one
            sections.forEach(section => {
                section.style.display = 'none';
                section.classList.remove('active');
            });

            const targetSection = document.getElementById(`${targetId}-section`);
            if (targetSection) {
                targetSection.style.display = 'block';
                // Small delay to allow display:block to apply before opacity transition if we add one
                setTimeout(() => {
                    targetSection.classList.add('active');
                }, 10);
            }
        });
    });

    // Gestión de Servicios Públicos
    const serviciosSection = document.getElementById('servicios-section');

    if (serviciosSection) {
        // Limpiar contenido inicial
        serviciosSection.innerHTML = '';

        // Título
        const titulo = document.createElement('h3');
        titulo.textContent = 'Gestión de Servicios Públicos';
        serviciosSection.appendChild(titulo);

        // Contenedor del formulario
        const formContainer = document.createElement('div');
        formContainer.className = 'form-container';

        // Crear Formulario
        const form = document.createElement('form');
        form.id = 'servicio-form';

        // Estructura de campos del formulario
        const campos = [
            { label: 'Tipo de Servicio', id: 'tipo', type: 'text', placeholder: 'Ej: Recolección de Basura' },
            { label: 'Descripción', id: 'descripcion', type: 'text', placeholder: 'Descripción del servicio' },
            { label: 'Responsable', id: 'responsable', type: 'text', placeholder: 'Nombre del responsable' },
            { label: 'Estado', id: 'estado', type: 'select', options: ['Activo', 'Inactivo', 'En Mantenimiento'] }
        ];

        campos.forEach(campo => {
            const div = document.createElement('div');
            div.className = 'form-group';

            const label = document.createElement('label');
            label.textContent = campo.label;
            label.setAttribute('for', campo.id);
            div.appendChild(label);

            let input;
            if (campo.type === 'select') {
                input = document.createElement('select');
                input.id = campo.id;
                campo.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    input.appendChild(option);
                });
            } else {
                input = document.createElement('input');
                input.type = campo.type;
                input.id = campo.id;
                input.placeholder = campo.placeholder;
            }
            input.required = true;
            div.appendChild(input);
            formContainer.appendChild(div);
        });

        // Botón de guardar
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.textContent = 'Guardar Servicio';
        submitBtn.className = 'btn-primary';
        formContainer.appendChild(submitBtn);

        serviciosSection.appendChild(formContainer);

        // Contenedor de la lista
        const listContainer = document.createElement('div');
        listContainer.id = 'servicios-list';
        listContainer.className = 'servicios-list';
        serviciosSection.appendChild(listContainer);

        // --- LÓGICA CON API REAL ---

        const API_BASE_URL = 'http://localhost:3001/servicios';

        // Función renderizar (reutilizada)
        const renderizarDatosAgregados = (servicios) => {
            listContainer.innerHTML = '';

            if (!servicios || servicios.length === 0) {
                listContainer.textContent = 'No hay servicios registrados.';
                return;
            }

            const table = document.createElement('table');
            table.className = 'servicios-table';

            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Responsable</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            `;
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            servicios.forEach(servicio => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${servicio.tipo}</td>
                    <td>${servicio.descripcion}</td>
                    <td>${servicio.responsable}</td>
                    <td>${servicio.estado}</td>
                    <td>
                        <button class="btn-edit" data-id="${servicio.id}">Editar</button>
                        <button class="btn-delete" data-id="${servicio.id}">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            listContainer.appendChild(table);
        };

        // GET: Listar servicios
        const listarServicios = async () => {
            try {
                const data = await get('servicios');
                renderizarDatosAgregados(data);
            } catch (error) {
                console.error('Error al obtener servicios:', error);
                listContainer.textContent = 'Error al cargar los servicios.';
            }
        };

        // POST: Crear servicio
        const crearServicio = async (nuevoServicio) => {
            try {
                await post("servicios/", nuevoServicio);
                alert('Servicio creado correctamente');
                listarServicios();
            } catch (error) {
                console.error('Error al crear servicio:', error);
                alert('Error al crear servicio');
            }
        };

        // PUT: Actualizar servicio
        const actualizarServicio = async (id, camposActualizados) => {
            try {
                // Para simplificar, primero obtenemos el objeto actual y luego lo actualizamos
                // Esto es necesario porque PUT reemplaza todo el recurso en json-server
                const servicioActual = await get(`servicios/${id}`);
                const servicioCompleto = { ...servicioActual, ...camposActualizados };

                await put(`servicios/${id}`, servicioCompleto);
                alert('Servicio actualizado correctamente');
                listarServicios();
            } catch (error) {
                console.error('Error al actualizar servicio:', error);
                alert('Error al actualizar servicio');
            }
        };

        // DELETE: Eliminar servicio
        const eliminarServicio = async (id) => {
            if (confirm('¿Está seguro de eliminar este servicio?')) {
                try {
                    await del(`servicios/${id}`);
                    alert('Servicio eliminado correctamente');
                    listarServicios();
                } catch (error) {
                    console.error('Error al eliminar servicio:', error);
                    alert('Error al eliminar servicio');
                }
            }
        };

        // Event Listeners

        // Click en Guardar
        submitBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const nuevoServicio = {
                tipo: document.getElementById('tipo').value,
                descripcion: document.getElementById('descripcion').value,
                responsable: document.getElementById('responsable').value,
                estado: document.getElementById('estado').value
            };

            if (nuevoServicio.tipo && nuevoServicio.descripcion) {
                await crearServicio(nuevoServicio);
                // Limpiar inputs
                campos.forEach(c => document.getElementById(c.id).value = '');
            } else {
                alert('Por favor complete los campos requeridos');
            }
        });

        // Edit & Delete (Event Delegation)
        listContainer.addEventListener('click', async (e) => {
            const target = e.target;
            const id = target.getAttribute('data-id');

            if (target.classList.contains('btn-delete')) {
                await eliminarServicio(id);
            } else if (target.classList.contains('btn-edit')) {
                const nuevaDesc = prompt("Nueva descripción:");
                const nuevoResp = prompt("Nuevo responsable:");
                const nuevoEstado = prompt("Nuevo estado:");
                const nuevoTipo = prompt("Nuevo tipo:");
                if (nuevaDesc && nuevoResp) {
                    await actualizarServicio(id, { descripcion: nuevaDesc, responsable: nuevoResp });
                }
            }
        });

        // Carga inicial
        listarServicios();
    }
});

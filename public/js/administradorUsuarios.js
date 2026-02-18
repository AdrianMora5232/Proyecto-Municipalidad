import { get, post, patch, del } from '../services/fetch.js';

const inputId = document.getElementById('usuarioId');
const inputNombre = document.getElementById('UsuarioNombre');
const inputEmail = document.getElementById('UsuarioEmail');
const inputPassword = document.getElementById('UsuarioPassword');
const inputRol = document.getElementById('UsuarioRol');
const btnGuardar = document.getElementById('btnGuardarUsuario');
const listaUsuarios = document.getElementById('lista-usuarios');

async function cargarUsuarios() {
    if (!listaUsuarios) return;

    try {
        const usuarios = await get('usuarios');
        listaUsuarios.innerHTML = '';

        if (usuarios && usuarios.length > 0) {
            const table = document.createElement('table');
            table.className = 'servicios-table'; // Reusing existing styles
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.marginTop = '20px';

            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr style="background-color: #f8f9fa; border-bottom: 2px solid #dee2e6;">
                    <th style="padding: 12px; text-align: left;">Nombre</th>
                    <th style="padding: 12px; text-align: left;">Email</th>
                    <th style="padding: 12px; text-align: left;">Rol</th>
                    <th style="padding: 12px; text-align: center;">Acciones</th>
                </tr>
            `;
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            usuarios.forEach(usuario => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid #eee';
                tr.innerHTML = `
                    <td style="padding: 12px;">${usuario.nombre}</td>
                    <td style="padding: 12px;">${usuario.email}</td>
                    <td style="padding: 12px;">
                        <span class="badge" style="background-color: ${usuario.rol === 'Admin' ? '#e74c3c' : '#3498db'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">
                            ${usuario.rol}
                        </span>
                    </td>
                    <td style="padding: 12px; text-align: center;">
                        <button class="btn-edit" style="background: none; border: none; color: #f39c12; cursor: pointer; margin-right: 10px;" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" style="background: none; border: none; color: #e74c3c; cursor: pointer;" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;

                // Add event listeners to buttons
                const btnEdit = tr.querySelector('.btn-edit');
                btnEdit.onclick = () => prepararEdicion(usuario);

                const btnDelete = tr.querySelector('.btn-delete');
                btnDelete.onclick = () => confirmarEliminacion(usuario.id);

                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            listaUsuarios.appendChild(table);
        } else {
            listaUsuarios.innerHTML = '<p>No hay usuarios registrados.</p>';
        }
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        listaUsuarios.innerHTML = '<p>Error al cargar la lista de usuarios.</p>';
    }
}

btnGuardar.addEventListener('click', async () => {
    const id = inputId.value;
    const nombre = inputNombre.value;
    const email = inputEmail.value;
    const password = inputPassword.value;
    const rol = inputRol.value;

    if (!nombre || !email || (!id && !password)) {
        alert('Por favor complete los campos obligatorios');
        return;
    }

    const usuarioData = {
        nombre,
        email,
        rol
    };

    // Only include password if provided (necessary for creation, optional for updates)
    if (password) {
        usuarioData.password = password;
    }

    try {
        if (id) {
            // Update
            await patch(`usuarios/${id}`, usuarioData);
            alert('Usuario actualizado exitosamente');
            btnGuardar.textContent = 'Guardar Usuario';
        } else {
            // Create
            await post('usuarios', usuarioData);
            alert('Usuario creado exitosamente');
        }

        limpiarFormulario();
        cargarUsuarios();
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        alert('Error al guardar el usuario');
    }
});

function prepararEdicion(usuario) {
    inputId.value = usuario.id;
    inputNombre.value = usuario.nombre;
    inputEmail.value = usuario.email;
    inputPassword.value = ''; // Don't show password, leave empty for no change
    inputRol.value = usuario.rol;

    btnGuardar.textContent = 'Actualizar Usuario';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function confirmarEliminacion(id) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
        try {
            await del(`usuarios/${id}`);
            alert('Usuario eliminado correctamente');
            cargarUsuarios();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            alert('Error al eliminar el usuario');
        }
    }
}

function limpiarFormulario() {
    inputId.value = '';
    inputNombre.value = '';
    inputEmail.value = '';
    inputPassword.value = '';
    inputRol.value = 'Ciudadano';
}

// Initial load
document.addEventListener('DOMContentLoaded', cargarUsuarios);

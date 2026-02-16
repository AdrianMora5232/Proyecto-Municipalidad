import { auth } from './auth.js';
import { getCollection, createItem, updateItem, deleteItem } from './utils.js';

// --- Auth Protection ---
const user = auth.requireAdmin();
if (!user) throw new Error("Unauthorized");

document.getElementById('logout-btn').addEventListener('click', (e) => {
  e.preventDefault();
  auth.logout();
});

// --- State & Config ---
const modules = {
  reportes: {
    collection: 'reportes',
    renderRow: (item) => `
      <td>${item.id}</td>
      <td>${item.tipo}</td>
      <td>
        <strong>${item.ubicacion}</strong><br>
        <span style="font-size:0.85em; color:var(--text-light)">${item.descripcion || ''}</span>
      </td>
      <td><span class="badge ${item.estado === 'Pendiente' ? 'warning' : 'success'}">${item.estado}</span></td>
      <td>${item.prioridad}</td>
      <td class="row-actions">
        <button class="btn secondary" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="window.updateStatus(${item.id}, '${item.estado}')">
          ${item.estado === 'Pendiente' ? 'Resolver' : 'Reabrir'}
        </button>
        <button class="btn danger" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="window.deleteItem('reportes', ${item.id})">Eliminar</button>
      </td>
    `
  },
  proyectos: {
    collection: 'proyectos',
    renderRow: (item) => `
      <td><strong>${item.nombre}</strong><br><small>${item.descripcion || ''}</small></td>
      <td>₡${Number(item.presupuesto).toLocaleString()}</td>
      <td>${item.estado}</td>
      <td>${item.fechaInicio}</td>
      <td class="row-actions">
        <button class="btn danger" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="window.deleteItem('proyectos', ${item.id})">Eliminar</button>
      </td>
    `
  },
  servicios: {
    collection: 'servicios',
    renderRow: (item) => `
      <td>${item.nombre}</td>
      <td>${item.zona}</td>
      <td>${item.frecuencia}</td>
      <td>${item.estado}</td>
      <td class="row-actions">
        <button class="btn danger" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="window.deleteItem('servicios', ${item.id})">Eliminar</button>
      </td>
    `
  }
};

// --- Core Functions ---

async function loadModule(moduleKey) {
  const config = modules[moduleKey];
  const tbody = document.querySelector(`#table-${moduleKey} tbody`);
  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Cargando...</td></tr>';

  try {
    const data = await getCollection(config.collection);
    tbody.innerHTML = ''; // Clear loading

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2rem;">No hay registros.</td></tr>';
      return;
    }

    data.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = config.renderRow(item);
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    tbody.innerHTML = `<tr><td colspan="6" style="color:red; text-align:center;">Error al cargar datos.</td></tr>`;
  }
}

// --- Global Actions (exposed to window for onclick handlers) ---

window.refreshModule = (key) => loadModule(key);

window.deleteItem = async (collection, id) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "No podrás revertir esto",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'var(--danger)',
    cancelButtonColor: 'var(--text-light)',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  try {
    await deleteItem(collection, id);
    await Swal.fire({
      title: '¡Eliminado!',
      text: 'El registro ha sido eliminado.',
      icon: 'success',
      confirmButtonColor: 'var(--primary)'
    });
    loadModule(collection); // Refresh specific module
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'No se pudo eliminar: ' + error.message,
      icon: 'error',
      confirmButtonColor: 'var(--primary)'
    });
  }
};

window.updateStatus = async (id, currentStatus) => {
  const { value: newStatus } = await Swal.fire({
    title: 'Actualizar Estado',
    input: 'select',
    inputOptions: {
      'Pendiente': 'Pendiente',
      'En Proceso': 'En Proceso',
      'Resuelto': 'Resuelto'
    },
    inputValue: currentStatus,
    showCancelButton: true,
    confirmButtonColor: 'var(--primary)',
    cancelButtonColor: 'var(--text-light)',
    inputValidator: (value) => {
      if (!value) {
        return 'Debes seleccionar un estado';
      }
    }
  });

  if (!newStatus || newStatus === currentStatus) return;

  try {
    await updateItem('reportes', id, { estado: newStatus });
    Swal.fire({
      icon: 'success',
      title: 'Actualizado',
      text: `El estado ahora es: ${newStatus}`,
      timer: 1500,
      showConfirmButton: false
    });
    loadModule('reportes');
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'No se pudo actualizar: ' + error.message,
      icon: 'error',
      confirmButtonColor: 'var(--primary)'
    });
  }
};

// --- Form Handlers ---

function setupForm(formId, moduleKey) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Guardando...';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      await createItem(modules[moduleKey].collection, data);
      form.reset();
      loadModule(moduleKey);

      Swal.fire({
        icon: 'success',
        title: '¡Guardado!',
        text: 'Registro creado exitosamente',
        confirmButtonColor: 'var(--primary)'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        confirmButtonColor: 'var(--primary)'
      });
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}

// --- Initialization ---

(async () => {
  setupForm('form-proyectos', 'proyectos');
  setupForm('form-servicios', 'servicios');

  // Load all modules
  await Promise.all([
    loadModule('reportes'),
    loadModule('proyectos'),
    loadModule('servicios')
  ]);
})();

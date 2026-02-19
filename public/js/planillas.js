const API_URL = 'http://localhost:3001/planillas';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('planilla-form');
    const inputSalarioBase = document.getElementById('salarioBase');
    const inputHorasExtra = document.getElementById('horasExtra');
    const inputRebajos = document.getElementById('rebajos');
    const inputSalarioNeto = document.getElementById('salarioNeto');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnGuardarPlanilla = document.getElementById('btnGuardarPlanilla');

    // Inicializar calculations
    const calcularNeto = () => {
        const base = parseFloat(inputSalarioBase.value) || 0;
        const cantHorasExtra = parseFloat(inputHorasExtra.value) || 0;
        const porcRebajos = parseFloat(inputRebajos.value) || 0;

        // Cálculo de horas extra: (Base / 240) * 1.5 * cantidad
        const montoExtra = (base / 240) * 1.5 * cantHorasExtra;

        // Cálculo de rebajos: Base * porcentaje / 100
        const montoRebajos = base * (porcRebajos / 100);

        const neto = base + montoExtra - montoRebajos;
        inputSalarioNeto.value = neto.toFixed(2);
    };

    inputSalarioBase.addEventListener('input', calcularNeto);
    inputHorasExtra.addEventListener('input', calcularNeto);
    inputRebajos.addEventListener('input', calcularNeto);

    // Cargar datos al inicio
    loadPlanillas();

    // Event listener para el formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('planilla-id').value;
        const data = {
            empleadoId: document.getElementById('empleadoId').value,
            nombreEmpleado: document.getElementById('nombreEmpleado').value,
            puesto: document.getElementById('puesto').value,
            departamento: document.getElementById('departamento').value,
            salarioBase: parseFloat(inputSalarioBase.value) || 0,
            horasExtra: parseFloat(inputHorasExtra.value) || 0, // Guardamos la CANTIDAD
            rebajos: parseFloat(inputRebajos.value) || 0, // Guardamos el %
            salarioNeto: parseFloat(inputSalarioNeto.value) || 0
        };

        try {
            if (id) {
                await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
            resetForm();
            loadPlanillas();
        } catch (error) {
            console.error('Error saving payroll:', error);
            alert('Error al guardar el registro');
        }
    });

    btnCancelar.addEventListener('click', () => {
        resetForm();
    });

    function resetForm() {
        form.reset();
        document.getElementById('planilla-id').value = '';
        btnCancelar.style.display = 'none';
        btnGuardarPlanilla.innerHTML = '<i class="fas fa-save"></i> Guardar Registro';
    }
});

async function loadPlanillas() {
    try {
        const response = await fetch(API_URL);
        const planillas = await response.json();
        renderPlanillas(planillas);
    } catch (error) {
        console.error('Error loading payrolls:', error);
    }
}

// Formatter for currency
const currencyFormatter = new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

function renderPlanillas(planillas) {
    const tableBody = document.getElementById('lista-planillas-body');
    tableBody.innerHTML = '';

    planillas.forEach(item => {
        // Recalculamos montos para mostrar en la tabla ya que guardamos cantidad/%
        const montoExtra = (item.salarioBase / 240) * 1.5 * item.horasExtra;
        const montoRebajos = item.salarioBase * (item.rebajos / 100);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.empleadoId}</td>
            <td>${item.nombreEmpleado}</td>
            <td>${item.puesto}</td>
            <td>${item.departamento}</td>
            <td class="currency">${currencyFormatter.format(item.salarioBase)}</td>
            <td title="Cantidad: ${item.horasExtra}">${currencyFormatter.format(montoExtra)}</td>
            <td title="Porcentaje: ${item.rebajos}%">${currencyFormatter.format(montoRebajos)}</td>
            <td class="currency"><strong>${currencyFormatter.format(item.salarioNeto)}</strong></td>
            <td class="actions-cell">
                <button class="btn-edit" onclick="editPlanilla('${item.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-delete" onclick="deletePlanilla('${item.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

window.editPlanilla = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const item = await response.json();

        document.getElementById('planilla-id').value = item.id;
        document.getElementById('empleadoId').value = item.empleadoId;
        document.getElementById('nombreEmpleado').value = item.nombreEmpleado;
        document.getElementById('puesto').value = item.puesto;
        document.getElementById('departamento').value = item.departamento;

        document.getElementById('salarioBase').value = item.salarioBase;
        document.getElementById('horasExtra').value = item.horasExtra;
        document.getElementById('rebajos').value = item.rebajos;
        document.getElementById('salarioNeto').value = item.salarioNeto;

        document.getElementById('btnCancelar').style.display = 'block';
        document.getElementById('btnGuardarPlanilla').innerHTML = '<i class="fas fa-sync"></i> Actualizar Registro';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Error fetching payroll detail:', error);
    }
};

window.deletePlanilla = async (id) => {
    if (confirm('¿Está seguro de eliminar este registro de planilla?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            loadPlanillas();
        } catch (error) {
            console.error('Error deleting payroll:', error);
        }
    }
};

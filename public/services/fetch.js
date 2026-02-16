// URL Base
const BASE_URL = "http://localhost:3001/proyectosViales";

export async function getProyecto() {
    try {
        const respuestaServidor = await fetch(BASE_URL);
        const datosProyectos = await respuestaServidor.json();
        return datosProyectos;
    } catch (error) {
        console.error("Error al obtener los proyectos", error);
    }

}

export async function postProyecto(proyecto) {
    try {
        const respuestaServidor = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(proyecto)
        });
        const datosProyecto = await respuestaServidor.json();
        return datosProyecto;
    } catch (error) {
        console.error("Error al crear el proyecto", error);
    }
}

export async function updateProyecto(id, proyecto) {
    try {
        const respuestaServidor = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(proyecto)
        });
        const datosProyecto = await respuestaServidor.json();
        return datosProyecto;
    } catch (error) {
        console.error("Error al actualizar el proyecto", error);
    }
}

export async function deleteProyecto(id) {
    try {
        const respuestaServidor = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!respuestaServidor.ok) {
            throw new Error('No se pudo eliminar el proyecto');
        }
        return true;
    } catch (error) {
        console.error("Error al eliminar el proyecto", error);
        return false;
    }
}

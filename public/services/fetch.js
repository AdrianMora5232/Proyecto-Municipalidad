export const get = async (endpoint) => {
    try {
        const response = await fetch(`http://localhost:3001/${endpoint}`);
        if (!response.ok) throw new Error(`Error GET: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const post = async (endpoint, data) => {
    try {
        const response = await fetch(`http://localhost:3001/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`Error POST: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const put = async (endpoint, data) => {
    try {
        const response = await fetch(`http://localhost:3001/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`Error PUT: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const del = async (endpoint) => {
    try {
        const response = await fetch(`http://localhost:3001/${endpoint}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error(`Error DELETE: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Also support PATCH if needed later, but generic names are good.
// The user asked for "get, post, patch, delete" in the prompt "pasaremos al archivo fetch.js a crear la estructura de código get, post, patch, delete".
// So I will add patch as well.

export const patch = async (endpoint, data) => {
    try {
        const response = await fetch(`http://localhost:3001/${endpoint}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`Error PATCH: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

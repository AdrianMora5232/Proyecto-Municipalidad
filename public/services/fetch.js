const BASE_URL = "http://localhost:3001";

// =========================
// GET
// =========================
export const get = async (endpoint) => {
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`);
        if (!response.ok) {
            throw new Error(`Error GET: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// =========================
// POST
// =========================
export const post = async (endpoint, data) => {
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error POST: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// =========================
// PUT
// =========================
export const put = async (endpoint, data) => {
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error PUT: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// =========================
// PATCH
// =========================
export const patch = async (endpoint, data) => {
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error PATCH: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// =========================
// DELETE
// =========================
export const del = async (endpoint) => {
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`Error DELETE: ${response.statusText}`);
        }

        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

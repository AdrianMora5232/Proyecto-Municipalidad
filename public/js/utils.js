// Utility functions for API interaction

const API_BASE = '/api';

/**
 * Validates the email format.
 */
export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * General wrapper for fetch requests.
 */
export const apiFetch = async (endpoint, options = {}) => {
    const url = `${API_BASE}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }

        // Return null for 204 No Content
        if (response.status === 204) return null;

        return await response.json();
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
};

export const getCollection = (collection) => apiFetch(`/${collection}`);
export const getById = (collection, id) => apiFetch(`/${collection}/${id}`);
export const createItem = (collection, data) => apiFetch(`/${collection}`, { method: 'POST', body: JSON.stringify(data) });
export const updateItem = (collection, id, data) => apiFetch(`/${collection}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteItem = (collection, id) => apiFetch(`/${collection}/${id}`, { method: 'DELETE' });

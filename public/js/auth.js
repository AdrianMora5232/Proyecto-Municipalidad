// Authentication handling
const SESSION_KEY = 'muni_user_session';

export const auth = {
    /**
     * Logs calls the login API and stores the session.
     * NOTE: Since the current API structure effectively just checks existence,
     * we will fetch all users and filter. In a real app, this would be a POST /login.
     */
    login: async (email, password) => {
        // Simulating login by checking if user exists in the public list
        // In a real scenario, this is insecure, but fits the current JSON-server-like backend.
        try {
            const response = await fetch('http://localhost:3001/usuarios');
            const users = await response.json();
            // Find user matching BOTH email and password
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Remove password from session for security (basic)
                const sessionUser = { ...user };
                delete sessionUser.password;

                localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
                return sessionUser;
            } else {
                throw new Error('Credenciales inválidas (Correo o contraseña incorrectos)');
            }
        } catch (error) {
            throw error;
        }
    },

    register: async (userData) => {
        // userData: { nombre, email, password, telefono }
        // We post to /api/usuarios
        // Note: Password is field is not stored in the simple db.json structure shown, but we accept it.

        try {
            const response = await fetch('http://localhost:3001/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: userData.nombre,
                    email: userData.email,
                    password: userData.password, // Critical: Send password to server
                    telefono: userData.telefono,
                    rol: 'Ciudadano' // Default role
                })
            });

            if (!response.ok) throw new Error('Error al registrar usuario');
            return await response.json();
        } catch (e) {
            throw e;
        }
    },

    logout: () => {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = '/pages/login.html';
    },

    getUser: () => {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    },

    requireAuth: () => {
        const user = auth.getUser();
        if (!user) {
            window.location.href = '/pages/login.html';
            return null;
        }
        return user;
    },

    requireAdmin: () => {
        const user = auth.requireAuth();
        if (user && user.rol !== 'Admin') {
            alert('Acceso no autorizado');
            window.location.href = '/pages/index.html';
            return null;
        }
        return user;
    }
};
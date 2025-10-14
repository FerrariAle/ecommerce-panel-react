import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext();

// --- Simulação de Papeis ---
const TEST_USERS = {
    'emilys': { password: 'emilyspass', role: 'admin' },
    'michaelw': { password: 'michaelwpass', role: 'sales_manager' },
    'sophiab': { password: 'sophiabpass', role: 'stock_manager' },
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Falha ao carregar sessão.", error);
        } finally {
            setIsInitializing(false);
        }
    }, []);

    const login = async (username, password) => {
        setIsAuthenticating(true);
        try {
            const testUser = TEST_USERS[username];
            if (!testUser || testUser.password !== password) {
                throw new Error("Credenciais inválidas.");
            }

            const response = await fetch("https://dummyjson.com/auth/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Falha no login.")

            const userWithRole = { ...data, role: testUser.role };
            const { accessToken: receivedToken, ...userData } = userWithRole;

            setUser(userData);
            setToken(receivedToken);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', receivedToken);

            navigate("/dashboard");
        } catch (error) {
            logout();
            throw error;
        } finally {
            setIsAuthenticating(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token')
    }

    const value = { user, token, isAuthenticating, isInitializing, login, logout };

    if (isInitializing) {
        <p>Carregando...</p>
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider")
    }
    return context;
}
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
    login: (name: string, email: string) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuth] = useState<AuthState>(() => {
        const stored = localStorage.getItem('adafit_auth');
        return stored ? JSON.parse(stored) : { isAuthenticated: false, user: null };
    });

    useEffect(() => {
        localStorage.setItem('adafit_auth', JSON.stringify(auth));
    }, [auth]);

    const login = (name: string, email: string) => {
        const fakeUser: User = { id: '123', name, email };
        setAuth({ isAuthenticated: true, user: fakeUser });
    };

    const logout = () => {
        setAuth({ isAuthenticated: false, user: null });
    };

    const updateUser = (updates: Partial<User>) => {
        setAuth(prev => ({
            ...prev,
            user: prev.user ? { ...prev.user, ...updates } : null
        }));
    };

    return (
        <AuthContext.Provider value={{ ...auth, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

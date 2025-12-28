import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import { ProfileProvider } from './context/ProfileContext';
import { CustomThemeProvider } from './context/ThemeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <CustomThemeProvider>
                <AuthProvider>
                    <ProfileProvider>
                        <AppDataProvider>
                            <App />
                        </AppDataProvider>
                    </ProfileProvider>
                </AuthProvider>
            </CustomThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);

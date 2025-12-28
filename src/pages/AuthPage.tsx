import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Tabs, Tab, Container, Checkbox, FormControlLabel, Divider, useTheme, IconButton, InputAdornment } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import GoogleIcon from '@mui/icons-material/Google'; // Using MUI Google Icon or generic
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AuthPage: React.FC = () => {
    const theme = useTheme();
    const [tab, setTab] = useState(0);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleAuth = () => {
        // Simple validation mock
        if (!email || !password) return;
        if (tab === 1 && !name) return;

        // Mock login - in real app, validate password
        const userName = name || email.split('@')[0];
        login(userName, email);

        // Flow: Login -> Home/Today, Signup -> Onboarding
        if (tab === 1) { // Signup
            navigate('/profile/setup');
        } else {
            navigate('/today');
        }
    };

    const isDark = theme.palette.mode === 'dark';

    return (
        <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <FitnessCenterIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Welcome to AdaFit
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Your personal context-aware AI coach.
                </Typography>
            </Box>

            <Card sx={{
                borderTop: 4,
                borderColor: 'primary.main',
                boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.5)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
                background: isDark ? '#1E1E1E' : '#FFFFFF'
            }}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Login" />
                    <Tab label="Sign Up" />
                </Tabs>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                        {tab === 1 && (
                            <TextField
                                label="Full Name"
                                fullWidth
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        )}

                        <TextField
                            label="Email Address"
                            fullWidth
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />

                        <TextField
                            label="Password"
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {tab === 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <FormControlLabel
                                    control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} color="primary" />}
                                    label="Remember me"
                                />
                                <Button size="small" sx={{ textTransform: 'none' }}>Forgot password?</Button>
                            </Box>
                        )}

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={handleAuth}
                            sx={{
                                py: 1.5,
                                fontSize: '1.1rem',
                                background: isDark
                                    ? `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`
                                    : `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                                color: 'black',
                                fontWeight: 'bold'
                            }}
                        >
                            {tab === 0 ? 'Login' : 'Create Account'}
                        </Button>

                        <Divider>OR</Divider>

                        <Button
                            variant="outlined"
                            size="large"
                            fullWidth
                            startIcon={<GoogleIcon />}
                            sx={{
                                py: 1.5,
                                borderColor: 'divider',
                                color: 'text.primary',
                                '&:hover': { bgcolor: 'action.hover', borderColor: 'divider' }
                            }}
                        >
                            Continue with Google
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 4 }}>
                By continuing, you agree to our Terms of Service and Privacy Policy.
            </Typography>
        </Container>
    );
};

export default AuthPage;

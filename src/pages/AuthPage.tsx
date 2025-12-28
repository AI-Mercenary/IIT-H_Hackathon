import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Tabs, Tab, Container, Checkbox, FormControlLabel, Divider, useTheme, IconButton, InputAdornment, alpha } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import GoogleIcon from '@mui/icons-material/Google';
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
        <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '90vh' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <FitnessCenterIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    AdaFit
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {tab === 0 ? 'Welcome back, athlete.' : 'Start your adaptive journey.'}
                </Typography>
            </Box>

            <Card sx={{
                borderRadius: 4,
                boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.5)' : '0 20px 40px rgba(0, 0, 0, 0.1)',
                background: isDark ? '#1E1E1E' : '#FFFFFF',
                mb: 4
            }}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    variant="fullWidth"
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Login" sx={{ py: 3, fontWeight: 'bold' }} />
                    <Tab label="Create Account" sx={{ py: 3, fontWeight: 'bold' }} />
                </Tabs>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                        {tab === 1 && (
                            <TextField
                                label="Full Name"
                                fullWidth
                                value={name}
                                onChange={e => setName(e.target.value)}
                                slotProps={{ input: { sx: { borderRadius: 2 } } }}
                            />
                        )}

                        <TextField
                            label="Email Address"
                            fullWidth
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            slotProps={{ input: { sx: { borderRadius: 2 } } }}
                        />

                        <TextField
                            label="Password"
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            slotProps={{
                                input: {
                                    sx: { borderRadius: 2 },
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
                                }
                            }}
                        />

                        {tab === 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <FormControlLabel
                                    control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} color="primary" />}
                                    label="Remember me"
                                    componentsProps={{ typography: { variant: 'body2', color: 'text.secondary' } }}
                                />
                                <Button size="small" sx={{ textTransform: 'none', fontWeight: 600 }}>Forgot password?</Button>
                            </Box>
                        )}

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={handleAuth}
                            sx={{
                                py: 1.5,
                                fontSize: '1rem',
                                borderRadius: 2,
                                background: theme.palette.primary.main,
                                color: 'black',
                                fontWeight: 'bold',
                                boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                '&:hover': {
                                    transform: 'translateY(-1px)',
                                    boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.4)}`
                                }
                            }}
                        >
                            {tab === 0 ? 'Sign In' : 'Create Account'}
                        </Button>

                        <Divider sx={{ my: 1 }}>
                            <Typography variant="caption" color="text.secondary">OR CONTINUE WITH</Typography>
                        </Divider>

                        <Button
                            variant="outlined"
                            size="large"
                            fullWidth
                            startIcon={<GoogleIcon />}
                            onClick={() => login('User', 'user@gmail.com')}
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                borderColor: theme.palette.divider,
                                color: 'text.primary',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.05), borderColor: 'text.primary' }
                            }}
                        >
                            Google
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Typography variant="body2" align="center" color="text.secondary">
                By continuing, you agree to our <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer' }}>Terms</Box> and <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer' }}>Privacy Policy</Box>.
            </Typography>
        </Container>
    );
};

export default AuthPage;

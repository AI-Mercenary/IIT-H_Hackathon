import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Tooltip, Avatar, Badge, useTheme, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Footer from '../components/Footer';
import FloatingChatPanel from '../components/FloatingChatPanel';

const MainLayout: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { mode, toggleTheme } = useThemeMode();
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { label: 'Today', path: '/today', icon: <CalendarTodayIcon /> },
        { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
        { label: 'Diet', path: '/diet', icon: <RestaurantIcon /> },
        { label: 'Progress', path: '/progress', icon: <TimelineIcon /> },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Box sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <FitnessCenterIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">AdaFit</Typography>
            </Box>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton onClick={() => navigate(item.path)} selected={isActive(item.path)}>
                            <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Container maxWidth="lg">
                    <Toolbar disableGutters>
                        {/* Mobile Menu Icon */}
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { md: 'none' }, color: 'text.primary' }}
                        >
                            <MenuIcon />
                        </IconButton>

                        {/* Logo Area */}
                        <Box
                            component={Link}
                            to="/"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                color: 'text.primary',
                                mr: 4,
                                flexGrow: { xs: 1, md: 0 }
                            }}
                        >
                            <FitnessCenterIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 32 }} />
                            <Typography
                                variant="h6"
                                noWrap
                                sx={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 800,
                                    letterSpacing: '-0.02em',
                                    color: 'text.primary',
                                }}
                            >
                                AdaFit
                            </Typography>
                        </Box>

                        {/* Desktop Nav */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center', ml: 4 }}>
                            {isAuthenticated && navItems.map((item) => (
                                <Button
                                    key={item.label}
                                    component={Link}
                                    to={item.path}
                                    startIcon={item.icon}
                                    sx={{
                                        color: isActive(item.path) ? 'primary.contrastText' : 'text.secondary',
                                        bgcolor: isActive(item.path) ? 'primary.main' : 'transparent',
                                        fontWeight: isActive(item.path) ? 700 : 500,
                                        borderRadius: '20px',
                                        px: 3,
                                        py: 1,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            bgcolor: isActive(item.path) ? 'primary.dark' : 'rgba(0,0,0,0.05)',
                                            color: isActive(item.path) ? 'primary.contrastText' : 'text.primary',
                                        },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>

                        {/* Right Actions */}
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Tooltip title="Toggle Theme">
                                <IconButton onClick={toggleTheme} color="default" size="small">
                                    {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                                </IconButton>
                            </Tooltip>

                            {isAuthenticated && (
                                <Tooltip title="Workouts">
                                    <IconButton
                                        component={Link}
                                        to="/workouts"
                                        color={isActive('/workouts') ? 'primary' : 'default'}
                                        sx={{ mr: 1 }}
                                    >
                                        <FitnessCenterIcon />
                                    </IconButton>
                                </Tooltip>
                            )}

                            {isAuthenticated ? (
                                <>
                                    <Tooltip title="Notifications">
                                        <IconButton color="default" size="small">
                                            <Badge badgeContent={2} color="error" variant="dot">
                                                <NotificationsNoneIcon fontSize="small" />
                                            </Badge>
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Profile">
                                        <IconButton
                                            component={Link}
                                            to="/profile"
                                            sx={{
                                                width: 40, height: 40,
                                                ml: 1,
                                                border: isActive('/profile') ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 32, height: 32,
                                                    bgcolor: 'primary.main',
                                                    color: 'white',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {user?.name?.charAt(0) || <PersonIcon />}
                                            </Avatar>
                                        </IconButton>
                                    </Tooltip>
                                </>
                            ) : (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button color="inherit" component={Link} to="/auth">Login</Button>
                                    <Button variant="contained" component={Link} to="/auth">Sign Up</Button>
                                </Box>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <nav>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Outlet />
            </Box>

            <Footer />
            <FloatingChatPanel />
        </Box >
    );
};

export default MainLayout;

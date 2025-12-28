import { PaletteMode } from '@mui/material';

const BRAND_YELLOW = '#FFC400'; // Primary Yellow
const BRAND_AMBER = '#FFCA28';  // Accent/Warning
const DARK_BG = '#121212';
const DARK_PAPER = '#1E1E1E';
const LIGHT_BG = '#F5F5F5';
const LIGHT_PAPER = '#FFFFFF';

export const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        primary: {
            main: BRAND_YELLOW,
            contrastText: 'rgba(0, 0, 0, 0.87)',
        },
        secondary: {
            main: BRAND_AMBER,
            contrastText: 'rgba(0, 0, 0, 0.87)',
        },
        background: {
            default: mode === 'dark' ? DARK_BG : LIGHT_BG,
            paper: mode === 'dark' ? DARK_PAPER : LIGHT_PAPER,
        },
        text: {
            primary: mode === 'dark' ? '#FFFFFF' : '#121212',
            secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        },
        action: {
            active: mode === 'dark' ? BRAND_YELLOW : 'rgba(0, 0, 0, 0.54)',
        }
    },
    typography: {
        fontFamily: '"DM Sans", "Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: {
            fontWeight: 600,
            textTransform: 'none' as const,
        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: mode === 'dark'
                        ? 'radial-gradient(circle at 50% -20%, #2c2c2c, #121212)'
                        : 'linear-gradient(180deg, #fafafa 0%, #f0f0f0 100%)',
                    minHeight: '100vh',
                    backgroundAttachment: 'fixed',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: mode === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                    borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'}`,
                    color: mode === 'dark' ? '#fff' : '#000',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
                containedPrimary: {
                    backgroundColor: BRAND_YELLOW,
                    color: 'black',
                    '&:hover': {
                        backgroundColor: '#FFD740',
                    }
                }
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    backgroundImage: 'none', // Reset for dark mode
                    boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.05)',
                    border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'}`,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
                colorSuccess: {
                    backgroundColor: '#00C853',
                    color: 'white',
                },
                colorWarning: { // Highlighting our Amber
                    backgroundColor: BRAND_AMBER,
                    color: 'black',
                }
            }
        }
    },
});

import React from 'react';
import { Box, Container, Typography, Link, useTheme, Grid, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const Footer: React.FC = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box
            component="footer"
            sx={{
                py: 8,
                backgroundColor: isDark ? '#121212' : '#f5f5f5',
                borderTop: '1px solid',
                borderColor: 'divider',
                color: 'text.secondary',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="space-between">
                    {/* Brand Column */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <FitnessCenterIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                            <Typography variant="h6" fontWeight="800" color="text.primary">
                                AdaFit
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ maxWidth: 300, mb: 3 }}>
                            The next generation of AI-powered fitness. Context-aware coaching that adapts to your life, energy, and goals in real-time.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton color="inherit" size="small"><TwitterIcon /></IconButton>
                            <IconButton color="inherit" size="small"><InstagramIcon /></IconButton>
                            <IconButton color="inherit" size="small"><FacebookIcon /></IconButton>
                            <IconButton color="inherit" size="small"><LinkedInIcon /></IconButton>
                        </Box>
                    </Grid>

                    {/* Links Columns */}
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.primary" gutterBottom>
                            PRODUCT
                        </Typography>
                        <Link href="#" color="inherit" display="block" underline="hover" sx={{ mb: 1 }}>Mobile App</Link>

                        <Link href="#" color="inherit" display="block" underline="hover" sx={{ mb: 1 }}>Pricing</Link>
                        <Link href="#" color="inherit" display="block" underline="hover" sx={{ mb: 1 }}>Testimonials</Link>
                    </Grid>

                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.primary" gutterBottom>
                            COMPANY
                        </Typography>
                        <Link href="#" color="inherit" display="block" underline="hover" sx={{ mb: 1 }}>About Us</Link>

                    </Grid>

                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.primary" gutterBottom>
                            LEGAL
                        </Typography>
                        <Link href="#" color="inherit" display="block" underline="hover" sx={{ mb: 1 }}>Privacy Policy</Link>
                        <Link href="#" color="inherit" display="block" underline="hover" sx={{ mb: 1 }}>Terms of Service</Link>
                        <Link href="#" color="inherit" display="block" underline="hover" sx={{ mb: 1 }}>Cookie Policy</Link>
                    </Grid>
                </Grid>

                <Box sx={{
                    mt: 8,
                    pt: 4,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} AdaFit Inc. All rights reserved.
                    </Typography>
                    <Box sx={{ mt: { xs: 2, sm: 0 }, display: 'flex', gap: 3 }}>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;

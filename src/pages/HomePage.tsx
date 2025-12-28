import React from 'react';
import { Box, Typography, Button, Container, Card, useTheme, Chip, Grid, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BoltIcon from '@mui/icons-material/Bolt';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ScrollAnimation from '../components/ScrollAnimation';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // Hero Background Styles
    const heroBg = isDark
        ? 'radial-gradient(circle at 70% 20%, rgba(255, 196, 0, 0.15) 0%, rgba(18,18,18,0) 50%)'
        : 'radial-gradient(circle at 70% 20%, rgba(255, 196, 0, 0.2) 0%, rgba(245,245,245,0) 50%)';

    return (
        <Box>
            {/* HERO SECTION */}
            <Box sx={{
                minHeight: { xs: 'auto', md: '85vh' }, // Reduced from 90vh
                display: 'flex',
                alignItems: 'center',
                background: heroBg,
                position: 'relative',
                overflow: 'visible', // Allow bubble to peek if needed, but we connect it inside
                pt: { xs: 12, md: 0 },
                pb: { xs: 12, md: 0 }
            }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 8 }}>
                        {/* Left Content */}
                        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                            <ScrollAnimation direction="up">
                                <Chip
                                    icon={<SmartToyIcon sx={{ fontSize: 16 }} />}
                                    label="AI-Powered Coaching v1.0"
                                    size="small"
                                    sx={{ mb: 2, bgcolor: isDark ? 'rgba(255, 196, 0, 0.1)' : 'rgba(0,0,0,0.05)', color: 'text.secondary', fontWeight: 600 }}
                                />
                                <Typography variant="h2" component="h1" fontWeight="800" gutterBottom sx={{ lineHeight: 1.1 }}>
                                    AdaFit Agent <br />
                                    <Box component="span" sx={{ color: 'primary.main' }}>Context-Aware</Box> Fitness
                                </Typography>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: { xs: 'auto', md: 0 } }}>
                                    Stop following static plans. AdaFit adapts your daily workouts and meals to your stress, energy, sleep, and goals in real-time.
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' }, mb: 4 }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => navigate('/auth')}
                                        sx={{
                                            px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 2,
                                            boxShadow: `0 8px 20px ${isDark ? 'rgba(255, 196, 0, 0.2)' : 'rgba(255, 196, 0, 0.3)'}`,
                                            '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 12px 24px ${isDark ? 'rgba(255, 196, 0, 0.3)' : 'rgba(255, 196, 0, 0.4)'}` }
                                        }}
                                    >
                                        Start My Plan
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => navigate('/dashboard')}
                                        sx={{
                                            px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 2, borderWidth: 2,
                                            '&:hover': { borderWidth: 2 }
                                        }}
                                    >
                                        See Dashboard
                                    </Button>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 3, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
                                    {['Adaptive workouts', 'Smart diet guidance', 'Clear progress'].map((text, i) => (
                                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CheckCircleIcon color="primary" sx={{ fontSize: 18 }} />
                                            <Typography variant="body2" fontWeight="500">{text}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </ScrollAnimation>
                        </Box>

                        {/* Right Content: Mock Dashboard */}
                        <Box sx={{ flex: 1, position: 'relative', width: '100%' }}>
                            <ScrollAnimation direction="left" delay={200}>
                                {/* Main Card */}
                                <Card sx={{
                                    p: 3,
                                    borderRadius: 4,
                                    background: isDark ? '#1E1E1E' : '#FFFFFF',
                                    border: `1px solid ${isDark ? '#333' : '#E0E0E0'}`,
                                    boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.5)' : '0 20px 50px rgba(0,0,0,0.1)',
                                    maxWidth: 500,
                                    mx: 'auto'
                                }}>
                                    {/* Mock KPI Strip */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                        {[
                                            { label: 'Streak', val: '12 Days', color: 'primary.main' },
                                            { label: 'Workouts', val: '4/5', color: 'text.primary' },
                                            { label: 'Avg Sleep', val: '7.2h', color: 'text.secondary' }
                                        ].map((k, i) => (
                                            <Box key={i} textAlign="center">
                                                <Typography variant="caption" color="text.secondary" display="block">{k.label}</Typography>
                                                <Typography variant="h6" fontWeight="bold" color={k.color}>{k.val}</Typography>
                                            </Box>
                                        ))}
                                    </Box>

                                    {/* Mock Chart */}
                                    <Box sx={{ height: 100, mb: 3, bgcolor: isDark ? '#121212' : '#F5F5F5', borderRadius: 1, p: 1 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={[
                                                { v: 30 }, { v: 40 }, { v: 35 }, { v: 50 }, { v: 45 }, { v: 60 }, { v: 70 }
                                            ]}>
                                                <defs>
                                                    <linearGradient id="colorHero" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.5} />
                                                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <Area type="monotone" dataKey="v" stroke={theme.palette.primary.main} strokeWidth={2} fillOpacity={1} fill="url(#colorHero)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </Box>

                                    {/* Today's Focus */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, bgcolor: isDark ? '#252525' : '#FAFAFA' }}>
                                        <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <BoltIcon sx={{ color: 'black' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold">Today: High Intensity</Typography>
                                            <Typography variant="caption" color="text.secondary">Energy is high. Let's push it!</Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            </ScrollAnimation>

                            {/* Floating Chat Bubble - REPOSITIONED INSIDE */}
                            <Box sx={{ position: 'absolute', bottom: -40, right: { xs: 0, md: -20 }, maxWidth: 280, zIndex: 10 }}>
                                <ScrollAnimation direction="down" delay={800}>
                                    <Card sx={{ bgcolor: 'secondary.main', color: 'black', borderRadius: '30px 30px 0 30px', p: 2, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                                        <Typography variant="body2" fontWeight="600">
                                            "You slept 6h with high stress — let’s switch to a recovery flow & high-protein meal."
                                        </Typography>
                                    </Card>
                                </ScrollAnimation>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* FEATURES SECTION */}
            <Box sx={{ py: 4, bgcolor: isDark ? '#181818' : '#F9F9F9' }}>
                <Container maxWidth="lg">
                    <Box textAlign="center" mb={8}>
                        <ScrollAnimation direction="up">
                            <Typography variant="h3" fontWeight="bold" gutterBottom>Why AdaFit Agent?</Typography>
                            <Typography variant="h4" color="text.secondary">Designed as an AI coach, not just a workout list.</Typography>
                        </ScrollAnimation>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 6, mt: -6 }}>
                        {[
                            { icon: <FitnessCenterIcon fontSize="large" />, title: "Adaptive Workouts", text: "Plans adjust daily to your stress, energy, and sleep data." },
                            { icon: <RestaurantMenuIcon fontSize="large" />, title: "Smart Nutrition", text: "Meal guidance aligned with your goal and dietary preferences." },
                            { icon: <ShowChartIcon fontSize="large" />, title: "Clear Progress", text: "Real-time streaks, completion rates, and coach insights." }
                        ].map((feature, idx) => (
                            <ScrollAnimation key={idx} delay={idx * 150} direction="up">
                                <Card sx={{
                                    height: '100%',
                                    textAlign: 'center',
                                    p: 3,
                                    borderRadius: -9,
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderColor: 'primary.main' },
                                    border: '1px solid transparent'
                                }}>
                                    <Box sx={{
                                        mb: 3,
                                        width: 70,
                                        height: 70,
                                        borderRadius: '50%',
                                        bgcolor: 'rgba(255, 196, 0, 0.1)',
                                        color: 'primary.main',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto'
                                    }}>
                                        {feature.icon}
                                    </Box>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>{feature.title}</Typography>
                                    <Typography variant="body1" color="text.secondary">{feature.text}</Typography>
                                </Card>
                            </ScrollAnimation>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* HOW IT WORKS SECTION */}
            <Box sx={{ py: 6 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={8} alignItems="stretch">
                        <Grid size={{ xs: 12, md: 5 }}>
                            <ScrollAnimation direction="right">
                                <Typography variant="h3" fontWeight="bold" gutterBottom>How it works</Typography>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
                                    Three simple steps to your best self.
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    {[
                                        { step: 1, title: 'Check In', desc: 'Tell AdaFit about your stress, sleep, and energy levels.' },
                                        { step: 2, title: 'Get Adaptive Plan', desc: 'Receive a workout & meal plan tailored to your day.' },
                                        { step: 3, title: 'Execute & Improve', desc: 'Track streaks and get smarter insights over time.' }
                                    ].map((item, idx) => (
                                        <Box key={idx} sx={{ display: 'flex' }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 3 }}>
                                                {/* STEP CIRCLE */}
                                                <Box sx={{
                                                    width: 40, height: 40, borderRadius: '50%',
                                                    border: '2px solid', borderColor: 'primary.main',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                                                    zIndex: 2,
                                                    bgcolor: isDark ? 'background.default' : 'background.paper',
                                                    transition: 'all 0.5s',
                                                    animation: 'pulseStep 3s infinite', // Faster loop
                                                    animationDelay: `${idx * 1.0}s`,    // Tighter sequence
                                                    '@keyframes pulseStep': {
                                                        '0%': { boxShadow: '0 0 0 0 rgba(255, 196, 0, 0)', borderColor: theme.palette.divider },
                                                        '5%': { borderColor: theme.palette.primary.main, backgroundColor: theme.palette.primary.main, color: 'black' }, // Rapid on
                                                        '30%': { borderColor: theme.palette.primary.main, backgroundColor: theme.palette.primary.main, color: 'black' }, // Hold
                                                        '40%': { borderColor: theme.palette.divider, backgroundColor: 'transparent', color: 'inherit' } // Fade
                                                    }
                                                }}>
                                                    {item.step}
                                                </Box>

                                                {/* CONNECTOR LINE */}
                                                {idx !== 2 && (
                                                    <Box sx={{ width: 2, flexGrow: 1, my: 0, bgcolor: 'divider', position: 'relative', overflow: 'hidden' }}>
                                                        <Box sx={{
                                                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                                            bgcolor: 'primary.main',
                                                            transform: 'scaleY(0)',
                                                            transformOrigin: 'top',
                                                            animation: 'growLine 3s infinite linear',
                                                            animationDelay: `${(idx * 1.0) + 0.5}s`, // Starts after step flash
                                                            '@keyframes growLine': {
                                                                '0%': { transform: 'scaleY(0)' },
                                                                '10%': { transform: 'scaleY(1)' }, // Rapid fill
                                                                '25%': { transform: 'scaleY(1)', opacity: 1 }, // Hold
                                                                '35%': { transform: 'scaleY(1)', opacity: 0 } // Fade
                                                            }
                                                        }} />
                                                    </Box>
                                                )}
                                            </Box>
                                            <Box sx={{ pb: 6, pt: 1 }}>
                                                <Typography variant="h6" fontWeight="bold">{item.title}</Typography>
                                                <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </ScrollAnimation>
                        </Grid>
                        <Grid size={{ xs: 12, md: 7 }}>
                            <ScrollAnimation direction="left">
                                <Box sx={{
                                    bgcolor: isDark ? '#1E1E1E' : '#FAFAFA',
                                    borderRadius: 8,
                                    p: 4,
                                    boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.1)',
                                    maxWidth: 600,
                                    mx: 'auto'
                                }}>
                                    {/* Mock Chat Interface */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box sx={{ alignSelf: 'flex-end', bgcolor: 'primary.main', color: 'black', px: 3, py: 2, borderRadius: '20px 20px 0 20px' }}>
                                            <Typography variant="body2" fontWeight="600">I'm feeling a bit tired today, slept poorly.</Typography>
                                        </Box>
                                        <Box sx={{ alignSelf: 'flex-start', bgcolor: isDark ? '#333' : '#E0E0E0', px: 3, py: 2, borderRadius: '20px 20px 20px 0' }}>
                                            <Typography variant="body2">
                                                Understood. I've switched your HIIT session to a <Box component="span" fontWeight="bold" color={isDark ? "primary.light" : "primary.dark"}>Recovery Yoga</Box> flow to help you recharge.
                                            </Typography>
                                        </Box>

                                        {/* Mini Cards */}
                                        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                            <Card sx={{ flex: 1, bgcolor: isDark ? '#252525' : '#fff', borderRadius: 3, p: 2 }}>
                                                <Typography variant="caption" color="primary">UPDATED PLAN</Typography>
                                                <Typography variant="subtitle2" fontWeight="bold">Recovery Yoga</Typography>
                                                <Typography variant="caption" color="text.secondary">30 Min • Low Intensity</Typography>
                                            </Card>
                                            <Card sx={{ flex: 1, bgcolor: isDark ? '#252525' : '#fff', borderRadius: 3, p: 2 }}>
                                                <Typography variant="caption" color="secondary">NUTRITION</Typography>
                                                <Typography variant="subtitle2" fontWeight="bold">Magnesium Rich</Typography>
                                                <Typography variant="caption" color="text.secondary">Spinach & Salmon</Typography>
                                            </Card>
                                        </Box>
                                    </Box>
                                </Box>
                            </ScrollAnimation>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* CTA STRIP */}
            <Box sx={{ py: 10, bgcolor: isDark ? '#000' : '#121212', borderTop: '4px solid', borderColor: 'primary.main', color: 'white', textAlign: 'center' }}>
                <Container maxWidth="md">
                    <ScrollAnimation direction="up">
                        <Typography variant="h3" fontWeight="800" gutterBottom>
                            Ready to see what an AI coach feels like?
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4, color: 'gray' }}>
                            Start your context-aware fitness journey today.
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/auth')}
                                sx={{
                                    fontSize: '1.2rem', px: 6, py: 2, borderRadius: 2,
                                    bgcolor: 'primary.main', color: 'black',
                                    '&:hover': { bgcolor: 'white' }
                                }}
                            >
                                Start My Plan
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate('/dashboard')}
                                sx={{
                                    fontSize: '1.2rem', px: 6, py: 2, borderRadius: 2,
                                    borderColor: 'white', color: 'white',
                                    '&:hover': { borderColor: 'primary.main', color: 'primary.main' }
                                }}
                            >
                                Preview Dashboard
                            </Button>
                        </Box>

                    </ScrollAnimation>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;

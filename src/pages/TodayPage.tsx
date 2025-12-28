import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Chip, Button, IconButton, TextField, useTheme, Fade, Divider, List, ListItem, ListItemText, ListItemIcon, CircularProgress, LinearProgress, Rating, ToggleButton, ToggleButtonGroup, Container } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import MoodIcon from '@mui/icons-material/Mood';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useAppData } from '../context/AppDataContext';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TodayPage: React.FC = () => {
    const theme = useTheme();
    const { latestWorkout, latestDiet, generateWorkoutPlan, generateMealPlan } = useAppData();

    // Mock 24h Data (00:00 to 23:00)
    const dailyData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i.toString().padStart(2, '0')}:00`,
        activity: i < 6 ? 10 : i < 9 ? 30 : i === 18 ? 90 : i > 22 ? 10 : 40,
        energy: i < 7 ? 80 : i < 18 ? 60 : 40
    }));

    // Chat logic local state
    const [messages, setMessages] = useState<{ sender: 'user' | 'bot', text: string }[]>([
        { sender: 'bot', text: "Good morning! Ready to tackle today? How are your stress and energy levels?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showReasoning, setShowReasoning] = useState(false);

    // Trackers State
    const [waterGlasses, setWaterGlasses] = useState(3);
    const [sleepQuality, setSleepQuality] = useState<number | null>(4);
    const [currentMood, setCurrentMood] = useState<string | null>('happy');

    const waterGoal = 8;

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, { sender: 'user', text: input }]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { sender: 'bot', text: "Got it. Based on that, I'm adjusting your plan to be slightly higher intensity since your energy is good." }]);

            if (!latestWorkout) generateWorkoutPlan();
            if (!latestDiet) generateMealPlan();
            setShowReasoning(true);
        }, 1500);
    };

    const isDark = theme.palette.mode === 'dark';

    // Helper for Section Headings
    const SectionHeading = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, mt: 3, opacity: 0.9 }}>
            {icon}
            <Typography variant="h6" fontWeight="bold" letterSpacing={0.5}>{text}</Typography>
        </Box>
    );

    return (
        <React.Fragment>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, height: { md: 'calc(100vh - 140px)' } }}>

                    {/* 1. Left Column: Coach Chat Panel */}
                    <Box sx={{ flex: { xs: 'none', md: 5 }, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 500 }}>
                        <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', overflow: 'hidden', borderRadius: 4, boxShadow: theme.shadows[4] }}>
                            {/* Chat Header */}
                            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, bgcolor: isDark ? '#272727' : '#fafafa' }}>
                                <Box sx={{
                                    width: 44, height: 44, borderRadius: '50%',
                                    bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: `0 0 12px ${theme.palette.primary.main}`,
                                    position: 'relative',
                                    '&::after': {
                                        content: '""', position: 'absolute', width: '100%', height: '100%', borderRadius: '50%',
                                        border: `2px solid ${theme.palette.primary.main}`, opacity: 0, animation: 'pulse 2s infinite',
                                        '@keyframes pulse': { '0%': { transform: 'scale(1)', opacity: 0.8 }, '100%': { transform: 'scale(1.5)', opacity: 0 } }
                                    }
                                }}>
                                    <SmartToyIcon sx={{ color: 'black', zIndex: 1 }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">Coach Ada</Typography>
                                    <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', display: 'inline-block' }} />
                                        Online
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Chat Area */}
                            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {messages.map((msg, idx) => (
                                    <Box key={idx} sx={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                                        <Card sx={{
                                            borderRadius: msg.sender === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                                            bgcolor: msg.sender === 'user' ? 'primary.main' : isDark ? '#333' : '#f5f5f5',
                                            color: msg.sender === 'user' ? 'black' : 'text.primary',
                                            boxShadow: 'none', p: 1.5
                                        }}>
                                            <Typography variant="body1">{msg.text}</Typography>
                                        </Card>
                                    </Box>
                                ))}
                                {isTyping && (
                                    <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                                        <CircularProgress size={12} color="primary" />
                                        <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>Agents thinking...</Typography>
                                    </Box>
                                )}
                            </Box>

                            {/* Quick Replies */}
                            <Box sx={{ px: 2, py: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Chip label="Make it easier" onClick={() => setInput("Make it easier")} clickable size="small" variant="outlined" />
                                <Chip label="I have only 20 min" onClick={() => setInput("I have only 20 min")} clickable size="small" variant="outlined" />
                                <Chip label="Switch to Vegetarian" onClick={() => setInput("Switch to Vegetarian options")} clickable size="small" variant="outlined" />
                            </Box>

                            {/* Input Area */}
                            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1, bgcolor: isDark ? '#272727' : '#fafafa' }}>
                                <TextField
                                    fullWidth placeholder="Type a message..." size="small" value={input}
                                    onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: 'background.paper' } }}
                                />
                                <IconButton color="primary" onClick={handleSend} sx={{ bgcolor: 'primary.main', color: 'black', '&:hover': { bgcolor: 'primary.dark' } }}>
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </Card>
                    </Box>


                    {/* 2. Right Column: Structured Overview */}
                    <Box sx={{ flex: { xs: 'none', md: 7 }, height: '100%', overflowY: 'auto', pr: 1, pb: 4 }}>

                        {/* SUPER INSIGHT CARD - High Priority Highlight */}
                        <Fade in={true} timeout={800}>
                            <Card sx={{
                                mb: 4,
                                borderRadius: 3,
                                background: isDark ? 'linear-gradient(135deg, #1e1e1e 0%, #252525 100%)' : 'linear-gradient(135deg, #fff 0%, #f5f5f5 100%)',
                                border: '1px solid',
                                borderColor: theme.palette.primary.main,
                                boxShadow: `0 8px 32px rgba(255, 196, 0, 0.15)`
                            }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <Box sx={{
                                        bgcolor: 'primary.main',
                                        color: 'black',
                                        borderRadius: '50%',
                                        width: 40, height: 40,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                        mt: 0.5
                                    }}>
                                        <PsychologyIcon />
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" textTransform="uppercase" letterSpacing={1.5} color="primary.main" fontWeight="bold" sx={{ mb: 0.5 }}>
                                            AI CALIBRATION
                                        </Typography>
                                        <Typography variant="h6" fontWeight="medium" sx={{ lineHeight: 1.4 }}>
                                            "You slept <Box component="span" fontWeight="bold" color="warning.main">6h</Box> with <Box component="span" fontWeight="bold" color="error.main">high stress</Box> — let’s switch to a <Box component="span" sx={{ textDecoration: 'underline', textDecorationColor: theme.palette.primary.main }}>recovery flow</Box> & <Box component="span" sx={{ textDecoration: 'underline', textDecorationColor: theme.palette.secondary.main }}>high-protein meal</Box>."
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Fade>

                        {/* Section 1: Daily Snapshot */}
                        <SectionHeading icon={<TimelineIcon color="primary" />} text="Daily Snapshot" />
                        <Card sx={{ mb: 1, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
                            <CardContent sx={{ pb: 1 }}>
                                <Box sx={{ height: 120, width: '100%' }}>
                                    <ResponsiveContainer>
                                        <AreaChart data={dailyData}>
                                            <defs>
                                                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, borderRadius: 8, fontSize: 12 }} itemStyle={{ color: theme.palette.text.primary }} />
                                            <XAxis dataKey="hour" hide />
                                            <Area type="monotone" dataKey="activity" stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorActivity)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, px: 1 }}>
                                    <Typography variant="caption" color="text.disabled">00:00</Typography>
                                    <Typography variant="caption" color="text.disabled">12:00</Typography>
                                    <Typography variant="caption" color="text.disabled">23:59</Typography>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Section 2: Wellness Tracker */}
                        <SectionHeading icon={<PsychologyIcon color="secondary" />} text="Wellness Tracker" />
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2, mb: 3 }}>
                            {/* Water */}
                            <Card sx={{ borderRadius: 3 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <LocalDrinkIcon color="info" fontSize="small" />
                                        <Typography variant="subtitle2" fontWeight="bold">Hydration</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <IconButton size="small" onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}><RemoveIcon /></IconButton>
                                        <Typography variant="h5" fontWeight="bold" color="info.main">{waterGlasses}<span style={{ fontSize: '0.6em', color: theme.palette.text.secondary }}>/{waterGoal}</span></Typography>
                                        <IconButton size="small" onClick={() => setWaterGlasses(waterGlasses + 1)}><AddIcon /></IconButton>
                                    </Box>
                                    <LinearProgress variant="determinate" value={(waterGlasses / waterGoal) * 100} sx={{ height: 6, borderRadius: 4, mt: 1 }} color="info" />
                                </CardContent>
                            </Card>

                            {/* Sleep */}
                            <Card sx={{ borderRadius: 3 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <BedtimeIcon color="warning" fontSize="small" />
                                        <Typography variant="subtitle2" fontWeight="bold">Sleep Quality</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                                        <Rating
                                            value={sleepQuality}
                                            onChange={(_, newValue) => setSleepQuality(newValue)}
                                        // icon={<BedtimeIcon fontSize="inherit" />}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Mood */}
                            <Card sx={{ borderRadius: 3, gridColumn: { lg: 'span 2' } }}>
                                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <MoodIcon color="success" fontSize="small" />
                                            <Typography variant="subtitle2" fontWeight="bold">Current Mood</Typography>
                                        </Box>
                                        <ToggleButtonGroup
                                            value={currentMood}
                                            exclusive
                                            onChange={(_, newMood) => setCurrentMood(newMood)}
                                            size="small"
                                            color="primary"
                                        >
                                            <ToggleButton value="stressed">😫</ToggleButton>
                                            <ToggleButton value="tired">😴</ToggleButton>
                                            <ToggleButton value="neutral">😐</ToggleButton>
                                            <ToggleButton value="happy">😊</ToggleButton>
                                            <ToggleButton value="energetic">⚡</ToggleButton>
                                        </ToggleButtonGroup>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>

                        {/* Section 3: Today's Action Plan */}
                        <SectionHeading icon={<CheckCircleIcon color="success" />} text="Today's Action Plan" />

                        {latestWorkout && (
                            <Fade in={true} timeout={500}>
                                <Card sx={{ mb: 2, borderLeft: `6px solid ${theme.palette.primary.main}`, borderRadius: 3 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FitnessCenterIcon color="primary" />
                                                <Typography variant="overline" letterSpacing={1} fontWeight="bold" color="text.secondary">WORKOUT</Typography>
                                            </Box>
                                            <Chip label="45m" size="small" sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'black' }} />
                                        </Box>
                                        <Typography variant="h5" fontWeight="bold" gutterBottom>{latestWorkout.title}</Typography>

                                        <List dense disablePadding>
                                            {latestWorkout.exercises.slice(0, 3).map((ex, i) => (
                                                <ListItem key={i} sx={{ pl: 0, py: 0 }}>
                                                    <ListItemIcon sx={{ minWidth: 20 }}>•</ListItemIcon>
                                                    <ListItemText primary={ex} primaryTypographyProps={{ variant: 'body2' }} />
                                                </ListItem>
                                            ))}
                                        </List>
                                        <Button variant="contained" fullWidth sx={{ mt: 2, bgcolor: theme.palette.mode === 'dark' ? 'white' : 'black', color: theme.palette.mode === 'dark' ? 'black' : 'white' }}>Start Session</Button>
                                    </CardContent>
                                </Card>
                            </Fade>
                        )}

                        {latestDiet && (
                            <Fade in={true} timeout={700}>
                                <Card sx={{ mb: 2, borderLeft: `6px solid ${theme.palette.secondary.main}`, borderRadius: 3 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <RestaurantIcon color="secondary" />
                                                <Typography variant="overline" letterSpacing={1} fontWeight="bold" color="text.secondary">NUTRITION</Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="h6" fontWeight="bold">{latestDiet.mainMeal.name}</Typography>
                                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                            <Typography variant="caption" sx={{ bgcolor: isDark ? '#333' : '#eee', px: 1, borderRadius: 1 }}>{latestDiet.mainMeal.calories} kcal</Typography>
                                            <Typography variant="caption" sx={{ bgcolor: isDark ? '#333' : '#eee', px: 1, borderRadius: 1 }}>{latestDiet.mainMeal.protein}g Protein</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Fade>
                        )}

                        {/* Section 4: Motivation */}
                        <Card sx={{ mt: 3, borderRadius: 3, bgcolor: isDark ? 'rgba(255, 196, 0, 0.05)' : '#fff8e1' }}>
                            <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <FormatQuoteIcon sx={{ transform: 'rotate(180deg)', color: 'secondary.main', fontSize: 40, opacity: 0.5 }} />
                                <Box>
                                    <Typography variant="body2" fontStyle="italic" fontWeight="medium">
                                        "The only bad workout is the one that didn't happen."
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Empty State */}
                        {!latestWorkout && !latestDiet && !isTyping && (
                            <Box sx={{ py: 5, textAlign: 'center', opacity: 0.6 }}>
                                <Typography variant="body2" color="text.secondary">Chat to generate your plan.</Typography>
                            </Box>
                        )}

                    </Box>
                </Box>
            </Container>
        </React.Fragment>
    );
};

export default TodayPage;

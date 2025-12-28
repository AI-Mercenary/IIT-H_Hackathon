import React, { useState } from 'react';
import { Box, Typography, Grid, Slider, TextField, Button, Chip, Fade, useTheme } from '@mui/material';
import { useAppData } from '../context/AppDataContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import BoltIcon from '@mui/icons-material/Bolt';
import CoachMessage from '../components/CoachMessage';
import InsightCard from '../components/InsightCard';

const WorkoutPage: React.FC = () => {
    const { generateWorkoutPlan, latestWorkout, isLoading, error } = useAppData();
    const theme = useTheme();

    const [stress, setStress] = useState<number>(50);
    const [energy, setEnergy] = useState<number>(50);
    const [sleep, setSleep] = useState<number>(7);
    const [notes, setNotes] = useState('');

    const handleGenerate = () => {
        generateWorkoutPlan({ stress, energy, slow: sleep });
    };

    return (
        <Grid container spacing={4} sx={{ height: 'calc(100vh - 100px)' }}>
            {/* Left Column: Chat / Coach Interface */}
            <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                    <CoachMessage
                        message="Hey there! I'm ready to build your daily plan. To adapt it perfectly, I just need a quick check-in on your stats today."
                    />

                    {/* Interactive Input "Bubble" Wrapper */}
                    <Box sx={{ ml: 8, mb: 4, p: 3, bgcolor: 'white', borderRadius: 4, boxShadow: theme.shadows[1] }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', mb: 2 }}>
                            HOW ARE YOU FEELING?
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Stress</Typography>
                                <Typography variant="caption" color="primary">{stress > 70 ? 'High' : stress < 30 ? 'Low' : 'Average'}</Typography>
                            </Box>
                            <Slider value={stress} onChange={(_, v) => setStress(v as number)} size="small" />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Energy</Typography>
                                <Typography variant="caption" color="secondary">{energy > 70 ? 'High' : energy < 30 ? 'Low' : 'Average'}</Typography>
                            </Box>
                            <Slider value={energy} onChange={(_, v) => setEnergy(v as number)} color="secondary" size="small" />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Sleep</Typography>
                                <Typography variant="caption">{sleep} hrs</Typography>
                            </Box>
                            <Slider value={sleep} min={0} max={12} step={0.5} onChange={(_, v) => setSleep(v as number)} size="small" />
                        </Box>

                        <TextField
                            placeholder="Any notes? (e.g. sore knee, travel day)"
                            fullWidth
                            variant="standard" // Cleaner look
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleGenerate}
                            disabled={isLoading}
                            sx={{ borderRadius: 20, py: 1.5 }}
                        >
                            {isLoading ? 'Consulting Coach...' : 'Get My Plan'}
                        </Button>
                        {error && <Typography color="error" sx={{ mt: 2, fontSize: '0.875rem' }}>{error}</Typography>}
                    </Box>

                    {/* Result Message Bubble */}
                    {latestWorkout && (
                        <CoachMessage
                            delay={300}
                            message={`Great check-in. ${latestWorkout.coachMessage}`}
                        />
                    )}
                </Box>
            </Grid>

            {/* Right Column: Insight Stack */}
            <Grid item xs={12} md={7} sx={{ bgcolor: 'rgba(255,255,255,0.4)', borderRadius: '32px 0 0 0', p: 4, backdropFilter: 'blur(10px)' }}>
                {latestWorkout ? (
                    <Fade in={true} timeout={800}>
                        <Box>
                            {/* Context Chips */}
                            <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
                                <Chip label={stress > 70 ? "High Stress" : "Balanced Stress"} color={stress > 70 ? "warning" : "default"} size="small" />
                                <Chip label={energy > 70 ? "High Energy" : "Low Energy"} color={energy > 70 ? "secondary" : "default"} size="small" />
                                <Chip label="Daily Plan" color="primary" size="small" variant="outlined" />
                            </Box>

                            {/* 1. Highlight Card: The Plan */}
                            <InsightCard
                                title={latestWorkout.title}
                                icon={<FitnessCenterIcon />}
                                type="highlight"
                                color="primary"
                            >
                                <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">DURATION</Typography>
                                        <Typography variant="h6">{latestWorkout.duration}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">FOCUS</Typography>
                                        <Typography variant="h6">{latestWorkout.focus}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">INTENSITY</Typography>
                                        <Typography variant="h6" color="warning.main">Medium</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>SEQUENCE</Typography>
                                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                                        {latestWorkout.exercises.map((ex, i) => (
                                            <li key={i} style={{ marginBottom: 4 }}><Typography variant="body2">{ex}</Typography></li>
                                        ))}
                                    </ul>
                                </Box>
                            </InsightCard>

                            {/* 2. Reasoning Card */}
                            <InsightCard
                                title="Why this fits today"
                                icon={<LightbulbIcon />}
                                type="reasoning"
                                color="info"
                            >
                                <Typography variant="body2">{latestWorkout.whyThisWorkout}</Typography>
                            </InsightCard>

                            {/* 3. Action / Habit Card */}
                            <InsightCard
                                title="Momentum Builder"
                                icon={<BoltIcon />}
                                type="action"
                                color="secondary"
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ mb: 0.5 }}>You've shown up 5 days in a row—keep this rhythm!</Typography>
                                        <Typography variant="caption" color="text.secondary">Completing this extends your streak to 6.</Typography>
                                    </Box>
                                    <Button variant="outlined" color="success" startIcon={<CheckCircleIcon />}>
                                        Mark Done
                                    </Button>
                                </Box>
                            </InsightCard>
                        </Box>
                    </Fade>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.3 }}>
                        <FitnessCenterIcon sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h6">Your adaptive plan will appear here</Typography>
                    </Box>
                )}
            </Grid>
        </Grid>
    );
};

export default WorkoutPage;

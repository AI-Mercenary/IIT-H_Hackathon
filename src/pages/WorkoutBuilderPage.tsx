import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, Chip, Stepper, Step, StepLabel, LinearProgress, Fade } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import PoolIcon from '@mui/icons-material/Pool';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

// Types
type LocationType = 'gym' | 'home' | null;
type EquipmentType = 'bodyweight' | 'dumbbells' | 'bands' | 'full_gym' | null;

interface GeneratedWorkout {
    title: string;
    description: string;
    exercises: { name: string; sets: string; reps: string }[];
}

const WorkoutBuilderPage: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [location, setLocation] = useState<LocationType>(null);
    const [equipment, setEquipment] = useState<EquipmentType>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<GeneratedWorkout | null>(null);

    const steps = ['Location', 'Equipment', 'Your Plan'];

    const handleLocationSelect = (loc: LocationType) => {
        setLocation(loc);
        setActiveStep(1);
    };

    const handleEquipmentSelect = (eq: EquipmentType) => {
        setEquipment(eq);
        handleGenerate();
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        setActiveStep(2);
        
        // Simulate AI Generation
        setTimeout(() => {
            setIsGenerating(false);
            setResult(generateMockWorkout(location, equipment));
        }, 2000);
    };

    const handleReset = () => {
        setActiveStep(0);
        setLocation(null);
        setEquipment(null);
        setResult(null);
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ 
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    AI Workout Builder
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Design your perfect session in seconds.
                </Typography>
            </Box>

            <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box sx={{ minHeight: 400 }}>
                {/* STEP 1: LOCATION */}
                {activeStep === 0 && (
                    <Fade in timeout={500}>
                        <Grid container spacing={4} justifyContent="center">
                            <Grid item xs={12} md={5}>
                                <SelectionCard
                                    icon={<FitnessCenterIcon sx={{ fontSize: 60 }} />}
                                    title="Gym"
                                    description="I have access to a fitness center."
                                    onClick={() => handleLocationSelect('gym')}
                                />
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <SelectionCard
                                    icon={<HomeIcon sx={{ fontSize: 60 }} />}
                                    title="Home"
                                    description="I'm working out in my living room."
                                    onClick={() => handleLocationSelect('home')}
                                />
                            </Grid>
                        </Grid>
                    </Fade>
                )}

                {/* STEP 2: EQUIPMENT */}
                {activeStep === 1 && (
                    <Fade in timeout={500}>
                        <Grid container spacing={3} justifyContent="center">
                            {location === 'home' ? (
                                <>
                                    <Grid item xs={12} md={4}>
                                        <SelectionCard
                                            icon={<DirectionsRunIcon sx={{ fontSize: 40 }} />}
                                            title="Bodyweight Only"
                                            description="No equipment needed."
                                            onClick={() => handleEquipmentSelect('bodyweight')}
                                            compact
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <SelectionCard
                                            icon={<FitnessCenterIcon sx={{ fontSize: 40 }} />}
                                            title="Dumbbells"
                                            description="I have a pair of weights."
                                            onClick={() => handleEquipmentSelect('dumbbells')}
                                            compact
                                        />
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    <Grid item xs={12} md={5}>
                                        <SelectionCard
                                            icon={<FitnessCenterIcon sx={{ fontSize: 50 }} />}
                                            title="Full Gym"
                                            description="Access to all machines and weights."
                                            onClick={() => handleEquipmentSelect('full_gym')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={5}>
                                        <SelectionCard
                                            icon={<PoolIcon sx={{ fontSize: 50 }} />}
                                            title="Cardio Focus"
                                            description="Treadmills, bikes, and open space."
                                            onClick={() => handleEquipmentSelect('bodyweight')} // Treating as bodyweight/cardio for mock
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Fade>
                )}

                {/* STEP 3: LOADING */}
                {activeStep === 2 && isGenerating && (
                    <Box sx={{ width: '100%', mt: 8, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>Consulting the AI Coach...</Typography>
                        <LinearProgress sx={{ maxWidth: 400, mx: 'auto', borderRadius: 2, height: 10 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            Analysing your preferences and building a balanced routine.
                        </Typography>
                    </Box>
                )}

                {/* STEP 4: RESULT */}
                {activeStep === 2 && !isGenerating && result && (
                    <Fade in timeout={800}>
                        <Box>
                            <Card sx={{ maxWidth: 800, mx: 'auto', borderRadius: 4, boxShadow: 6, overflow: 'visible' }}>
                                <Box sx={{ p: 4, bgcolor: 'primary.main', color: 'white' }}>
                                    <Typography variant="overline" sx={{ opacity: 0.8 }}>YOUR CUSTOM PLAN</Typography>
                                    <Typography variant="h4" fontWeight="bold">{result.title}</Typography>
                                    <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>{result.description}</Typography>
                                </Box>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {result.exercises.map((ex, idx) => (
                                            <Box key={idx} sx={{ 
                                                display: 'flex', 
                                                flexDirection: 'column',
                                                p: 2,
                                                bgcolor: 'background.paper',
                                                borderRadius: 2,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                transition: 'transform 0.2s',
                                                '&:hover': { transform: 'scale(1.01)', borderColor: 'primary.main', boxShadow: 2 }
                                            }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Chip label={idx + 1} color="primary" size="small" />
                                                        <Typography fontWeight={600} color="text.primary">{ex.name}</Typography>
                                                    </Box>
                                                    <Box sx={{ textAlign: 'right' }}>
                                                        <Typography variant="body2" color="text.secondary">{ex.sets} SETS</Typography>
                                                        <Typography variant="body2" fontWeight="bold" color="text.primary">{ex.reps}</Typography>
                                                    </Box>
                                                </Box>
                                                {ex.gifUrl && (
                                                    <Box sx={{ mt: 2, borderRadius: 2, overflow: 'hidden', maxWidth: 200, mx: 'auto' }}>
                                                        <img src={ex.gifUrl} alt={ex.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
                                                    </Box>
                                                )}
                                            </Box>
                                        ))}
                                    </Box>

                                    <Button 
                                        variant="outlined" 
                                        startIcon={<RestartAltIcon />} 
                                        onClick={handleReset}
                                        fullWidth 
                                        sx={{ mt: 4, py: 1.5, borderRadius: 2 }}
                                    >
                                        Build Another Workout
                                    </Button>
                                </CardContent>
                            </Card>
                        </Box>
                    </Fade>
                )}
            </Box>
        </Box>
    );
};

// Helper Components & Mock Data
const SelectionCard: React.FC<{ icon: React.ReactNode, title: string, description: string, onClick: () => void, compact?: boolean }> = ({ icon, title, description, onClick, compact }) => (
    <Card 
        onClick={onClick}
        sx={{ 
            height: '100%', 
            cursor: 'pointer', 
            transition: 'all 0.3s ease',
            border: '2px solid transparent',
            '&:hover': { 
                borderColor: 'primary.main',
                transform: 'translateY(-4px)',
                boxShadow: 8 
            }
        }}
    >
        <CardContent sx={{ textAlign: 'center', py: compact ? 4 : 6 }}>
            <Box sx={{ color: 'primary.main', mb: 2 }}>
                {icon}
            </Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>{title}</Typography>
            <Typography variant="body2" color="text.secondary">{description}</Typography>
        </CardContent>
    </Card>
);

interface GeneratedWorkout {
    title: string;
    description: string;
    exercises: { name: string; sets: string; reps: string; gifUrl?: string }[];
}

const generateMockWorkout = (loc: LocationType, eq: EquipmentType): GeneratedWorkout => {
    if (loc === 'home' && eq === 'bodyweight') {
        return {
            title: 'Home HIIT Blast',
            description: 'A high-energy session requiring zero equipment. Focus on form and speed.',
            exercises: [
                { 
                    name: 'Jumping Jacks', 
                    sets: '3', 
                    reps: '45 sec',
                    gifUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jumpingjacks_wbs.gif' 
                },
                { 
                    name: 'Push-ups', 
                    sets: '3', 
                    reps: '15 reps',
                    gifUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pushups_wbs.gif'
                },
                { 
                    name: 'Air Squats', 
                    sets: '4', 
                    reps: '20 reps',
                    gifUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Squats_wbs.gif' 
                },
                { name: 'Mountain Climbers', sets: '3', reps: '30 sec' },
                { name: 'Plank Hold', sets: '3', reps: '45 sec' },
            ]
        };
    }
    if (loc === 'gym') {
        return {
            title: 'Full Body Power',
            description: 'Classic compound movements to build strength and endurance.',
            exercises: [
                { 
                    name: 'Barbell Squat', 
                    sets: '4', 
                    reps: '8-10 reps',
                    gifUrl: 'https://media.tenor.com/D_i-W9mBbwsAAAAM/squat.gif'
                },
                { name: 'Bench Press', sets: '4', reps: '8-10 reps' },
                { name: 'Lat Pulldowns', sets: '3', reps: '12 reps' },
                { name: 'Dumbbell Lunges', sets: '3', reps: '10/leg' },
                { name: 'Cable Woodchoppers', sets: '3', reps: '15/side' },
            ]
        };
    }
    // Default fallback
    return {
        title: 'Dynamic Dumbbell Flow',
        description: 'Perfect for home or a quiet gym corner. Keep resting periods short.',
        exercises: [
            { name: 'Goblet Squats', sets: '3', reps: '12 reps' },
            { name: 'Dumbbell Rows', sets: '3', reps: '10/side' },
            { name: 'Shoulder Press', sets: '3', reps: '10 reps' },
            { name: 'Romanian Deadlifts', sets: '3', reps: '12 reps' },
            { name: 'Russian Twists', sets: '3', reps: '20 reps' },
        ]
    };
};

export default WorkoutBuilderPage;

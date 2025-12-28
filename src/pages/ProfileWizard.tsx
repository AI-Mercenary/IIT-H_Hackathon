import React, { useState } from 'react';
import {
    Box, Typography, Stepper, Step, StepLabel, Button, Grid,
    Card, CardContent, TextField,
    Select, MenuItem, Slider, ToggleButton, ToggleButtonGroup, Chip,
    Avatar, useTheme, FormControl, InputLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import PersonIcon from '@mui/icons-material/Person';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SettingsIcon from '@mui/icons-material/Settings';
import CoachMessage from '../components/CoachMessage';

const steps = ['About You', 'Your Goal', 'Preferences'];

const ProfileWizard: React.FC = () => {
    const { profile, updateSection, completeWizard } = useProfile();
    const navigate = useNavigate();
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);

    // Local state for current step inputs
    const [basicInfo, setBasicInfo] = useState(profile.basicInfo);
    const [fitness, setFitness] = useState(profile.fitnessProfile);
    const [nutrition, setNutrition] = useState(profile.nutritionPreferences);

    // New state for "Preferences" step which combines some previous health/nutrition logic + new specific fields
    const [schedule, setSchedule] = useState({
        workoutTime: 'Morning',
        daysPerWeek: 5
    });

    const handleNext = () => {
        if (activeStep === 0) updateSection('basicInfo', basicInfo);
        if (activeStep === 1) updateSection('fitnessProfile', fitness);
        if (activeStep === 2) {
            updateSection('nutritionPreferences', nutrition);
            // In a real app we'd save schedule too, for now we just conceptually have it
            updateSection('fitnessProfile', { ...fitness, weeklyWorkoutDays: schedule.daysPerWeek });
            completeWizard();
            navigate('/today'); // Redirect to Today page as per new flow
            return;
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0: // About You
                return (
                    <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: 40, color: 'black' }}>
                                    {/* Mock Avatar Picker */}
                                    U
                                </Avatar>
                                <Typography variant="caption" sx={{ position: 'absolute', bottom: -25, width: '100%', textAlign: 'center', color: 'primary.main', cursor: 'pointer' }}>Change</Typography>
                            </Box>
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Full Name"
                                    fullWidth
                                    placeholder="Enter your name"
                                // In a real app, bind this to user context name, here using basicInfo just as placeholder logic
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Age"
                                    type="number"
                                    fullWidth
                                    value={basicInfo.age}
                                    onChange={e => setBasicInfo({ ...basicInfo, age: Number(e.target.value) })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        value={basicInfo.gender}
                                        label="Gender"
                                        onChange={e => setBasicInfo({ ...basicInfo, gender: e.target.value })}
                                    >
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                        <MenuItem value="Non-binary">Non-binary</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                );
            case 1: // Your Goal
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>What's your main focus?</Typography>
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            {[
                                { val: 'lose_weight', label: 'Weight Loss', icon: '🏃' },
                                { val: 'gain_muscle', label: 'Build Muscle', icon: '💪' },
                                { val: 'endurance', label: 'Endurance', icon: '⚡' },
                                { val: 'flexibility', label: 'Flexibility', icon: '🧘' }
                            ].map((goal) => (
                                <Grid item xs={6} key={goal.val}>
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            border: fitness.primaryGoal === goal.val ? `2px solid ${theme.palette.primary.main}` : '1px solid #ccc',
                                            bgcolor: fitness.primaryGoal === goal.val ? 'rgba(255, 196, 0, 0.1)' : 'background.paper'
                                        }}
                                        onClick={() => setFitness({ ...fitness, primaryGoal: goal.val as any })}
                                    >
                                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                            <Typography variant="h2" sx={{ mb: 1 }}>{goal.icon}</Typography>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {goal.label}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Typography variant="h6" gutterBottom>Experience Level</Typography>
                        <ToggleButtonGroup
                            color="primary"
                            value={fitness.experienceLevel}
                            exclusive
                            fullWidth
                            onChange={(_, v) => v && setFitness({ ...fitness, experienceLevel: v })}
                        >
                            <ToggleButton value="beginner">Beginner</ToggleButton>
                            <ToggleButton value="intermediate">Intermediate</ToggleButton>
                            <ToggleButton value="advanced">Advanced</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                );
            case 2: // Preferences
                return (
                    <Box sx={{ mt: 2 }}>
                        {/* Diet Section */}
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">Dietary Preference 🟢</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
                            {['Omnivore', 'Vegetarian', 'Vegan', 'Keto', 'Paleo'].map(diet => (
                                <Chip
                                    key={diet}
                                    label={diet}
                                    color={nutrition.dietaryRestrictions.includes(diet) ? "success" : "default"}
                                    variant={nutrition.dietaryRestrictions.includes(diet) ? "filled" : "outlined"}
                                    onClick={() => {
                                        // Simple toggle logic for demo - assuming single select for "Type" but keeping array structure
                                        const newDiets = [diet];
                                        setNutrition({ ...nutrition, dietaryRestrictions: newDiets });
                                    }}
                                />
                            ))}
                        </Box>

                        {/* Schedule Section */}
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">Preferred Workout Time 🌙</Typography>
                        <ToggleButtonGroup
                            color="primary"
                            value={schedule.workoutTime}
                            exclusive
                            fullWidth
                            sx={{ mb: 4 }}
                            onChange={(_, v) => v && setSchedule({ ...schedule, workoutTime: v })}
                        >
                            <ToggleButton value="Morning">Morning</ToggleButton>
                            <ToggleButton value="Afternoon">Afternoon</ToggleButton>
                            <ToggleButton value="Evening">Evening</ToggleButton>
                        </ToggleButtonGroup>

                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">Days Per Week 5️⃣</Typography>
                        <Slider
                            value={schedule.daysPerWeek}
                            min={1} max={7} marks step={1}
                            valueLabelDisplay="auto"
                            onChange={(_, v) => setSchedule({ ...schedule, daysPerWeek: v as number })}
                            sx={{ color: 'primary.main' }}
                        />
                        <Typography align="center" variant="h6">{schedule.daysPerWeek} Days</Typography>
                    </Box>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 4, pt: 8 }}>
            <CoachMessage message="Let's calibrate your AI coach. This takes about 30 seconds." />

            <Card sx={{ p: 4, borderRadius: 4, mt: 4 }}>
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel icon={
                                index === 0 ? <PersonIcon sx={{ color: activeStep >= index ? 'primary.main' : 'text.disabled' }} /> :
                                    index === 1 ? <FitnessCenterIcon sx={{ color: activeStep >= index ? 'primary.main' : 'text.disabled' }} /> :
                                        <SettingsIcon sx={{ color: activeStep >= index ? 'primary.main' : 'text.disabled' }} />
                            }>
                                {label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box sx={{ minHeight: 300 }}>
                    <FadeInWrapper key={activeStep}>
                        {renderStepContent(activeStep)}
                    </FadeInWrapper>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 6, gap: 2 }}>
                    <Button disabled={activeStep === 0} onClick={handleBack} size="large" sx={{ px: 4 }}>
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        size="large"
                        sx={{
                            px: 5,
                            borderRadius: 8,
                            fontWeight: 'bold',
                            color: 'black'
                        }}
                    >
                        {activeStep === steps.length - 1 ? 'Start Journey' : 'Next'}
                    </Button>
                </Box>
            </Card>
        </Box>
    );
};

// Simple animation wrapper
const FadeInWrapper = ({ children }: { children: React.ReactNode }) => {
    const [mount, setMount] = useState(false);
    React.useEffect(() => { setMount(true); return () => setMount(false); }, []);
    return <Box sx={{ opacity: mount ? 1 : 0, transition: 'opacity 0.4s ease-in-out' }}>{children}</Box>;
};

export default ProfileWizard;

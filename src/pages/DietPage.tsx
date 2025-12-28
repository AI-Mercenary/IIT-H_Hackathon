import React, { useMemo, useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, Chip, Divider, useTheme, Card, CardContent, List, ListItem, ListItemText, ListItemIcon, Slider, Stack, IconButton, Snackbar, Alert } from '@mui/material';
import { useProfile } from '../context/ProfileContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EggAltIcon from '@mui/icons-material/EggAlt';
import GrassIcon from '@mui/icons-material/Grass';
import OpacityIcon from '@mui/icons-material/Opacity';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import { alpha } from '@mui/material/styles';

// --- Types ---
type MacroKey = 'p' | 'c' | 'f';

// --- Logic ---

const getMealSuggestions = (currentDietType: string, mealType: string, macroProfile: { p: number, c: number, f: number }) => {
    // Dynamic Override based on Macros
    let effectiveDietType = currentDietType;

    if (macroProfile.f > 50 && currentDietType !== 'keto') effectiveDietType = 'keto';
    if (macroProfile.c > 50 && currentDietType !== 'high_protein') effectiveDietType = 'high_carb'; // 'balanced' usually
    if (macroProfile.p > 40) effectiveDietType = 'high_protein';

    const suggestions: Record<string, Record<string, string>> = {
        keto: {
            Breakfast: 'Avocado & Bacon Omelet',
            Lunch: 'Grilled Salmon with Asparagus',
            Dinner: 'Ribeye Steak with Buttered Broccoli',
            Snack: 'Macadamia Nuts & Cheese'
        },
        vegan: {
            Breakfast: 'Overnight Oats with Chia Seeds',
            Lunch: 'Quinoa Bowl with Roasted Chickpeas',
            Dinner: 'Lentil Curry with Spinach',
            Snack: 'Apple Slices with Almond Butter'
        },
        balanced: {
            Breakfast: 'Greek Yogurt with Berries & Granola',
            Lunch: 'Chicken Wrap with Mixed Greens',
            Dinner: 'Turkey Meatballs with Whole Wheat Pasta',
            Snack: 'Protein Shake & Banana'
        },
        low_carb: {
            Breakfast: 'Scrambled Eggs with Spinach',
            Lunch: 'Tuna Salad Lettuce Wraps',
            Dinner: 'Zucchini Noodles with Pesto Chicken',
            Snack: 'Hard Boiled Eggs'
        },
        high_protein: {
            Breakfast: 'Egg White Frittata with Turkey',
            Lunch: 'Grilled Chicken Breast with Quinoa',
            Dinner: 'Lean Beef Stir-Fry',
            Snack: 'Cottage Cheese & Pineapple'
        },
        high_carb: { // e.g. for endurance
            Breakfast: 'Oatmeal with Banana & Honey',
            Lunch: 'Pasta Primavera',
            Dinner: 'Baked Potato with Beans',
            Snack: 'Energy Bar & Fruit'
        }
    };

    // Fallback to balanced if specific key missing
    const diet = suggestions[effectiveDietType] || suggestions['balanced'];
    return diet[mealType] || 'Healthy Choice';
};

const DietPage: React.FC = () => {
    const { profile, updateSection } = useProfile();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const { dietType, calorieTarget, mealsPerDay, proteinPreference } = profile.nutritionPreferences;

    // Local State for "Simulation" Effect
    const [isSimulating, setIsSimulating] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Initial Ratios - mapped from dietType or default
    // We store these in local state if we want real-time sliding, then commit to context on change end? 
    // For simplicity, we'll update context directly on 'commit' of slider to avoid too many re-renders/context updates
    const [localCalories, setLocalCalories] = useState(calorieTarget);

    // Helper to get initial ratios if not stored in profile (profile only has dietType enum currently)
    // We'll calculate them on mount or use a local state. 
    // Ideally ProfileContext should store custom Macro splits. For MVP, we'll improvise local state
    // that effectively becomes "Custom" mode.
    const [ratios, setRatios] = useState({ p: 30, c: 40, f: 30 }); // Default balanced

    // Sync local calorie state with global when global changes (e.g. initial load)
    useEffect(() => {
        setLocalCalories(calorieTarget);
    }, [calorieTarget]);

    // Update ratios based on diet type initially
    useEffect(() => {
        const getMacroRatios = (dt: string) => {
            switch (dt) {
                case 'keto': return { p: 25, c: 5, f: 70 };
                case 'low_carb': return { p: 40, c: 20, f: 40 };
                case 'paleo': return { p: 35, c: 30, f: 35 };
                case 'high_protein': return { p: 45, c: 35, f: 20 };
                default: return { p: 30, c: 40, f: 30 };
            }
        };
        setRatios(getMacroRatios(dietType));
    }, [dietType]);

    // Handle Calorie Change
    const handleCalorieChange = (event: Event, newValue: number | number[]) => {
        const val = newValue as number;
        setLocalCalories(val);
        // Debounce update to context? Or just commit on release (onChangeCommitted)
    };
    const handleCalorieCommit = (event: Event | React.SyntheticEvent, newValue: number | number[]) => {
        updateSection('nutritionPreferences', { calorieTarget: newValue as number });
        triggerSimulation();
    };

    // Handle Macro Change
    const handleMacroChange = (key: MacroKey) => (event: Event, newValue: number | number[]) => {
        const val = newValue as number;
        setRatios(prev => {
            const diff = val - prev[key];
            const otherKeys = (['p', 'c', 'f'] as MacroKey[]).filter(k => k !== key);

            // Simple logic: subtract diff/2 from other two to maintain ~100
            // This is basic for MVP. A proper 3-way slider is complex.
            const newRatios = { ...prev, [key]: val };
            const remainder = 100 - val;

            // Distribute remainder proportionally between others? 
            // Or just subtract equally from others? 
            // Let's keep it simple: just update this one, and show warning if != 100?
            // Actually, best UX is: lock this one, scale others.

            // MVP: Just set value. If sum != 100, show warning in UI.
            return newRatios;
        });
    };

    // Manual Logic to re-balance to 100 (Normalization button?)
    const normalizeRatios = () => {
        const sum = ratios.p + ratios.c + ratios.f;
        if (sum === 0) return;
        setRatios({
            p: Math.round((ratios.p / sum) * 100),
            c: Math.round((ratios.c / sum) * 100),
            f: Math.round((ratios.f / sum) * 100)
        });
        triggerSimulation();
    };


    const triggerSimulation = () => {
        setIsSimulating(true);
        setOpenSnackbar(true);
        setTimeout(() => setIsSimulating(false), 1000); // 1s fake loading
    };

    const totalRatio = ratios.p + ratios.c + ratios.f;

    // Derived grams
    const macros = useMemo(() => {
        return {
            protein: Math.round((localCalories * (ratios.p / 100)) / 4),
            carbs: Math.round((localCalories * (ratios.c / 100)) / 4),
            fats: Math.round((localCalories * (ratios.f / 100)) / 9),
        };
    }, [localCalories, ratios]);

    const chartData = [
        { name: 'Protein', value: macros.protein, color: theme.palette.primary.main },
        { name: 'Carbs', value: macros.carbs, color: isDark ? '#444' : '#e0e0e0' },
        { name: 'Fats', value: macros.fats, color: '#FFD700' }
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
            {/* Header */}
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Adaptive Nutrition
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        AI-driven simulation based on your <Box component="span" color="primary.main" fontWeight="bold">Metabolic Profile</Box>.
                    </Typography>
                </Box>
                <IconButton onClick={() => setOpenSnackbar(true)}>
                    <RefreshIcon />
                </IconButton>
            </Box>

            <Grid container spacing={4}>

                {/* 1. Control Panel (Left) */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{
                        p: 4,
                        height: '100%',
                        borderRadius: 4,
                        background: isDark ? 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)' : '#fff',
                        border: '1px solid', borderColor: 'divider'
                    }}>
                        {/* Calorie Slider */}
                        <Box mb={4}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom display="flex" alignItems="center" gap={1}>
                                <LocalFireDepartmentIcon fontSize="small" color="error" /> CALORIC TARGET
                            </Typography>
                            <Box display="flex" alignItems="end" gap={1} mb={1}>
                                <Typography variant="h3" fontWeight="bold" color="primary">{localCalories}</Typography>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>kcal</Typography>
                            </Box>
                            <Slider
                                value={localCalories}
                                min={1200}
                                max={4000}
                                step={50}
                                onChange={handleCalorieChange}
                                onChangeCommitted={handleCalorieCommit}
                                valueLabelDisplay="auto"
                                sx={{ color: 'primary.main' }}
                            />
                        </Box>

                        <Divider sx={{ mb: 4 }} />

                        {/* Macro Sliders */}
                        <Box mb={2}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle2" color="text.secondary" display="flex" alignItems="center" gap={1}>
                                    <SettingsIcon fontSize="small" /> MACRO SPLIT
                                </Typography>
                                {totalRatio !== 100 && (
                                    <Chip
                                        label={`Total: ${totalRatio}%`}
                                        color="warning"
                                        size="small"
                                        variant="outlined"
                                        onClick={normalizeRatios}
                                        icon={<RefreshIcon />}
                                    />
                                )}
                            </Box>

                            {/* Protein */}
                            <Box mb={2}>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" fontWeight="bold">Protein</Typography>
                                    <Typography variant="body2">{ratios.p}%</Typography>
                                </Box>
                                <Slider
                                    value={ratios.p}
                                    onChange={handleMacroChange('p')}
                                    onChangeCommitted={triggerSimulation}
                                    sx={{ color: theme.palette.primary.main }}
                                />
                            </Box>

                            {/* Carbs */}
                            <Box mb={2}>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" fontWeight="bold">Carbs</Typography>
                                    <Typography variant="body2">{ratios.c}%</Typography>
                                </Box>
                                <Slider
                                    value={ratios.c}
                                    onChange={handleMacroChange('c')}
                                    onChangeCommitted={triggerSimulation}
                                    sx={{ color: isDark ? '#888' : '#aaa' }}
                                />
                            </Box>

                            {/* Fats */}
                            <Box>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" fontWeight="bold">Fats</Typography>
                                    <Typography variant="body2">{ratios.f}%</Typography>
                                </Box>
                                <Slider
                                    value={ratios.f}
                                    onChange={handleMacroChange('f')}
                                    onChangeCommitted={triggerSimulation}
                                    sx={{ color: '#FFD700' }}
                                />
                            </Box>
                        </Box>

                        {/* Chart Visualization */}
                        <Box sx={{ height: 200, position: 'relative', mt: 4 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <Typography variant="h6" fontWeight="bold">{macros.protein}g</Typography>
                                <Typography variant="caption" color="text.secondary">Protein</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* 2. Recommendations (Right) - Reactive */}
                <Grid item xs={12} md={7}>
                    <Box sx={{ position: 'relative', opacity: isSimulating ? 0.5 : 1, transition: 'opacity 0.2s' }}>

                        {/* Dynamic Title */}
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Generated Protocol
                        </Typography>

                        {/* Suggestion Card */}
                        <Card sx={{ mb: 4, borderRadius: 4, border: 'none', boxShadow: theme.shadows[2] }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" fontWeight="bold">Daily Menu</Typography>
                                    <Chip label={`${mealsPerDay} Meals`} size="small" variant="outlined" />
                                </Box>

                                <List>
                                    {['Breakfast', 'Lunch', 'Snack', 'Dinner'].slice(0, mealsPerDay).map((meal, index) => {
                                        let actualMeal = meal;
                                        if (mealsPerDay === 3 && meal === 'Snack') actualMeal = 'Dinner';
                                        if (mealsPerDay === 3 && index === 2) actualMeal = 'Dinner';

                                        return (
                                            <React.Fragment key={actualMeal}>
                                                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                                    <ListItemIcon sx={{ minWidth: 40, mt: 1 }}>
                                                        <AccessTimeIcon color="action" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                {actualMeal}
                                                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'normal' }}>
                                                                    ~ {Math.round(localCalories / mealsPerDay)} kcal
                                                                </Typography>
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                                Try: {getMealSuggestions(dietType, actualMeal, ratios)}
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItem>
                                                {index < mealsPerDay - 1 && <Divider component="li" variant="inset" />}
                                            </React.Fragment>
                                        );
                                    })}
                                </List>
                            </CardContent>
                        </Card>

                        {/* Insights */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TipsAndUpdatesIcon color="primary" />
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Agent Insight</Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Adjusting to <strong>{localCalories} kcal</strong> with a {ratios.p}% protein split creates a deficit optimal for {profile.fitnessProfile.primaryGoal.replace('_', ' ')}.
                                    </Typography>
                                    {ratios.c > 50 && <Typography variant="body2" color="warning.main" fontWeight="bold">Note: High carb output detected. Ensure intense activity days to utilize glycogen.</Typography>}
                                    {ratios.f > 50 && <Typography variant="body2" color="warning.main" fontWeight="bold">Note: High fat detected. Suggesting Keto-friendly fats.</Typography>}
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>

            {/* Simulation Toast */}
            <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="success" variant="filled" sx={{ width: '100%', bgcolor: 'black', color: 'white' }}>
                    Agent: Re-optimizing nutrition plan... DONE.
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default DietPage;

import React, { useState } from 'react';
import { Box, Typography, Grid, Slider, Button, FormControl, InputLabel, Select, MenuItem, Chip, Fade, useTheme } from '@mui/material';
import { useAppData } from '../context/AppDataContext';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import CoachMessage from '../components/CoachMessage';
import InsightCard from '../components/InsightCard';

const DietPage: React.FC = () => {
    const { generateMealPlan, latestDiet, isLoading } = useAppData();
    const theme = useTheme();

    const [goal, setGoal] = useState<string>('maintenance');
    const [hunger, setHunger] = useState<number>(50);
    const [time, setTime] = useState<number>(30);

    const handleGenerate = () => {
        generateMealPlan({ goal, hunger, time });
    };

    return (
        <Grid container spacing={4} sx={{ height: 'calc(100vh - 100px)' }}>
            {/* Left Column: Chat / Coach Interface */}
            <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <CoachMessage
                        message="Fueling right is 80% of the work. Let's find a meal that matches your goal and timeline right now."
                    />

                    {/* Interactive Input Bubble */}
                    <Box sx={{ ml: 8, mb: 4, p: 3, bgcolor: 'white', borderRadius: 4, boxShadow: theme.shadows[1] }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', mb: 2 }}>
                            CONTEXT
                        </Typography>

                        <FormControl fullWidth sx={{ mb: 3 }} variant="standard">
                            <InputLabel>Current Goal</InputLabel>
                            <Select
                                value={goal}
                                label="Current Goal"
                                onChange={(e) => setGoal(e.target.value)}
                            >
                                <MenuItem value="weight_loss">Weight Loss</MenuItem>
                                <MenuItem value="muscle_gain">Muscle Gain</MenuItem>
                                <MenuItem value="maintenance">Maintenance</MenuItem>
                            </Select>
                        </FormControl>

                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Hunger Level</Typography>
                                <Typography variant="caption" color="secondary">{hunger > 70 ? 'Starving' : hunger < 30 ? 'Peckish' : 'Moderate'}</Typography>
                            </Box>
                            <Slider value={hunger} min={0} max={100} onChange={(_, v) => setHunger(v as number)} color="secondary" size="small" />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Time Available</Typography>
                                <Typography variant="caption">{time} mins</Typography>
                            </Box>
                            <Slider value={time} min={5} max={120} step={5} onChange={(_, v) => setTime(v as number)} color="primary" size="small" />
                        </Box>

                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            size="large"
                            onClick={handleGenerate}
                            startIcon={!isLoading && <RestaurantMenuIcon />}
                            disabled={isLoading}
                            sx={{ borderRadius: 20, py: 1.5, color: 'white' }}
                        >
                            {isLoading ? 'Chefing up...' : 'Suggest Meal'}
                        </Button>
                    </Box>

                    {/* Result Message Bubble */}
                    {latestDiet && (
                        <CoachMessage
                            delay={300}
                            message={`I've found a great option. It fits your ${goal.replace('_', ' ')} goal and is ready in under ${time} minutes.`}
                        />
                    )}
                </Box>
            </Grid>

            {/* Right Column: Insight Stack */}
            <Grid item xs={12} md={7} sx={{ bgcolor: 'rgba(255,255,255,0.4)', borderRadius: '32px 0 0 0', p: 4, backdropFilter: 'blur(10px)' }}>
                {latestDiet ? (
                    <Fade in={true} timeout={800}>
                        <Box>
                            {/* Context Chips */}
                            <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
                                <Chip label={goal.replace('_', ' ').toUpperCase()} color="success" size="small" />
                                <Chip label={`< ${time} MINS`} variant="outlined" size="small" />
                            </Box>

                            {/* 1. Highlight Card: Main Meal */}
                            <InsightCard
                                title={latestDiet.mainMeal.name}
                                icon={<LocalDiningIcon />}
                                type="highlight"
                                color="secondary"
                            >
                                <Grid container spacing={2} sx={{ mb: 3, textAlign: 'center' }}>
                                    <Grid item xs={3}><Typography variant="h5" fontWeight="bold">{latestDiet.mainMeal.calories}</Typography><Typography variant="caption" color="text.secondary">KCAL</Typography></Grid>
                                    <Grid item xs={3}><Typography variant="h5" fontWeight="bold">{latestDiet.mainMeal.protein}g</Typography><Typography variant="caption" color="text.secondary">PROTEIN</Typography></Grid>
                                    <Grid item xs={3}><Typography variant="h5" fontWeight="bold">{latestDiet.mainMeal.carbs}g</Typography><Typography variant="caption" color="text.secondary">CARBS</Typography></Grid>
                                    <Grid item xs={3}><Typography variant="h5" fontWeight="bold">{latestDiet.mainMeal.fats}g</Typography><Typography variant="caption" color="text.secondary">FATS</Typography></Grid>
                                </Grid>

                                <Typography variant="subtitle2" gutterBottom>INGREDIENTS</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {latestDiet.mainMeal.ingredients.map((ing, i) => (
                                        <Chip key={i} label={ing} />
                                    ))}
                                </Box>
                            </InsightCard>

                            {/* 2. Reasoning / Alternatives */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <InsightCard title="Quick Swaps" icon={<InfoIcon />} type="reasoning" color="info">
                                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                                            {latestDiet.alternatives.map((alt, i) => (
                                                <li key={i}><Typography variant="body2">{alt}</Typography></li>
                                            ))}
                                        </ul>
                                    </InsightCard>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <InsightCard title="Shopping List" icon={<ShoppingCartIcon />} type="reasoning" color="success">
                                        <Typography variant="body2" color="text.secondary">
                                            {latestDiet.shoppingList.length} items needed.
                                        </Typography>
                                    </InsightCard>
                                </Grid>
                            </Grid>

                            {/* 3. Action */}
                            <InsightCard title="Meal Tracker" type="action" color="secondary">
                                <Button fullWidth variant="outlined" color="secondary">Add to Daily Log</Button>
                            </InsightCard>
                        </Box>
                    </Fade>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.3 }}>
                        <RestaurantMenuIcon sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h6">Nutrition insights appear here</Typography>
                    </Box>
                )}
            </Grid>
        </Grid>
    );
};

export default DietPage;

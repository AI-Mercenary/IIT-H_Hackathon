import React, { useState, useMemo } from 'react';
import { Box, Typography, Grid, Paper, Avatar, Chip, IconButton, useTheme, Card, CardContent, Container, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, Slider, Checkbox, ListItemText, OutlinedInput, LinearProgress, Switch, FormControlLabel, Fade, Tooltip, Divider } from '@mui/material';
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BadgeIcon from '@mui/icons-material/Badge';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const ProfileDashboard: React.FC = () => {
    const { profile, updateSection } = useProfile();
    const { user, updateUser } = useAuth();
    const theme = useTheme();

    const [editSection, setEditSection] = useState<'basic' | 'fitness' | 'health' | 'nutrition' | null>(null);
    const [editData, setEditData] = useState<any>({});

    // --- Completeness Logic ---
    const completeness = useMemo(() => {
        let score = 0;
        // Required (40pts)
        if (user?.name) score += 8;
        if (profile.basicInfo.age) score += 8;
        if (profile.fitnessProfile.primaryGoal) score += 8;
        if (profile.fitnessProfile.experienceLevel) score += 8;
        if (profile.nutritionPreferences.dietType) score += 8; // Assuming dietType is proxy for diet
        // Optional (42pts max for 82% target)
        if (profile.basicInfo.gender !== 'Not specified') score += 5;
        if (profile.basicInfo.height) score += 5;
        if (profile.basicInfo.weight) score += 5;
        if (profile.fitnessProfile.targetWeight) score += 5;
        if (profile.schedulePreferences.preferredTime) score += 8;
        if (profile.equipment.dumbbell || profile.equipment.barbell) score += 7; // Example specific check
        if (profile.healthConstraints.injuries.length === 0) score += 7; // Bonus for no injuries or detailed fill

        return Math.min(score, 100); // Cap at 100, though target logic is specific
    }, [profile, user]);

    const handleEdit = (section: 'basic' | 'fitness' | 'health' | 'nutrition') => {
        setEditSection(section);
        if (section === 'basic') setEditData({ ...profile.basicInfo, name: user?.name, email: user?.email });
        if (section === 'fitness') setEditData({ ...profile.fitnessProfile, equipment: { ...profile.equipment } }); // Merge equipment for edit form
        if (section === 'health') setEditData({ ...profile.healthConstraints });
        if (section === 'nutrition') setEditData({ ...profile.nutritionPreferences, ...profile.schedulePreferences }); // Merge schedule
    };

    const handleClose = () => {
        setEditSection(null);
        setEditData({});
    };

    const handleSave = () => {
        if (editSection === 'basic') {
            const { name, email, ...basicInfo } = editData;
            updateSection('basicInfo', basicInfo);
            updateUser({ name, email });
        }
        if (editSection === 'fitness') {
            const { equipment, ...fitness } = editData;
            updateSection('fitnessProfile', fitness);
            updateSection('equipment', equipment);
        }
        if (editSection === 'health') updateSection('healthConstraints', editData);
        if (editSection === 'nutrition') {
            const { preferredTime, restDays, ...nutrition } = editData;
            updateSection('nutritionPreferences', nutrition);
            updateSection('schedulePreferences', { preferredTime, restDays });
        }
        handleClose();
    };

    const handleChange = (field: string, value: any, nestedField?: string) => {
        setEditData((prev: any) => {
            if (nestedField) {
                return { ...prev, [nestedField]: { ...prev[nestedField], [field]: value } };
            }
            return { ...prev, [field]: value };
        });
    };

    const SectionHeader = ({ icon, title, completion }: { icon: React.ReactNode, title: string, completion: boolean }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            {icon}
            <Typography variant="h6" fontWeight="bold">{title}</Typography>
            {completion && <CheckCircleIcon color="success" fontSize="small" />}
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ pb: 10 }}>
                {/* Hero Section */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 6, mb: 5, borderRadius: 6,
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.mode === 'dark' ? '#111' : '#eee'} 100%)`,
                        border: '1px solid', borderColor: 'divider',
                        display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 6,
                        position: 'relative', overflow: 'hidden'
                    }}
                >
                    {/* Hero Background Decoration */}
                    <Box sx={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, background: theme.palette.primary.main, opacity: 0.1, borderRadius: '50%', filter: 'blur(80px)' }} />

                    <Box sx={{ position: 'relative' }}>
                        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={profile.basicInfo.avatarUrl || undefined}
                                    sx={{
                                        width: 140, height: 140,
                                        bgcolor: 'primary.main', color: 'primary.contrastText', fontSize: 56, fontWeight: 'bold',
                                        boxShadow: `0 8px 40px ${theme.palette.primary.main}60`,
                                        border: `4px solid ${theme.palette.background.paper}`,
                                        // Ensure image covers well
                                        '& img': { objectFit: 'cover' }
                                    }}
                                >
                                    {user?.name?.charAt(0) || 'U'}
                                </Avatar>
                                {/* Upload Overlay */}
                                <Box
                                    component="label"
                                    sx={{
                                        position: 'absolute', bottom: 0, left: '50%',
                                        transform: 'translate(-50%, 50%)',
                                        bgcolor: 'background.paper', borderRadius: '50%',
                                        width: 40, height: 40,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: 4,
                                        border: '1px solid', borderColor: 'divider',
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: 'grey.100', transform: 'translate(-50%, 50%) scale(1.1)' },
                                        zIndex: 10
                                    }}
                                >
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    updateSection('basicInfo', { avatarUrl: reader.result as string });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <CameraAltIcon color="primary" sx={{ fontSize: 18 }} />
                                </Box>
                            </Box>

                            {/* Completeness Ring */}
                            <Box sx={{
                                top: -8, left: -8, bottom: -8, right: -8, // Expand 8px on all sides to center the 156px ring over 140px avatar
                                position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
                            }}>
                                <svg width="156" height="156" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx="78" cy="78" r="74" fill="none" stroke={theme.palette.divider} strokeWidth="4" />
                                    <circle cx="78" cy="78" r="74" fill="none" stroke={theme.palette.success.main} strokeWidth="4"
                                        strokeDasharray={`${(completeness / 100) * 465} 465`} strokeLinecap="round" />
                                </svg>
                            </Box>
                        </Box>
                    </Box>

                    <Box textAlign={{ xs: 'center', md: 'left' }} sx={{ flexGrow: 1, zIndex: 1 }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            {user?.name || 'Athlete'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600 }}>
                            {completeness >= 80
                                ? "4/5 sections active → Optimized plans generated. Your context allows our Agents to deliver 23% more accurate recommendations."
                                : "Complete your profile to unlock optimized plans."}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            <Chip icon={<FitnessCenterIcon sx={{ fontSize: '1rem !important' }} />} label={profile.fitnessProfile.primaryGoal.replace('_', ' ')} color="primary" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }} />
                            <Chip label={profile.fitnessProfile.experienceLevel} variant="outlined" sx={{ textTransform: 'capitalize', bgcolor: 'background.paper' }} />
                            <Chip label={`${completeness}% Complete`} color={completeness > 80 ? "success" : "warning"} variant="filled" />
                        </Box>
                    </Box>
                </Paper>

                <Grid container spacing={4}>
                    {/* 1. Basic Identity */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ height: '100%', position: 'relative', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: theme.shadows[4] } }}>
                            <IconButton
                                onClick={() => handleEdit('basic')}
                                sx={{
                                    position: 'absolute', top: 16, right: 16,
                                    bgcolor: 'background.paper',
                                    boxShadow: 1,
                                    '&:hover': { bgcolor: 'background.default' },
                                    zIndex: 2
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <CardContent sx={{ p: 4 }}>
                                <SectionHeader icon={<BadgeIcon color="primary" fontSize="large" />} title="Basic Identity" completion={!!profile.basicInfo.age} />
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant="caption" color="text.secondary">CONTACT</Typography>
                                        <Typography variant="h6">{user?.name} <Typography component="span" variant="body2" color="text.secondary">({user?.email})</Typography></Typography>
                                        <Typography variant="body2">{profile.basicInfo.phoneNumber || 'No phone number'}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary">AGE</Typography>
                                        <Typography variant="h6">{profile.basicInfo.age} years</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary">GENDER</Typography>
                                        <Typography variant="h6">{profile.basicInfo.gender}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary">HEIGHT</Typography>
                                        <Typography variant="h6">{profile.basicInfo.height} cm</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary">WEIGHT</Typography>
                                        <Typography variant="h6">{profile.basicInfo.weight} kg</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* 2. Fitness Goals & Equipment */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ height: '100%', position: 'relative', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: theme.shadows[4] } }}>
                            <IconButton
                                onClick={() => handleEdit('fitness')}
                                sx={{
                                    position: 'absolute', top: 16, right: 16,
                                    bgcolor: 'background.paper',
                                    boxShadow: 1,
                                    '&:hover': { bgcolor: 'background.default' },
                                    zIndex: 2
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <CardContent sx={{ p: 4 }}>
                                <SectionHeader icon={<FitnessCenterIcon color="secondary" fontSize="large" />} title="Fitness & Equipment" completion={!!profile.fitnessProfile.primaryGoal} />
                                <Grid container spacing={3} sx={{ mb: 3 }}>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary">TARGET WEIGHT</Typography>
                                        <Typography variant="h6">{profile.fitnessProfile.targetWeight} kg</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary">SESSIONS</Typography>
                                        <Typography variant="h6">{profile.fitnessProfile.weeklyWorkoutDays}/wk ({profile.fitnessProfile.sessionDuration} min)</Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ my: 2 }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>EQUIPMENT AVAILABLE</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {Object.entries(profile.equipment).filter(([_, v]) => v).map(([k]) => (
                                            <Chip key={k} label={k.replace(/([A-Z])/g, ' $1').trim()} size="small" variant="outlined" sx={{ textTransform: 'capitalize' }} />
                                        ))}
                                        {Object.values(profile.equipment).every(v => !v) && <Typography variant="body2" color="text.secondary">None specified</Typography>}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* 3. Health Constraints */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ height: '100%', position: 'relative', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: theme.shadows[4] } }}>
                            <IconButton
                                onClick={() => handleEdit('health')}
                                sx={{
                                    position: 'absolute', top: 16, right: 16,
                                    bgcolor: 'background.paper',
                                    boxShadow: 1,
                                    '&:hover': { bgcolor: 'background.default' },
                                    zIndex: 2
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <CardContent sx={{ p: 4 }}>
                                <SectionHeader icon={<MedicalServicesIcon color="error" fontSize="large" />} title="Health Constraints" completion={true} />
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="caption" color="text.secondary">INJURIES</Typography>
                                    {profile.healthConstraints.injuries.length > 0 ? (
                                        profile.healthConstraints.injuries.map((inj, idx) => (
                                            <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                                <Typography variant="h6">{inj.location}</Typography>
                                                <Chip label={`Severity: ${inj.severity}/10`} size="small" color="error" variant="outlined" />
                                            </Box>
                                        ))
                                    ) : <Typography variant="h6">None ✅</Typography>}
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">RECOVERY FOCUS</Typography>
                                    <Typography variant="h6" textTransform="capitalize">{profile.healthConstraints.recoveryFocus}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* 4. Nutrition & Schedule */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ height: '100%', position: 'relative', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: theme.shadows[4] } }}>
                            <IconButton
                                onClick={() => handleEdit('nutrition')}
                                sx={{
                                    position: 'absolute', top: 16, right: 16,
                                    bgcolor: 'background.paper',
                                    boxShadow: 1,
                                    '&:hover': { bgcolor: 'background.default' },
                                    zIndex: 2
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <CardContent sx={{ p: 4 }}>
                                <SectionHeader icon={<AccessTimeIcon color="info" fontSize="large" />} title="Nutrition & Schedule" completion={!!profile.schedulePreferences.preferredTime} />
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary">DIET TYPE</Typography>
                                        <Typography variant="h6" textTransform="capitalize">{profile.nutritionPreferences.dietType.replace('_', ' ')}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary">BEST TIME</Typography>
                                        <Typography variant="h6" textTransform="capitalize">{profile.schedulePreferences.preferredTime}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary">PROTEIN PREF</Typography>
                                        <Typography variant="h6" textTransform="capitalize">{profile.nutritionPreferences.proteinPreference}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary">REST DAYS</Typography>
                                        <Typography variant="h6">{profile.schedulePreferences.restDays.slice(0, 3).join(', ')}{profile.schedulePreferences.restDays.length > 3 ? '...' : ''}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>


            </Box>

            {/* --- EDIT DIALOGS --- */}
            <Dialog open={!!editSection} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                    Edit {editSection === 'basic' ? 'Basic Identity' : editSection === 'fitness' ? 'Fitness & Equipment' : editSection === 'health' ? 'Health Constraints' : 'Nutrition & Schedule'}
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>

                        {/* Basic Identity Form */}
                        {editSection === 'basic' && (
                            <>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField label="Full Name" fullWidth value={editData.name || ''} onChange={e => handleChange('name', e.target.value)} />
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField label="Email" fullWidth value={editData.email || ''} onChange={e => handleChange('email', e.target.value)} />
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField label="Phone Number" fullWidth value={editData.phoneNumber || ''} onChange={e => handleChange('phoneNumber', e.target.value)} />
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField label="Age" type="number" fullWidth value={editData.age} onChange={e => handleChange('age', Number(e.target.value))} />
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <FormControl fullWidth>
                                            <InputLabel>Gender</InputLabel>
                                            <Select value={editData.gender} label="Gender" onChange={e => handleChange('gender', e.target.value)}>
                                                <MenuItem value="Male">Male</MenuItem>
                                                <MenuItem value="Female">Female</MenuItem>
                                                <MenuItem value="Non-binary">Non-binary</MenuItem>
                                                <MenuItem value="Not specified">Prefer not to say</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField label="Height (cm)" type="number" fullWidth value={editData.height} onChange={e => handleChange('height', Number(e.target.value))} />
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField label="Weight (kg)" type="number" fullWidth value={editData.weight} onChange={e => handleChange('weight', Number(e.target.value))} />
                                    </Grid>
                                </Grid>
                            </>
                        )}

                        {/* Fitness & Equipment Form */}
                        {editSection === 'fitness' && (
                            <>
                                <FormControl fullWidth>
                                    <InputLabel>Primary Goal</InputLabel>
                                    <Select value={editData.primaryGoal} label="Primary Goal" onChange={e => handleChange('primaryGoal', e.target.value)}>
                                        <MenuItem value="lose_weight">Lose Weight</MenuItem>
                                        <MenuItem value="gain_muscle">Gain Muscle</MenuItem>
                                        <MenuItem value="endurance">Endurance</MenuItem>
                                        <MenuItem value="flexibility">Flexibility</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>Experience Level</InputLabel>
                                    <Select value={editData.experienceLevel} label="Experience Level" onChange={e => handleChange('experienceLevel', e.target.value)}>
                                        <MenuItem value="beginner">Beginner</MenuItem>
                                        <MenuItem value="intermediate">Intermediate</MenuItem>
                                        <MenuItem value="advanced">Advanced</MenuItem>
                                    </Select>
                                </FormControl>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField label="Target Weight (kg)" type="number" fullWidth value={editData.targetWeight} onChange={e => handleChange('targetWeight', Number(e.target.value))} />
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField label="Session Duration (min)" type="number" fullWidth value={editData.sessionDuration} onChange={e => handleChange('sessionDuration', Number(e.target.value))} />
                                    </Grid>
                                </Grid>
                                <Typography variant="subtitle2" sx={{ mt: 1 }}>Equipment Available</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {Object.keys(editData.equipment || {}).map((key) => (
                                        <Chip
                                            key={key}
                                            label={key.replace(/([A-Z])/g, ' $1').trim()}
                                            onClick={() => handleChange(key, !editData.equipment[key], 'equipment')}
                                            color={editData.equipment[key] ? "primary" : "default"}
                                            variant={editData.equipment[key] ? "filled" : "outlined"}
                                            sx={{ textTransform: 'capitalize' }}
                                        />
                                    ))}
                                </Box>
                            </>
                        )}

                        {/* Health Constraints Form */}
                        {editSection === 'health' && (
                            <>
                                <Box>
                                    <Typography gutterBottom>Injuries & Severity (1-10)</Typography>
                                    {['Knee', 'Back', 'Shoulder'].map(loc => {
                                        const existing = editData.injuries?.find((i: any) => i.location === loc);
                                        return (
                                            <Box key={loc} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                <FormControlLabel
                                                    control={<Checkbox checked={!!existing} onChange={(e) => {
                                                        const newInjuries = e.target.checked
                                                            ? [...(editData.injuries || []), { location: loc, severity: 3 }]
                                                            : editData.injuries.filter((i: any) => i.location !== loc);
                                                        handleChange('injuries', newInjuries);
                                                    }} />}
                                                    label={loc}
                                                />
                                                {existing && (
                                                    <Slider
                                                        size="small"
                                                        value={existing.severity}
                                                        min={1} max={10}
                                                        onChange={(_, val) => {
                                                            const newInjuries = editData.injuries.map((i: any) => i.location === loc ? { ...i, severity: val } : i);
                                                            handleChange('injuries', newInjuries);
                                                        }}
                                                        sx={{ width: 100 }}
                                                    />
                                                )}
                                                {existing && <Typography variant="body2">{existing.severity}</Typography>}
                                            </Box>
                                        );
                                    })}
                                </Box>
                                <FormControl fullWidth>
                                    <InputLabel>Recovery Focus</InputLabel>
                                    <Select value={editData.recoveryFocus} label="Recovery Focus" onChange={e => handleChange('recoveryFocus', e.target.value)}>
                                        <MenuItem value="none">None</MenuItem>
                                        <MenuItem value="active">Active Recovery</MenuItem>
                                        <MenuItem value="passive">Passive Recovery</MenuItem>
                                    </Select>
                                </FormControl>
                            </>
                        )}

                        {/* Nutrition & Schedule Form */}
                        {editSection === 'nutrition' && (
                            <>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 6 }}>
                                        <FormControl fullWidth>
                                            <InputLabel>Diet Type</InputLabel>
                                            <Select value={editData.dietType} label="Diet Type" onChange={e => handleChange('dietType', e.target.value)}>
                                                <MenuItem value="balanced">Balanced</MenuItem>
                                                <MenuItem value="low_carb">Low Carb</MenuItem>
                                                <MenuItem value="keto">Keto</MenuItem>
                                                <MenuItem value="vegetarian">Vegetarian</MenuItem>
                                                <MenuItem value="vegan">Vegan</MenuItem>
                                                <MenuItem value="paleo">Paleo</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <FormControl fullWidth>
                                            <InputLabel>Best Time</InputLabel>
                                            <Select value={editData.preferredTime} label="Best Time" onChange={e => handleChange('preferredTime', e.target.value)}>
                                                <MenuItem value="morning">Morning</MenuItem>
                                                <MenuItem value="afternoon">Afternoon</MenuItem>
                                                <MenuItem value="evening">Evening</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField label="Calories" type="number" fullWidth value={editData.calorieTarget} onChange={e => handleChange('calorieTarget', Number(e.target.value))} />
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <FormControl fullWidth>
                                            <InputLabel>Protein Pref</InputLabel>
                                            <Select value={editData.proteinPreference} label="Protein Pref" onChange={e => handleChange('proteinPreference', e.target.value)}>
                                                <MenuItem value="low">Low</MenuItem>
                                                <MenuItem value="moderate">Moderate</MenuItem>
                                                <MenuItem value="high">High</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <FormControl fullWidth>
                                    <InputLabel>Rest Days</InputLabel>
                                    <Select
                                        multiple
                                        value={editData.restDays || []}
                                        onChange={(e) => handleChange('restDays', typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                                        input={<OutlinedInput label="Rest Days" />}
                                        renderValue={(selected) => (selected as string[]).join(', ')}
                                    >
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                            <MenuItem key={day} value={day}>
                                                <Checkbox checked={(editData.restDays || []).indexOf(day) > -1} />
                                                <ListItemText primary={day} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClose} color="inherit">Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">Save Changes</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProfileDashboard;

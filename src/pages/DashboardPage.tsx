import React from 'react';
import { Box, Typography, Card, CardContent, useTheme, CircularProgress, Container } from '@mui/material';
import { useAppData } from '../context/AppDataContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend } from 'recharts';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import InsightCard from '../components/InsightCard';

const DashboardPage: React.FC = () => {
    const { dashboardStats, progressHistory } = useAppData();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // Mock specific chart data
    const barData = [
        { name: 'Yoga', val: 92 },
        { name: 'Strength', val: 42 },
        { name: 'Cardio', val: 65 }
    ];
    const pieData = [
        { name: 'Light', value: 60, color: '#4caf50' },
        { name: 'Moderate', value: 30, color: '#ff9800' },
        { name: 'Intense', value: 10, color: '#f44336' },
    ];

    return (
        <React.Fragment>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ pb: 8 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>Performance Dashboard</Typography>

                    {/* KPI Row */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 6 }}>

                        {/* 1. Streak with Flame Animation */}
                        <Card sx={{ position: 'relative', overflow: 'hidden', borderRadius: 4 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="h3" fontWeight="bold" sx={{ color: '#FF5722' }}>
                                            {dashboardStats.currentStreak}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">CURRENT STREAK</Typography>
                                    </Box>
                                    <Box sx={{
                                        animation: 'burn 1.5s infinite alternate',
                                        '@keyframes burn': {
                                            '0%': { transform: 'scale(1)', opacity: 0.8 },
                                            '100%': { transform: 'scale(1.2)', opacity: 1 }
                                        }
                                    }}>
                                        <LocalFireDepartmentIcon sx={{ fontSize: 48, color: '#FF5722' }} />
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* 2. Completion Rate */}
                        <Card sx={{ borderRadius: 4 }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgress variant="determinate" value={dashboardStats.consistencyScore} size={60} thickness={4} color="secondary" />
                                    <Box sx={{
                                        top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Typography variant="caption" component="div" color="text.secondary">{`${dashboardStats.consistencyScore}%`}</Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">Consistency</Typography>
                                    <Typography variant="caption" color="text.secondary">Last 30 Days</Typography>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* 3. Sessions */}
                        <Card sx={{ borderRadius: 4 }}>
                            <CardContent>
                                <Typography variant="h4" fontWeight="bold">{dashboardStats.workoutsThisWeek}/7</Typography>
                                <Typography variant="caption" color="text.secondary">SESSIONS THIS WEEK</Typography>
                            </CardContent>
                        </Card>

                        {/* 4. Effort */}
                        <Card sx={{ borderRadius: 4 }}>
                            <CardContent>
                                <Typography variant="h4" fontWeight="bold">4h 32m</Typography>
                                <Typography variant="caption" color="text.secondary">TOTAL EFFORT</Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Charts Row */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4, mb: 4 }}>
                        {/* Yellow Line Chart */}
                        <Card sx={{ borderRadius: 4, p: 2 }}>
                            <CardContent sx={{ height: 350 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Workout Volume (30 Days)</Typography>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={progressHistory}>
                                        <defs>
                                            <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                        <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, borderRadius: 8 }} />
                                        <Area type="monotone" dataKey="consistency" stroke={theme.palette.primary.main} strokeWidth={3} fillOpacity={1} fill="url(#colorY)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Bar Chart: Yoga vs Strength */}
                        <Card sx={{ borderRadius: 4, p: 2 }}>
                            <CardContent sx={{ height: 350 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Type Distribution</Typography>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData} layout="vertical" margin={{ left: 10 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 12, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: theme.palette.background.paper }} />
                                        <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={20} background={{ fill: theme.palette.action.hover }}>
                                            {barData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.val > 80 ? '#4caf50' : theme.palette.primary.main} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                {/* Removed manual legend box as YAxis covers it cleanlier and prevents overflow */}

                            </CardContent>
                        </Card>
                    </Box>

                    {/* Insights and Pie */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 4 }}>
                        <Card sx={{ borderRadius: 4, p: 2 }}>
                            <CardContent sx={{ height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom width="100%">Intensity Breakdown</Typography>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Box sx={{ gridColumn: { md: 'span 2' }, display: 'grid', gap: 2 }}>
                            <InsightCard title="Chronotype Insight" type="highlight" color="secondary">
                                <Typography variant="h5" fontWeight="bold" gutterBottom>Evening: 87% vs Morning: 42%</Typography>
                                <Typography variant="body2">You are significantly more consistent with workouts scheduled after 6pm.</Typography>
                            </InsightCard>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <InsightCard title="Recovery Cycle" type="reasoning">
                                    <Typography variant="body2" fontWeight="bold">Perfect 3-day recovery cycle.</Typography>
                                    <Typography variant="caption">You've adhered to the high-low-rest cadence perfectly.</Typography>
                                </InsightCard>
                                <InsightCard title="Stress Response" type="highlight" color="primary">
                                    <Typography variant="body2" fontWeight="bold">Yoga is your shield.</Typography>
                                    <Typography variant="caption">On high stress days, yoga completion is 92%.</Typography>
                                </InsightCard>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </React.Fragment>
    );
};

export default DashboardPage;

import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Fade, useTheme, Chip, Container } from '@mui/material';
import { useAppData } from '../context/AppDataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import CoachMessage from '../components/CoachMessage';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InsightCard from '../components/InsightCard';

const ProgressPage: React.FC = () => {
    const { progressHistory } = useAppData();
    const theme = useTheme();
    const [showInsights, setShowInsights] = useState(false);

    useEffect(() => {
        setTimeout(() => setShowInsights(true), 500);
    }, []);

    return (

        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                {/* Left Column: Insight Thread */}
                <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                            Weekly Audit
                        </Typography>

                        <CoachMessage
                            message="I've analyzed your logs. You're crushing it on consistency, but let's watch the weekend dip."
                            delay={0}
                        />

                        {showInsights && (
                            <>
                                <CoachMessage
                                    message="Last week, you were 100% consistent on Tuesdays and Wednesdays. Those are your power days."
                                    delay={1000}
                                />
                                <CoachMessage
                                    message="Your lighter workouts (Low Energy days) actually have a higher completion rate (85%) than high intensity ones. Smart adaptation!"
                                    delay={2500}
                                />
                                <CoachMessage
                                    message="Next week's goal: Try to log one meal on Saturday to keep the data flowing."
                                    delay={4000}
                                />
                            </>
                        )}
                    </Box>
                </Grid>

                {/* Right Column: Visuals */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Box sx={{
                        bgcolor: 'background.paper',
                        borderRadius: 4,
                        p: 4,
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 1
                    }}>
                        <Fade in={true} timeout={800}>
                            <Box>
                                {/* Trend Chart */}
                                <InsightCard title="Consistency Trend" icon={<TrendingUpIcon />} type="highlight" color="secondary">
                                    <Box sx={{ height: 250, width: '100%', mt: 2 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={progressHistory}>
                                                <defs>
                                                    <linearGradient id="colorConsistency" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={(str) => str.slice(5)} />
                                                <YAxis hide />
                                                <Tooltip />
                                                <Area type="monotone" dataKey="consistency" stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorConsistency)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </InsightCard>

                                {/* Recent History Code */}
                                <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>Recent Logs</Typography>
                                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, bgcolor: 'transparent' }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider', color: 'text.secondary' }}>Date</TableCell>
                                                <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider', color: 'text.secondary' }}>Status</TableCell>
                                                <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider', color: 'text.secondary' }}>Streak</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {progressHistory.map((row, idx) => (
                                                <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>{row.date}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={row.workoutCompleted ? "Complete" : "Missed"}
                                                            color={row.workoutCompleted ? "success" : "default"}
                                                            size="small"
                                                            variant={row.workoutCompleted ? "filled" : "outlined"}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{row.streak} 🔥</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Fade>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProgressPage;

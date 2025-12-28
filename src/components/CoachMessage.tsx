import React from 'react';
import { Box, Paper, Typography, Avatar, Fade } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

interface CoachMessageProps {
    message: string;
    delay?: number;
}

const CoachMessage: React.FC<CoachMessageProps> = ({ message, delay = 0 }) => {
    return (
        <Fade in={true} style={{ transitionDelay: `${delay}ms` }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                    <SmartToyIcon />
                </Avatar>
                <Paper
                    elevation={1}
                    sx={{
                        p: 2,
                        borderRadius: '0 20px 20px 20px',
                        bgcolor: 'background.paper', // specific: theme-aware
                        maxWidth: '85%',
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        {message}
                    </Typography>
                </Paper>
            </Box>
        </Fade>
    );
};

export default CoachMessage;

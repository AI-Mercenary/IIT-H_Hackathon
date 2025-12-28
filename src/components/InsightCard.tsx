import React, { ReactNode } from 'react';
import { Card, CardContent, Typography, Box, Chip, useTheme } from '@mui/material';

interface InsightCardProps {
    title: string;
    icon?: ReactNode;
    children: ReactNode;
    type?: 'highlight' | 'reasoning' | 'action';
    color?: 'primary' | 'secondary' | 'info' | 'warning' | 'success' | 'error';
}

const InsightCard: React.FC<InsightCardProps> = ({ title, icon, children, type = 'highlight', color = 'primary' }) => {
    const theme = useTheme();

    // Use theme-aware background. If reasoning (often quoted/secondary), use action.hover or alpha.
    // If highlight (primary card), use background.paper.
    const bgColor = type === 'highlight'
        ? (color === 'primary' ? theme.palette.primary.main : theme.palette.background.paper)
        : theme.palette.action.hover;

    // For primary highlight cards, ensure text is contrastText
    const textColor = (type === 'highlight' && color === 'primary') ? theme.palette.primary.contrastText : 'text.primary';

    // Override specifically for the "Yellow" insight card seen in screenshot 2 to be consistent
    // Actually, looking at screenshot, one is Yellow (visible), others are White (invisible).
    // The invisible ones likely had type='highlight' (default) and bgColor='white' (hardcoded).
    // Replacing 'white' with 'background.paper' fixes the invisible text in dark mode.

    return (
        <Card sx={{ mb: 2, height: type === 'highlight' ? '100%' : 'auto', bgcolor: type === 'highlight' && color !== 'primary' ? 'background.paper' : bgColor, color: textColor }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                    {icon && <Box sx={{ color: `${color}.main` }}>{icon}</Box>}
                    <Typography variant={type === 'reasoning' ? 'subtitle1' : 'h5'} fontWeight="bold" color={type === 'reasoning' ? 'text.secondary' : 'inherit'}>
                        {title}
                    </Typography>
                </Box>
                {children}
            </CardContent>
        </Card>
    );
};

export default InsightCard;

import React, { useState } from 'react';
import { Box, Fab, Paper, Typography, Fade, TextField, IconButton, Button } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useProfile } from '../context/ProfileContext';

// Simple mock logic for demonstration
const MOCK_SCENARIOS: Record<string, string> = {
    "knee": "I see you mentioned a knee issue. I can update your profile to exclude high-impact jumping exercises. Should I do that?",
    "vegan": "Going plant-based? I can set your nutrition preference to Vegan. Confirm?",
    "default": "I'm analyzing your profile. Want me to adjust your calorie target for faster weight loss?"
};

const FloatingChatPanel: React.FC = () => {
    const { updateSection, profile } = useProfile();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ sender: 'user' | 'bot', text: string }[]>([
        { sender: 'bot', text: "Hi! I'm Ada. I can help optimize your profile. Try saying 'I have bad knees' or 'Switch to Vegan'." }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        const userText = input.toLowerCase();
        setMessages(prev => [...prev, { sender: 'user', text: input }]);
        setInput('');

        // Simple mock parser
        setTimeout(() => {
            let botResponse = MOCK_SCENARIOS['default'];
            let pendingAction: (() => void) | null = null;

            if (userText.includes('knee')) {
                botResponse = MOCK_SCENARIOS['knee'];
                pendingAction = () => {
                    updateSection('healthConstraints', { injuries: [...profile.healthConstraints.injuries, 'Knee'] });
                };
            } else if (userText.includes('vegan')) {
                botResponse = MOCK_SCENARIOS['vegan'];
                pendingAction = () => {
                    updateSection('nutritionPreferences', { dietaryRestrictions: [...profile.nutritionPreferences.dietaryRestrictions, 'Vegan'] });
                };
            } else if (userText.includes('yes') || userText.includes('confirm')) {
                botResponse = "Great! Profile updated.";
                // In a real app, we'd store pending actions in state. 
                // Here we just simulate for the specific keywords above.
            }

            setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);

            // Auto-execute for demo if specifically matched (simulating "yes" flow simplification)
            if (pendingAction) {
                setTimeout(() => {
                    pendingAction!();
                    setMessages(prev => [...prev, { sender: 'bot', text: "✅ I've updated your profile settings." }]);
                }, 1500);
            }

        }, 800);
    };

    return (
        <>
            {/* FAB */}
            <Fab
                color="primary"
                sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <CloseIcon /> : <SmartToyIcon />}
            </Fab>

            {/* Chat Window */}
            <Fade in={isOpen}>
                <Paper
                    elevation={6}
                    sx={{
                        position: 'fixed',
                        bottom: 100,
                        right: 32,
                        width: 350,
                        height: 500,
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 4,
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ bgcolor: 'primary.main', p: 2, color: 'primary.contrastText', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SmartToyIcon fontSize="small" />
                        <Typography variant="subtitle1" fontWeight="bold">Coach Ada</Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: 'background.default' }}>
                        {messages.map((msg, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    display: 'flex',
                                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    mb: 2
                                }}
                            >
                                <Paper
                                    sx={{
                                        p: 1.5,
                                        maxWidth: '80%',
                                        borderRadius: 2,
                                        bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                                        color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary'
                                    }}
                                >
                                    <Typography variant="body2">{msg.text}</Typography>
                                </Paper>
                            </Box>
                        ))}
                    </Box>

                    <Box sx={{ p: 2, bgcolor: 'background.paper', display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <IconButton color="primary" onClick={handleSend}><SendIcon /></IconButton>
                    </Box>
                </Paper>
            </Fade>
        </>
    );
};

export default FloatingChatPanel;

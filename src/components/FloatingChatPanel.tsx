import React, { useState, useRef, useEffect } from 'react';
import { Box, Fab, Paper, Typography, Fade, TextField, IconButton, CircularProgress, Chip } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useProfile } from '../context/ProfileContext';
import { useAppData } from '../context/AppDataContext';
import { api } from '../services/api';

// Define Message Type
interface Message {
    id: number;
    sender: 'user' | 'bot';
    text: string;
}

const FloatingChatPanel: React.FC = () => {
    const { profile } = useProfile();
    const { generateWorkoutPlan, generateMealPlan } = useAppData();

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, sender: 'bot', text: "Hi! I'm Coach Ada. Ask me about your diet, health, or workout plan." }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Auto-scroll to bottom
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userText = input;

        // 1. Add User Message
        const userMsg: Message = { id: Date.now(), sender: 'user', text: userText };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // 2. Call Backend
            const result = await api.today.chat({
                user_id: "user_123", // Replace with real auth ID
                message: userText,
                context: {
                    ...profile,
                    intent: 'general_fitness_inquiry', // Hint to agent
                    location: 'floating_widget'
                }
            });

            // 3. Add Agent Response
            const botMsg: Message = {
                id: Date.now() + 1,
                sender: 'bot',
                text: result.response
            };
            setMessages(prev => [...prev, botMsg]);

            // 4. Handle Actions
            if (result.data) {
                if (result.data.workout_plan) generateWorkoutPlan();
                if (result.data.meal_plan) generateMealPlan();
            }

        } catch (error) {
            console.error("Chat error", error);
            setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: "Sorry, I'm having trouble connecting to the server." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* FAB */}
            <Fab
                color="primary"
                aria-label="chat"
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    zIndex: 1000,
                    boxShadow: '0 4px 20px rgba(255, 196, 0, 0.4)'
                }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <CloseIcon /> : <SmartToyIcon />}
            </Fab>

            {/* Chat Window */}
            <Fade in={isOpen}>
                <Paper
                    elevation={12}
                    sx={{
                        position: 'fixed',
                        bottom: 100,
                        right: 32,
                        width: { xs: 'calc(100% - 64px)', sm: 350 },
                        height: 500,
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 4,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper'
                    }}
                >
                    {/* Header */}
                    <Box sx={{ bgcolor: 'primary.main', p: 2, color: 'black', display: 'flex', alignItems: 'center', gap: 1, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50', boxShadow: '0 0 5px #4caf50' }} />
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ flexGrow: 1 }}>Coach Ada</Typography>
                        <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'black' }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* Messages Area */}
                    <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: 'background.default', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {messages.map((msg) => (
                            <Box
                                key={msg.id}
                                sx={{
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%'
                                }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 1.5,
                                        borderRadius: msg.sender === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
                                        bgcolor: msg.sender === 'user' ? 'primary.main' : 'action.hover',
                                        color: msg.sender === 'user' ? 'black' : 'text.primary',
                                        border: msg.sender === 'user' ? 'none' : '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.text}</Typography>
                                </Paper>
                            </Box>
                        ))}

                        {isTyping && (
                            <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                                <CircularProgress size={10} color="primary" />
                                <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>Ada is typing...</Typography>
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input Area */}
                    <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Ask about workouts, diet..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                disabled={isTyping}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        bgcolor: 'background.default'
                                    }
                                }}
                            />
                            <IconButton
                                color="primary"
                                onClick={handleSend}
                                disabled={isTyping || !input.trim()}
                                sx={{ bgcolor: 'primary.main', color: 'black', '&:hover': { bgcolor: 'primary.dark' }, '&.Mui-disabled': { bgcolor: 'action.disabledBackground' } }}
                            >
                                <SendIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Paper>
            </Fade>
        </>
    );
};

export default FloatingChatPanel;

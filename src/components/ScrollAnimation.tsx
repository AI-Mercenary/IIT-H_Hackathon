import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { Box, Slide, Fade, BoxProps } from '@mui/material';

interface ScrollAnimationProps extends BoxProps {
    children: ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right';
    delay?: number;
    threshold?: number;
    duration?: number;
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
    children,
    direction = 'up',
    delay = 0,
    threshold = 0.1,
    duration = 500,
    ...props
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Only animate once
                }
            },
            { threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, [threshold]);

    return (
        <Box ref={ref} {...props} sx={{ overflow: 'hidden', ...props.sx }}>
            <Slide in={isVisible} direction={direction} timeout={duration} style={{ transitionDelay: `${delay}ms` }}>
                <Box>
                    <Fade in={isVisible} timeout={duration} style={{ transitionDelay: `${delay}ms` }}>
                        <Box>{children}</Box>
                    </Fade>
                </Box>
            </Slide>
        </Box>
    );
};

export default ScrollAnimation;

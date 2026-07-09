'use client';

import { Box, type BoxProps } from '@mui/material';
import { useReveal } from '@/hooks/useReveal';

interface RevealProps extends BoxProps {
  delay?: number;
}

// Wraps children in a scroll-reveal container. `delay` staggers grouped items.
export default function Reveal({ delay = 0, sx, children, ...rest }: RevealProps) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Box
      ref={ref}
      className="reveal"
      sx={{ transitionDelay: `${delay}ms`, ...sx }}
      {...rest}
    >
      {children}
    </Box>
  );
}

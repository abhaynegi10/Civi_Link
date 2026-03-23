// src/components/ui/CustomCursor.js
'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/theme-provider';

export default function CustomCursor() {
  const { darkMode } = useTheme();
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Raw mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smoothed position for the outer ring (delayed follow)
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check for reduced motion preference
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);

    // Hide on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Track hover on interactive elements
    const interactiveSelector = 'a, button, input, textarea, select, [role="button"], .card-hover';

    const handleMouseOverCapture = (e) => {
      if (e.target.closest(interactiveSelector)) {
        setIsHovering(true);
      }
    };

    const handleMouseOutCapture = (e) => {
      if (e.target.closest(interactiveSelector)) {
        setIsHovering(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOverCapture, true);
    document.addEventListener('mouseout', handleMouseOutCapture, true);

    return () => {
      mq.removeEventListener('change', handler);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOverCapture, true);
      document.removeEventListener('mouseout', handleMouseOutCapture, true);
    };
  }, [mouseX, mouseY, isVisible]);

  // Don't render if reduced motion or not visible
  if (prefersReducedMotion) return null;

  const dotColor = darkMode ? '#60a5fa' : '#2563eb'; // blue-400 / blue-600
  const ringColor = darkMode ? 'rgba(96, 165, 250, 0.3)' : 'rgba(37, 99, 235, 0.2)';

  return (
    <>
      {/* Hide default cursor globally */}
      <style jsx global>{`
        * { cursor: none !important; }
      `}</style>

      <AnimatePresence>
        {isVisible && (
          <>
            {/* Inner dot — follows cursor exactly */}
            <motion.div
              className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
              style={{
                x: mouseX,
                y: mouseY,
                translateX: '-50%',
                translateY: '-50%',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <motion.div
                animate={{
                  width: isHovering ? 8 : 6,
                  height: isHovering ? 8 : 6,
                }}
                transition={{ duration: 0.15 }}
                style={{
                  backgroundColor: dotColor,
                  borderRadius: '50%',
                }}
              />
            </motion.div>

            {/* Outer ring — follows with spring delay */}
            <motion.div
              className="fixed top-0 left-0 z-[9998] pointer-events-none"
              style={{
                x: ringX,
                y: ringY,
                translateX: '-50%',
                translateY: '-50%',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <motion.div
                animate={{
                  width: isHovering ? 48 : 32,
                  height: isHovering ? 48 : 32,
                  borderColor: isHovering ? dotColor : ringColor,
                  borderWidth: isHovering ? 2 : 1.5,
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{
                  borderRadius: '50%',
                  borderStyle: 'solid',
                  backgroundColor: isHovering
                    ? (darkMode ? 'rgba(96, 165, 250, 0.08)' : 'rgba(37, 99, 235, 0.06)')
                    : 'transparent',
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

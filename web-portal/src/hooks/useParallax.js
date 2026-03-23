// src/hooks/useParallax.js
'use client';

import { useEffect, useState } from 'react';
import { useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Custom hook for parallax scroll effects.
 * @param {object} ref - React ref to the element
 * @param {number} speed - Parallax speed multiplier (0 = no movement, 1 = full scroll speed)
 * @param {string} direction - 'up' or 'down'
 * @returns {object} - { y } motion value for style binding
 */
export function useParallax(ref, speed = 0.3, direction = 'up') {
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const range = direction === 'up' ? [speed * 100, -speed * 100] : [-speed * 100, speed * 100];

  const y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : range);

  return { y };
}

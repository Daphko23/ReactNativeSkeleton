/**
 * Spacing System - Enterprise Design Tokens
 * Semantic spacing values for consistent layouts
 */

export const SPACING_TOKENS = {
  // Numeric spacing (existing)
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  
  // Semantic spacing (new)
  xs: 4,    // Extra small
  sm: 8,    // Small  
  md: 16,   // Medium (base)
  lg: 24,   // Large
  xl: 32,   // Extra large
  xxl: 48,  // XX Large
  xxxl: 64, // XXX Large
} as const;

// Component-specific spacing
export const COMPONENT_SPACING = {
  card: {
    padding: 'md',
    margin: 'xs',
    gap: 'sm',
  },
  header: {
    paddingVertical: 'lg',
    marginBottom: 'sm',
  },
  list: {
    itemGap: 'xs',
    sectionGap: 'md',
  },
} as const;

export type SpacingToken = keyof typeof SPACING_TOKENS;
export type ComponentSpacing = typeof COMPONENT_SPACING; 
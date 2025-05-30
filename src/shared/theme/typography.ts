export const typography = {
  headlineLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 'bold' as const,
  },
  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: 'bold' as const,
  },
  headlineSmall: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold' as const,
  },
  titleLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'normal' as const,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'normal' as const,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'normal' as const,
  },
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
};

export type Typography = typeof typography;

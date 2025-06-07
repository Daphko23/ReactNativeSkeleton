/**
 * @fileoverview CARDS-INDEX: Enterprise Card Components Library
 * @description Central export hub for all card components following composition pattern and enterprise architecture
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Cards
 * @namespace Shared.Components.Cards
 * @category Components
 * @subcategory Cards
 * 
 * @overview
 * This comprehensive card component library provides a complete set of reusable,
 * composable card components for enterprise React Native applications. The library
 * follows a layered architecture pattern with base components, specialized components,
 * content components, and feature-ready implementations.
 * 
 * @architecture_layers
 * 1. **Base Components**: Foundation cards with core styling and behavior
 * 2. **Specialized Cards**: Purpose-built cards for specific use cases
 * 3. **Content Components**: Reusable content patterns for cards
 * 4. **Feature-Ready Cards**: Complete, high-level card implementations
 * 5. **Types**: Comprehensive TypeScript definitions
 * 6. **Utils**: Styling and utility functions
 * 
 * @design_principles
 * - **Composition over Inheritance**: Build complex cards from simple components
 * - **Theme Integration**: Full Material Design 3 theme support
 * - **Accessibility First**: WCAG 2.1 AA compliance throughout
 * - **Type Safety**: Complete TypeScript coverage
 * - **Performance**: Optimized for smooth 60fps interactions
 * - **Testability**: Test-friendly with comprehensive testID support
 * 
 * @usage_patterns
 * ```tsx
 * // Basic usage with BaseCard
 * import { BaseCard } from '@/shared/components/cards';
 * 
 * // Specialized components
 * import { InfoCard, ActionCard, StatsCard, DangerCard } from '@/shared/components/cards';
 * 
 * // Content patterns
 * import { SupportCardContent, SecurityCardContent } from '@/shared/components/cards';
 * 
 * // Feature-ready implementations
 * import { ProfileCard, SettingsCard } from '@/shared/components/cards';
 * 
 * // Types and utilities
 * import { BaseCardProps, createCardStyles } from '@/shared/components/cards';
 * ```
 * 
 * @feature_highlights
 * - 🎨 **Material Design 3 Integration**: Full theme system support
 * - 🧩 **Modular Architecture**: Mix and match components as needed
 * - 📱 **Mobile Optimized**: Touch-friendly with proper spacing
 * - 🌐 **Internationalization**: Built-in i18n support
 * - 🔒 **Type Safe**: Complete TypeScript definitions
 * - ♿ **Accessible**: WCAG 2.1 AA compliant
 * - 🧪 **Testable**: Comprehensive testing support
 * - 🚀 **Performance**: Optimized for production use
 * 
 * @component_categories
 * 
 * **Base Components:**
 * - `BaseCard`: Foundation card with theme integration
 * - `CardContent`: Content wrapper with consistent spacing
 * 
 * **Specialized Cards:**
 * - `InfoCard`: Information display with values and trends
 * - `ActionCard`: Interactive lists with actions and navigation
 * - `StatsCard`: Statistical data with multiple layout options
 * - `DangerCard`: Warning cards for destructive actions
 * 
 * **Content Components:**
 * - `SupportCardContent`: Support and help content patterns
 * - `SecurityCardContent`: Security settings and status
 * - `DataStatsContent`: Data usage and analytics content
 * 
 * **Feature-Ready Cards:**
 * - Complete implementations for common use cases
 * - Plug-and-play components with minimal configuration
 * - Enterprise-ready with full feature sets
 * 
 * @example
 * Building a dashboard with multiple card types:
 * const DashboardScreen = () => (
 *   <ScrollView>
 *     <InfoCard title="Profile Status" value="85%" trend="up" />
 *     <StatsCard title="Usage Statistics" layout="horizontal" stats={stats} />
 *     <ActionCard title="Quick Actions" actions={actions} />
 *     <DangerCard title="Danger Zone" dangerLevel="high" />
 *   </ScrollView>
 * );
 * 
 * @customization
 * All card components support extensive customization through:
 * - Theme system integration
 * - Style prop overrides
 * - Variant selections
 * - Size configurations
 * - Custom content injection
 * 
 * @theming
 * Cards automatically adapt to your app's theme:
 * ```tsx
 * // Theme integration is automatic
 * <InfoCard
 *   title="Themed Card"
 *   variant="elevated"    // Uses theme elevation
 *   size="large"         // Uses theme spacing
 * />
 * ```
 * 
 * @accessibility
 * All components include:
 * - Screen reader compatibility
 * - Focus management
 * - High contrast support
 * - Touch target compliance
 * - Semantic markup
 * 
 * @performance_tips
 * - Use `React.memo` for static cards
 * - Implement `getItemLayout` for card lists
 * - Consider virtualization for large datasets
 * - Optimize images and icons
 * - Use appropriate card variants for context
 * 
 * @migration_guide
 * When upgrading from previous versions:
 * 1. Import paths may have changed
 * 2. Some prop names may be updated
 * 3. Theme integration may require updates
 * 4. Check TypeScript definitions for changes
 * 
 * @troubleshooting
 * Common issues and solutions:
 * - **Theme not applied**: Ensure ThemeProvider wraps your app
 * - **TypeScript errors**: Update to latest type definitions
 * - **Performance issues**: Consider card virtualization
 * - **Accessibility warnings**: Check testID and accessibility props
 * 
 * @see {@link BaseCard} for foundation card functionality
 * @see {@link InfoCard} for information display cards
 * @see {@link ActionCard} for interactive action cards
 * @see {@link StatsCard} for statistical data display
 * @see {@link DangerCard} for warning and danger cards
 * @see {@link createCardStyles} for styling utilities
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 */

// Base Components
export { BaseCard } from './base/base-card.component';
export { CardContent } from './base/card-content.component';

// Specialized Cards
export { InfoCard } from './specialized/info-card.component';
export { ActionCard } from './specialized/action-card.component';
export { StatsCard } from './specialized/stats-card.component';
export { DangerCard } from './specialized/danger-card.component';
export { CustomCard } from './specialized/custom-card.component';

// Content Components
export { SupportCardContent } from './content/support-card-content.component';
export { SecurityCardContent } from './content/security-card-content.component';
export { DataStatsContent } from './content/data-stats-content.component';

// Feature-Ready Cards (High-level, fully reusable)
export * from './feature-ready';

// Types
export * from './types/card.types';

// Utils
export { createCardStyles } from './utils/card-styles.util'; 
/**
 * @fileoverview DATE-PICKER-INDEX: Module Exports for Date Picker Components
 * @description Central export module for all date picker component variants and utilities
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Form.DatePicker
 * @namespace Shared.Components.Form.DatePicker.Index
 * @category Components
 * @subcategory Form
 * 
 * @example
 * Import all date picker components:
 * ```tsx
 * import { DatePicker, RNDatePicker } from '@/shared/components/form/date-picker';
 * ```
 * 
 * @example
 * Import specific date picker:
 * ```tsx
 * import { DatePicker } from '@/shared/components/form/date-picker';
 * ```
 * 
 * @exports
 * - DatePicker: Cross-platform native date picker component
 * - RNDatePicker: React Native Date Picker library implementation
 */

/**
 * Cross-platform date picker component using native DateTimePicker.
 * Provides platform-specific implementations for iOS and Android.
 * 
 * @component DatePicker
 * @since 1.0.0
 * @see {@link DatePicker} for detailed component documentation
 * 
 * @example
 * ```tsx
 * <DatePicker
 *   label="Geburtsdatum"
 *   value={birthDate}
 *   onChange={setBirthDate}
 * />
 * ```
 */
export {DatePicker} from './date-picker.component';

/**
 * Alternative date picker implementation using react-native-date-picker library.
 * Provides enhanced UX with custom formatting and styling options.
 * 
 * @component RNDatePicker
 * @since 1.0.0
 * @see {@link RNDatePicker} for detailed component documentation
 * 
 * @example
 * ```tsx
 * <RNDatePicker
 *   label="Event Date"
 *   value={eventDate}
 *   onChange={setEventDate}
 *   formatDate={(date) => customFormat(date)}
 * />
 * ```
 */
export {RNDatePicker} from './rn-date-picker.component';

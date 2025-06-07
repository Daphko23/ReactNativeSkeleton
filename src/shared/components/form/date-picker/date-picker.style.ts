/**
 * @fileoverview DATE-PICKER-STYLES: Styling Definitions for Date Picker Components
 * @description Comprehensive style definitions for cross-platform date picker components
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Form.DatePicker.Styles
 * @namespace Shared.Components.Form.DatePicker.Styles
 * @category Styles
 * @subcategory Form
 */

import {StyleSheet} from 'react-native';
import {colors} from '@core/theme';

/**
 * Modal overlay color constant for consistent theming.
 * Semi-transparent black overlay for modal backgrounds.
 * 
 * @constant MODAL_OVERLAY_COLOR
 * @type {string}
 * @since 1.0.0
 * @example "rgba(0, 0, 0, 0.5)"
 */
const MODAL_OVERLAY_COLOR = 'rgba(0, 0, 0, 0.5)';

/**
 * Comprehensive StyleSheet for DatePicker components.
 * Covers all visual states and platform-specific requirements.
 * 
 * @constant styles
 * @type {StyleSheet}
 * @since 1.0.0
 * 
 * @styles
 * - container: Main touchable container with input styling
 * - label: Text label above the picker
 * - dateText: Display text for selected date
 * - errorContainer: Error state border styling
 * - modalContainer: iOS modal overlay container
 * - modalContent: iOS modal content panel
 * - modalTitle: iOS modal header text
 * - datePickerIOS: iOS-specific picker dimensions
 * - modalButtonContainer: iOS button layout container
 * - confirmButton: iOS confirm button spacing
 * - picker: Generic picker container dimensions
 * - pickerContainer: Picker alignment wrapper
 * - optionsScrollView: Scrollable options container
 * - optionGroup: Option group container
 * - optionGroupTitle: Option group header text
 * - optionButton: Individual option button
 * - testButton: Test mode button styling
 */
export const styles = StyleSheet.create({
  /**
   * Main container for the date picker touchable area.
   * Mimics TextInput styling for consistency.
   * 
   * @style container
   * @layout Flexbox row with space-between alignment
   * @dimensions minHeight: 56px (standard input height)
   * @spacing padding: 12px
   * @border borderWidth: 1px, borderRadius: 4px
   * @colors theme-aware background and border
   */
  container: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 56,
    padding: 12, // Gleiche Höhe wie TextInput
  },

  /**
   * Error state styling for container.
   * Applied when hasError prop is true.
   * 
   * @style errorContainer
   * @colors error border color from theme
   */
  errorContainer: {
    borderColor: colors.error,
  },

  /**
   * Label text styling above the picker.
   * 
   * @style label
   * @colors theme text color
   * @spacing marginBottom: 8px
   */
  label: {
    color: colors.text,
    marginBottom: 8,
  },

  /**
   * Selected date display text styling.
   * 
   * @style dateText
   * @typography fontSize: 16px
   * @colors theme text color
   */
  dateText: {
    color: colors.text,
    fontSize: 16,
  },

  /**
   * iOS modal overlay container.
   * Full screen with semi-transparent background.
   * 
   * @style modalContainer
   * @layout flex: 1, bottom-aligned
   * @colors semi-transparent overlay
   */
  modalContainer: {
    backgroundColor: MODAL_OVERLAY_COLOR,
    flex: 1,
    justifyContent: 'flex-end',
  },

  /**
   * iOS modal content panel.
   * Bottom sheet style with rounded top corners.
   * 
   * @style modalContent
   * @layout bottom sheet panel
   * @spacing padding: 20px
   * @border top corners rounded (16px)
   * @colors theme surface background
   */
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },

  /**
   * iOS modal title text styling.
   * Centered header for modal dialogs.
   * 
   * @style modalTitle
   * @typography fontSize: 18px, fontWeight: bold
   * @layout textAlign: center
   * @spacing marginBottom: 16px
   */
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },

  /**
   * iOS-specific date picker dimensions.
   * Fixed size for spinner picker.
   * 
   * @style datePickerIOS
   * @dimensions width: 100%, height: 180px
   */
  datePickerIOS: {
    height: 180,
    width: '100%',
  },

  /**
   * iOS modal button container layout.
   * Right-aligned button row.
   * 
   * @style modalButtonContainer
   * @layout flexDirection: row, right-aligned
   * @spacing marginTop: 16px
   */
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },

  /**
   * iOS confirm button spacing.
   * Left margin for button separation.
   * 
   * @style confirmButton
   * @spacing marginLeft: 8px
   */
  confirmButton: {
    marginLeft: 8,
  },

  /**
   * Generic picker container dimensions.
   * Standard picker size for various platforms.
   * 
   * @style picker
   * @dimensions width: 100%, height: 200px
   */
  picker: {
    height: 200,
    width: '100%',
  },

  /**
   * Picker alignment wrapper.
   * Centers picker content horizontally.
   * 
   * @style pickerContainer
   * @layout center-aligned
   * @spacing marginVertical: 8px
   * @dimensions width: 100%
   */
  pickerContainer: {
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
  },

  /**
   * Scrollable options container.
   * Limited height with scroll capability.
   * 
   * @style optionsScrollView
   * @dimensions maxHeight: 400px
   */
  optionsScrollView: {
    maxHeight: 400,
  },

  /**
   * Option group container.
   * Groups related options together.
   * 
   * @style optionGroup
   * @spacing marginBottom: 16px
   */
  optionGroup: {
    marginBottom: 16,
  },

  /**
   * Option group title styling.
   * Header text for option groups.
   * 
   * @style optionGroupTitle
   * @typography fontWeight: bold
   * @spacing marginBottom: 8px
   */
  optionGroupTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },

  /**
   * Individual option button styling.
   * Spacing for option list items.
   * 
   * @style optionButton
   * @spacing marginVertical: 4px
   */
  optionButton: {
    marginVertical: 4,
  },

  /**
   * Test mode button styling.
   * Development/testing button appearance.
   * 
   * @style testButton
   * @spacing marginLeft: 8px
   */
  testButton: {
    marginLeft: 8,
  },
});

/**
 * @fileoverview DIALOG-PRESETS-COMPONENT: Pre-configured Dialog Variants
 * @description Ready-to-use dialog components for common use cases with semantic naming and defaults
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Dialogs
 * @namespace Shared.Components.Dialogs.Presets
 * @category Components
 * @subcategory Dialogs
 */

import React from 'react';
import { GenericDialog, DialogAction } from './generic-dialog.component';

/**
 * Base interface for all preset dialog components.
 * Provides common properties shared across all dialog presets.
 * 
 * @interface BasePresetDialogProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Base
 * 
 * @example
 * ```tsx
 * interface CustomPresetProps extends BasePresetDialogProps {
 *   customProperty: string;
 *   onCustomAction: () => void;
 * }
 * ```
 */
interface BasePresetDialogProps {
  /**
   * Controls dialog visibility state.
   * 
   * @type {boolean}
   * @required
   * @example true
   */
  visible: boolean;

  /**
   * Callback function when dialog is dismissed.
   * 
   * @type {() => void}
   * @required
   * @example () => setDialogVisible(false)
   */
  onDismiss: () => void;

  /**
   * Theme object for consistent styling.
   * 
   * @type {any}
   * @optional
   * @default Current theme from provider
   */
  theme?: any;

  /**
   * Translation function for internationalization.
   * 
   * @type {(key: string, options?: any) => string}
   * @optional
   * @default (key: string) => key
   */
  t?: (key: string, options?: any) => string;

  /**
   * Test identifier for automated testing.
   * 
   * @type {string}
   * @optional
   * @example "delete-confirmation-dialog"
   */
  testID?: string;
}

/**
 * Props interface for the DeleteConfirmationDialog component.
 * Specialized for delete operations with destructive action confirmation.
 * 
 * @interface DeleteConfirmationDialogProps
 * @extends BasePresetDialogProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Presets
 * 
 * @example
 * Delete confirmation with item name:
 * ```tsx
 * const deleteProps: DeleteConfirmationDialogProps = {
 *   visible: showDeleteDialog,
 *   onDismiss: () => setShowDeleteDialog(false),
 *   onConfirm: handleDeleteFile,
 *   itemName: 'wichtiges-dokument.pdf',
 *   confirmLoading: isDeleting,
 *   testID: 'file-delete-dialog'
 * };
 * ```
 */
export interface DeleteConfirmationDialogProps extends BasePresetDialogProps {
  /**
   * Custom title override for the dialog.
   * If not provided, uses default localized title.
   * 
   * @type {string}
   * @optional
   * @example "Datei unwiderruflich löschen"
   */
  title?: string;

  /**
   * Custom content override for the dialog.
   * If not provided, uses default localized content.
   * 
   * @type {string}
   * @optional
   * @example "Diese Aktion kann nicht rückgängig gemacht werden."
   */
  content?: string;

  /**
   * Callback function executed when deletion is confirmed.
   * 
   * @type {() => void}
   * @required
   * @example () => deleteItem(itemId)
   */
  onConfirm: () => void;

  /**
   * Shows loading state on the confirm button.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  confirmLoading?: boolean;

  /**
   * Name of the item being deleted for personalized messages.
   * When provided, creates more specific content text.
   * 
   * @type {string}
   * @optional
   * @example "Projekt Alpha"
   */
  itemName?: string;
}

/**
 * Delete Confirmation Dialog Preset
 * 
 * A specialized dialog component for confirming destructive delete operations.
 * Provides semantic styling, appropriate warnings, and personalized content
 * when item names are specified.
 * 
 * @component
 * @function DeleteConfirmationDialog
 * @param {DeleteConfirmationDialogProps} props - The component props
 * @returns {React.ReactElement} Rendered delete confirmation dialog
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Dialogs.Presets
 * @module Shared.Components.Dialogs.Presets
 * @namespace Shared.Components.Dialogs.Presets.DeleteConfirmation
 * 
 * @example
 * Basic delete confirmation:
 * ```tsx
 * import { DeleteConfirmationDialog } from '@/shared/components/dialogs';
 * 
 * const FileDeleteDialog = () => {
 *   const [showDelete, setShowDelete] = useState(false);
 *   const [isDeleting, setIsDeleting] = useState(false);
 * 
 *   const handleDelete = async () => {
 *     setIsDeleting(true);
 *     try {
 *       await deleteFile(fileId);
 *       setShowDelete(false);
 *     } finally {
 *       setIsDeleting(false);
 *     }
 *   };
 * 
 *   return (
 *     <DeleteConfirmationDialog
 *       visible={showDelete}
 *       onDismiss={() => setShowDelete(false)}
 *       onConfirm={handleDelete}
 *       confirmLoading={isDeleting}
 *       testID="file-delete-confirmation"
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * Delete with item name personalization:
 * ```tsx
 * <DeleteConfirmationDialog
 *   visible={showDeleteProject}
 *   onDismiss={closeDeleteDialog}
 *   onConfirm={deleteProject}
 *   itemName="Website Redesign Project"
 *   confirmLoading={isDeletingProject}
 *   testID="project-delete-dialog"
 * />
 * ```
 * 
 * @example
 * Custom delete dialog content:
 * ```tsx
 * <DeleteConfirmationDialog
 *   visible={showDeleteAccount}
 *   onDismiss={cancelAccountDeletion}
 *   onConfirm={deleteUserAccount}
 *   title="Konto permanent löschen"
 *   content="Ihr Konto und alle zugehörigen Daten werden unwiderruflich gelöscht. Diese Aktion kann nicht rückgängig gemacht werden. Sind Sie absolut sicher?"
 *   confirmLoading={isDeletingAccount}
 *   testID="account-deletion-dialog"
 * />
 * ```
 * 
 * @features
 * - Semantic delete dialog type
 * - Automatic red/danger color scheme
 * - Personalized content with item names
 * - Loading states for async operations
 * - Default localized strings
 * - Custom title and content overrides
 * - Accessibility-compliant
 * - Test-friendly implementation
 * 
 * @use_cases
 * - File deletion confirmations
 * - Record removal dialogs
 * - Account deletion warnings
 * - Bulk delete operations
 * - Permanent data removal
 * - Trash/recycle confirmations
 * 
 * @best_practices
 * - Always use loading states for async deletes
 * - Provide specific item names when possible
 * - Use clear, unambiguous language
 * - Consider two-step deletion for critical data
 * - Include recovery information if applicable
 * 
 * @see {@link GenericDialog} for underlying implementation
 * @see {@link SaveConfirmationDialog} for save operations
 */
export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  visible,
  onDismiss,
  onConfirm,
  confirmLoading = false,
  title,
  content,
  itemName,
  theme,
  t = (key: string) => key,
  testID
}) => {
  const dialogTitle = title || 
    (itemName 
      ? t('dialogs.delete.titleWithItem', { item: itemName }) || `${itemName} löschen`
      : t('dialogs.delete.title') || 'Löschen bestätigen'
    );

  const dialogContent = content || 
    (itemName
      ? t('dialogs.delete.contentWithItem', { item: itemName }) || `Sind Sie sicher, dass Sie "${itemName}" permanent löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.`
      : t('dialogs.delete.content') || 'Sind Sie sicher, dass Sie dieses Element permanent löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.'
    );

  const actions: DialogAction[] = [
    {
      id: 'cancel',
      label: t('common.cancel') || 'Abbrechen',
      mode: 'text',
      onPress: onDismiss,
    },
    {
      id: 'confirm',
      label: t('common.delete') || 'Löschen',
      mode: 'contained',
      color: theme?.colors?.error || '#f44336',
      onPress: onConfirm,
      loading: confirmLoading,
      testID: `${testID}-confirm`
    }
  ];

  return (
    <GenericDialog
      visible={visible}
      onDismiss={onDismiss}
      type="delete"
      title={dialogTitle}
      content={dialogContent}
      actions={actions}
      theme={theme}
      t={t}
      testID={testID}
    />
  );
};

/**
 * Props interface for the SaveConfirmationDialog component.
 * Specialized for save/discard operations with optional discard functionality.
 * 
 * @interface SaveConfirmationDialogProps
 * @extends BasePresetDialogProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Presets
 * 
 * @example
 * Save confirmation with discard option:
 * ```tsx
 * const saveProps: SaveConfirmationDialogProps = {
 *   visible: showSaveDialog,
 *   onDismiss: () => setShowSaveDialog(false),
 *   onSave: handleSaveChanges,
 *   onDiscard: handleDiscardChanges,
 *   showDiscardOption: true,
 *   saveLoading: isSaving,
 *   testID: 'form-save-dialog'
 * };
 * ```
 */
export interface SaveConfirmationDialogProps extends BasePresetDialogProps {
  /**
   * Custom title override for the dialog.
   * If not provided, uses default localized title.
   * 
   * @type {string}
   * @optional
   * @example "Änderungen speichern?"
   */
  title?: string;

  /**
   * Custom content override for the dialog.
   * If not provided, uses default localized content.
   * 
   * @type {string}
   * @optional
   * @example "Sie haben nicht gespeicherte Änderungen."
   */
  content?: string;

  /**
   * Callback function executed when save is confirmed.
   * 
   * @type {() => void}
   * @required
   * @example () => saveFormData()
   */
  onSave: () => void;

  /**
   * Optional callback function for discarding changes.
   * Only shown when showDiscardOption is true.
   * 
   * @type {() => void}
   * @optional
   * @example () => resetForm()
   */
  onDiscard?: () => void;

  /**
   * Shows loading state on the save button.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  saveLoading?: boolean;

  /**
   * Controls whether the discard option is shown.
   * When true and onDiscard is provided, shows a discard button.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  showDiscardOption?: boolean;
}

/**
 * Save Confirmation Dialog Preset
 * 
 * A specialized dialog component for confirming save/discard operations.
 * Commonly used when users navigate away from forms with unsaved changes.
 * 
 * @component
 * @function SaveConfirmationDialog
 * @param {SaveConfirmationDialogProps} props - The component props
 * @returns {React.ReactElement} Rendered save confirmation dialog
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Dialogs.Presets
 * @module Shared.Components.Dialogs.Presets
 * @namespace Shared.Components.Dialogs.Presets.SaveConfirmation
 * 
 * @example
 * Basic save confirmation:
 * ```tsx
 * import { SaveConfirmationDialog } from '@/shared/components/dialogs';
 * 
 * const FormSaveDialog = () => {
 *   const [showSave, setShowSave] = useState(false);
 *   const [isSaving, setIsSaving] = useState(false);
 * 
 *   const handleSave = async () => {
 *     setIsSaving(true);
 *     try {
 *       await saveFormData(formValues);
 *       setShowSave(false);
 *       navigation.goBack();
 *     } finally {
 *       setIsSaving(false);
 *     }
 *   };
 * 
 *   return (
 *     <SaveConfirmationDialog
 *       visible={showSave}
 *       onDismiss={() => setShowSave(false)}
 *       onSave={handleSave}
 *       saveLoading={isSaving}
 *       testID="form-save-confirmation"
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * Save with discard option:
 * ```tsx
 * <SaveConfirmationDialog
 *   visible={showUnsavedChanges}
 *   onDismiss={cancelNavigation}
 *   onSave={saveAndExit}
 *   onDiscard={discardAndExit}
 *   showDiscardOption={true}
 *   saveLoading={isSaving}
 *   testID="navigation-save-dialog"
 * />
 * ```
 * 
 * @example
 * Custom save dialog content:
 * ```tsx
 * <SaveConfirmationDialog
 *   visible={showSaveProject}
 *   onDismiss={stayInProject}
 *   onSave={saveProject}
 *   title="Projekt speichern"
 *   content="Ihr Projekt wurde geändert. Möchten Sie die Änderungen vor dem Verlassen speichern?"
 *   saveLoading={isSavingProject}
 *   testID="project-save-dialog"
 * />
 * ```
 * 
 * @features
 * - Semantic confirmation dialog type
 * - Optional discard functionality
 * - Loading states for async save operations
 * - Default localized strings
 * - Custom title and content overrides
 * - Flexible action combinations
 * - Accessibility-compliant
 * - Test-friendly implementation
 * 
 * @use_cases
 * - Form navigation confirmations
 * - Document save prompts
 * - Settings change confirmations
 * - Draft content saving
 * - Editor unsaved changes
 * - Profile update confirmations
 * 
 * @best_practices
 * - Show when navigating away from unsaved forms
 * - Use loading states for async operations
 * - Provide clear action labels
 * - Consider auto-save to reduce interruptions
 * - Make discard option secondary to save
 * 
 * @see {@link GenericDialog} for underlying implementation
 * @see {@link DeleteConfirmationDialog} for delete operations
 */
export const SaveConfirmationDialog: React.FC<SaveConfirmationDialogProps> = ({
  visible,
  onDismiss,
  onSave,
  onDiscard,
  saveLoading = false,
  showDiscardOption = false,
  title,
  content,
  theme,
  t = (key: string) => key,
  testID
}) => {
  const dialogTitle = title || t('dialogs.save.title') || 'Änderungen speichern?';
  const dialogContent = content || t('dialogs.save.content') || 'Sie haben nicht gespeicherte Änderungen. Möchten Sie diese speichern?';

  const actions: DialogAction[] = [
    {
      id: 'cancel',
      label: t('common.cancel') || 'Abbrechen',
      mode: 'text',
      onPress: onDismiss,
    }
  ];

  if (showDiscardOption && onDiscard) {
    actions.push({
      id: 'discard',
      label: t('common.discard') || 'Verwerfen',
      mode: 'outlined',
      color: theme?.colors?.error || '#f44336',
      onPress: onDiscard,
    });
  }

  actions.push({
    id: 'save',
    label: t('common.save') || 'Speichern',
    mode: 'contained',
    onPress: onSave,
    loading: saveLoading,
    testID: `${testID}-save`
  });

  return (
    <GenericDialog
      visible={visible}
      onDismiss={onDismiss}
      type="confirmation"
      title={dialogTitle}
      content={dialogContent}
      actions={actions}
      theme={theme}
      t={t}
      testID={testID}
    />
  );
};

/**
 * Props interface for the WarningDialog component.
 * Specialized for warning messages with optional continue action.
 * 
 * @interface WarningDialogProps
 * @extends BasePresetDialogProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Presets
 * 
 * @example
 * Warning with continue action:
 * ```tsx
 * const warningProps: WarningDialogProps = {
 *   visible: showWarning,
 *   onDismiss: () => setShowWarning(false),
 *   content: 'Diese Aktion könnte unerwartete Auswirkungen haben.',
 *   onContinue: proceedWithAction,
 *   continueLabel: 'Trotzdem fortfahren',
 *   continueLoading: isProcessing,
 *   testID: 'risky-action-warning'
 * };
 * ```
 */
export interface WarningDialogProps extends BasePresetDialogProps {
  /**
   * Custom title override for the dialog.
   * If not provided, uses default localized warning title.
   * 
   * @type {string}
   * @optional
   * @example "Achtung: Risiko erkannt"
   */
  title?: string;

  /**
   * Warning message content to display.
   * Should clearly explain the potential risk or consequence.
   * 
   * @type {string}
   * @required
   * @example "Diese Aktion kann nicht rückgängig gemacht werden."
   */
  content: string;

  /**
   * Optional callback function to continue despite the warning.
   * When provided, shows a continue button alongside dismiss.
   * 
   * @type {() => void}
   * @optional
   * @example () => proceedWithRiskyAction()
   */
  onContinue?: () => void;

  /**
   * Custom label for the continue button.
   * Only used when onContinue is provided.
   * 
   * @type {string}
   * @optional
   * @default "Fortfahren"
   * @example "Trotzdem fortfahren"
   */
  continueLabel?: string;

  /**
   * Shows loading state on the continue button.
   * Only applies when onContinue is provided.
   * 
   * @type {boolean}
   * @optional
   * @default false
   * @example true
   */
  continueLoading?: boolean;
}

/**
 * Warning Dialog Preset
 * 
 * A specialized dialog component for displaying warning messages with optional
 * continue functionality. Uses orange/warning color scheme and appropriate
 * icons to convey caution to users.
 * 
 * @component
 * @function WarningDialog
 * @param {WarningDialogProps} props - The component props
 * @returns {React.ReactElement} Rendered warning dialog
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Dialogs.Presets
 * @module Shared.Components.Dialogs.Presets
 * @namespace Shared.Components.Dialogs.Presets.Warning
 * 
 * @example
 * Simple warning dialog:
 * ```tsx
 * import { WarningDialog } from '@/shared/components/dialogs';
 * 
 * const NetworkWarning = () => {
 *   const [showWarning, setShowWarning] = useState(false);
 * 
 *   return (
 *     <WarningDialog
 *       visible={showWarning}
 *       onDismiss={() => setShowWarning(false)}
 *       content="Ihre Internetverbindung ist instabil. Einige Funktionen könnten eingeschränkt sein."
 *       testID="network-warning"
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * Warning with continue option:
 * ```tsx
 * <WarningDialog
 *   visible={showDataWarning}
 *   onDismiss={cancelAction}
 *   title="Datenverbrauch Warnung"
 *   content="Diese Aktion wird eine große Menge an Daten verbrauchen. Im mobilen Netz können zusätzliche Kosten entstehen."
 *   onContinue={proceedWithDownload}
 *   continueLabel="Download starten"
 *   continueLoading={isDownloading}
 *   testID="data-usage-warning"
 * />
 * ```
 * 
 * @example
 * Security warning dialog:
 * ```tsx
 * <WarningDialog
 *   visible={showSecurityWarning}
 *   onDismiss={dismissSecurityWarning}
 *   title="Sicherheitswarnung"
 *   content="Sie sind dabei, eine Datei aus einer nicht vertrauenswürdigen Quelle zu öffnen. Dies könnte ein Sicherheitsrisiko darstellen."
 *   onContinue={openFileAnyway}
 *   continueLabel="Datei trotzdem öffnen"
 *   testID="security-warning-dialog"
 * />
 * ```
 * 
 * @features
 * - Semantic warning dialog type
 * - Orange/warning color scheme
 * - Optional continue functionality
 * - Loading states for continue actions
 * - Default localized strings
 * - Custom title and continue label overrides
 * - Accessibility-compliant
 * - Test-friendly implementation
 * 
 * @use_cases
 * - Security warnings
 * - Data usage alerts
 * - Network condition warnings
 * - Destructive action alerts
 * - Permission requirement notices
 * - System limitation warnings
 * - Beta feature disclaimers
 * 
 * @best_practices
 * - Use for non-critical warnings only
 * - Provide clear consequence explanations
 * - Make continue action secondary to dismiss
 * - Use specific, actionable language
 * - Avoid warning fatigue with too many dialogs
 * - Consider auto-dismiss for minor warnings
 * 
 * @see {@link GenericDialog} for underlying implementation
 * @see {@link InfoDialog} for informational messages
 */
export const WarningDialog: React.FC<WarningDialogProps> = ({
  visible,
  onDismiss,
  onContinue,
  continueLabel,
  continueLoading = false,
  title,
  content,
  theme,
  t = (key: string) => key,
  testID
}) => {
  const dialogTitle = title || t('dialogs.warning.title') || 'Warnung';

  const actions: DialogAction[] = [
    {
      id: 'dismiss',
      label: t('common.ok') || 'OK',
      mode: 'text',
      onPress: onDismiss,
    }
  ];

  if (onContinue) {
    actions.unshift({
      id: 'continue',
      label: continueLabel || t('common.continue') || 'Fortfahren',
      mode: 'contained',
      color: theme?.colors?.warning || '#ff9800',
      onPress: onContinue,
      loading: continueLoading,
      testID: `${testID}-continue`
    });
  }

  return (
    <GenericDialog
      visible={visible}
      onDismiss={onDismiss}
      type="warning"
      title={dialogTitle}
      content={content}
      actions={actions}
      theme={theme}
      t={t}
      testID={testID}
    />
  );
};

/**
 * Props interface for the InfoDialog component.
 * Specialized for informational messages with optional action button.
 * 
 * @interface InfoDialogProps
 * @extends BasePresetDialogProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Presets
 * 
 * @example
 * Info dialog with action:
 * ```tsx
 * const infoProps: InfoDialogProps = {
 *   visible: showInfo,
 *   onDismiss: () => setShowInfo(false),
 *   title: 'Update verfügbar',
 *   content: 'Eine neue Version der App ist verfügbar.',
 *   onAction: openAppStore,
 *   actionLabel: 'Jetzt aktualisieren',
 *   testID: 'update-available-info'
 * };
 * ```
 */
export interface InfoDialogProps extends BasePresetDialogProps {
  /**
   * Custom title override for the dialog.
   * If not provided, uses default localized info title.
   * 
   * @type {string}
   * @optional
   * @example "Wichtige Information"
   */
  title?: string;

  /**
   * Informational message content to display.
   * Should provide clear, helpful information to the user.
   * 
   * @type {string}
   * @required
   * @example "Ihre Daten wurden erfolgreich synchronisiert."
   */
  content: string;

  /**
   * Optional callback function for an additional action.
   * When provided, shows an action button alongside dismiss.
   * 
   * @type {() => void}
   * @optional
   * @example () => navigateToSettings()
   */
  onAction?: () => void;

  /**
   * Custom label for the action button.
   * Only used when onAction is provided.
   * 
   * @type {string}
   * @optional
   * @default "Aktion"
   * @example "Einstellungen öffnen"
   */
  actionLabel?: string;
}

/**
 * Information Dialog Preset
 * 
 * A specialized dialog component for displaying informational messages with
 * optional action functionality. Uses blue/info color scheme and appropriate
 * icons to convey helpful information to users.
 * 
 * @component
 * @function InfoDialog
 * @param {InfoDialogProps} props - The component props
 * @returns {React.ReactElement} Rendered information dialog
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Dialogs.Presets
 * @module Shared.Components.Dialogs.Presets
 * @namespace Shared.Components.Dialogs.Presets.Info
 * 
 * @example
 * Simple information dialog:
 * ```tsx
 * import { InfoDialog } from '@/shared/components/dialogs';
 * 
 * const SyncCompleteInfo = () => {
 *   const [showInfo, setShowInfo] = useState(false);
 * 
 *   return (
 *     <InfoDialog
 *       visible={showInfo}
 *       onDismiss={() => setShowInfo(false)}
 *       title="Synchronisation abgeschlossen"
 *       content="Alle Ihre Daten wurden erfolgreich mit der Cloud synchronisiert."
 *       testID="sync-complete-info"
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * Info dialog with action:
 * ```tsx
 * <InfoDialog
 *   visible={showUpdateInfo}
 *   onDismiss={dismissUpdate}
 *   title="Update verfügbar"
 *   content="Eine neue Version der App ist verfügbar. Das Update enthält wichtige Sicherheitsverbesserungen und neue Funktionen."
 *   onAction={openUpdatePage}
 *   actionLabel="Jetzt aktualisieren"
 *   testID="update-available-info"
 * />
 * ```
 * 
 * @example
 * Feature announcement dialog:
 * ```tsx
 * <InfoDialog
 *   visible={showFeatureInfo}
 *   onDismiss={acknowledgeFeature}
 *   title="Neue Funktion verfügbar"
 *   content="Entdecken Sie die neue Dark Mode Funktion in den Einstellungen. Schonen Sie Ihre Augen und sparen Sie Batterie."
 *   onAction={openSettings}
 *   actionLabel="Einstellungen öffnen"
 *   testID="dark-mode-feature-info"
 * />
 * ```
 * 
 * @example
 * Success notification dialog:
 * ```tsx
 * <InfoDialog
 *   visible={showSuccessInfo}
 *   onDismiss={closeSuccessDialog}
 *   title="Erfolgreich gespeichert"
 *   content="Ihre Änderungen wurden erfolgreich gespeichert und sind jetzt auf allen Ihren Geräten verfügbar."
 *   testID="save-success-info"
 * />
 * ```
 * 
 * @features
 * - Semantic info dialog type
 * - Blue/info color scheme
 * - Optional action functionality
 * - Default localized strings
 * - Custom title and action label overrides
 * - Accessibility-compliant
 * - Test-friendly implementation
 * - Flexible content formatting
 * 
 * @use_cases
 * - Success notifications
 * - Feature announcements
 * - Update availability notices
 * - Sync completion messages
 * - Help and tip dialogs
 * - Status change notifications
 * - Achievement notifications
 * - Tutorial completion messages
 * 
 * @best_practices
 * - Use for positive or neutral information
 * - Keep content concise and helpful
 * - Make action buttons optional and contextual
 * - Provide clear next steps when applicable
 * - Consider auto-dismiss for simple notifications
 * - Use appropriate timing for non-intrusive display
 * 
 * @see {@link GenericDialog} for underlying implementation
 * @see {@link WarningDialog} for warning messages
 */
export const InfoDialog: React.FC<InfoDialogProps> = ({
  visible,
  onDismiss,
  onAction,
  actionLabel,
  title,
  content,
  theme,
  t = (key: string) => key,
  testID
}) => {
  const dialogTitle = title || t('dialogs.info.title') || 'Information';

  const actions: DialogAction[] = [
    {
      id: 'dismiss',
      label: t('common.ok') || 'OK',
      mode: 'text',
      onPress: onDismiss,
    }
  ];

  if (onAction) {
    actions.unshift({
      id: 'action',
      label: actionLabel || t('common.action') || 'Aktion',
      mode: 'contained',
      onPress: onAction,
      testID: `${testID}-action`
    });
  }

  return (
    <GenericDialog
      visible={visible}
      onDismiss={onDismiss}
      type="info"
      title={dialogTitle}
      content={content}
      actions={actions}
      theme={theme}
      t={t}
      testID={testID}
    />
  );
}; 
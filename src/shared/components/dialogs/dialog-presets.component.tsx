/**
 * Dialog Presets - Enterprise Shared Components
 * Pre-configured dialog variants for common use cases
 */

import React from 'react';
import { GenericDialog, DialogAction } from './generic-dialog.component';

// Base interface for preset dialogs
interface BasePresetDialogProps {
  visible: boolean;
  onDismiss: () => void;
  theme?: any;
  t?: (key: string, options?: any) => string;
  testID?: string;
}

// Delete Confirmation Dialog
export interface DeleteConfirmationDialogProps extends BasePresetDialogProps {
  title?: string;
  content?: string;
  onConfirm: () => void;
  confirmLoading?: boolean;
  itemName?: string; // For personalized messages like "Delete 'Project X'?"
}

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

// Save Confirmation Dialog
export interface SaveConfirmationDialogProps extends BasePresetDialogProps {
  title?: string;
  content?: string;
  onSave: () => void;
  onDiscard?: () => void;
  saveLoading?: boolean;
  showDiscardOption?: boolean;
}

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

// Warning Dialog
export interface WarningDialogProps extends BasePresetDialogProps {
  title?: string;
  content: string;
  onContinue?: () => void;
  continueLabel?: string;
  continueLoading?: boolean;
}

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

// Info Dialog
export interface InfoDialogProps extends BasePresetDialogProps {
  title?: string;
  content: string;
  onAction?: () => void;
  actionLabel?: string;
}

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
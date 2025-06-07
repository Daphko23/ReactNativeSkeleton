/**
 * useDialog Hook - Enterprise State Management
 * Custom hook for managing dialog state with type safety
 */

import React from 'react';
import { DialogType } from '../components/dialogs';

export interface DialogState {
  visible: boolean;
  type: DialogType;
  title: string;
  content: string;
  onConfirm?: () => void;
  onDismiss?: () => void;
  confirmLoading?: boolean;
  itemName?: string;
  customIcon?: string;
}

export interface UseDialogReturn {
  // State
  dialogState: DialogState;
  
  // Actions
  showDeleteDialog: (options: {
    title?: string;
    content?: string;
    itemName?: string;
    onConfirm: () => void;
  }) => void;
  
  showSaveDialog: (options: {
    title?: string;
    content?: string;
    onSave: () => void;
    onDiscard?: () => void;
  }) => void;
  
  showWarningDialog: (options: {
    title?: string;
    content: string;
    onContinue?: () => void;
  }) => void;
  
  showInfoDialog: (options: {
    title?: string;
    content: string;
    onAction?: () => void;
  }) => void;
  
  showCustomDialog: (options: {
    type: DialogType;
    title: string;
    content: string;
    customIcon?: string;
    onConfirm?: () => void;
  }) => void;
  
  setConfirmLoading: (loading: boolean) => void;
  dismissDialog: () => void;
  isVisible: boolean;
}

/**
 * Custom hook for managing dialog state
 */
export const useDialog = (): UseDialogReturn => {
  const [dialogState, setDialogState] = React.useState<DialogState>({
    visible: false,
    type: 'confirmation',
    title: '',
    content: '',
    confirmLoading: false,
  });

  const showDeleteDialog = React.useCallback((options: {
    title?: string;
    content?: string;
    itemName?: string;
    onConfirm: () => void;
  }) => {
    setDialogState({
      visible: true,
      type: 'delete',
      title: options.title || 'Element löschen',
      content: options.content || 'Sind Sie sicher, dass Sie dieses Element löschen möchten?',
      itemName: options.itemName,
      onConfirm: options.onConfirm,
      confirmLoading: false,
    });
  }, []);

  const showSaveDialog = React.useCallback((options: {
    title?: string;
    content?: string;
    onSave: () => void;
    onDiscard?: () => void;
  }) => {
    setDialogState({
      visible: true,
      type: 'confirmation',
      title: options.title || 'Änderungen speichern?',
      content: options.content || 'Sie haben nicht gespeicherte Änderungen.',
      onConfirm: options.onSave,
      onDismiss: options.onDiscard,
      confirmLoading: false,
    });
  }, []);

  const showWarningDialog = React.useCallback((options: {
    title?: string;
    content: string;
    onContinue?: () => void;
  }) => {
    setDialogState({
      visible: true,
      type: 'warning',
      title: options.title || 'Warnung',
      content: options.content,
      onConfirm: options.onContinue,
      confirmLoading: false,
    });
  }, []);

  const showInfoDialog = React.useCallback((options: {
    title?: string;
    content: string;
    onAction?: () => void;
  }) => {
    setDialogState({
      visible: true,
      type: 'info',
      title: options.title || 'Information',
      content: options.content,
      onConfirm: options.onAction,
      confirmLoading: false,
    });
  }, []);

  const showCustomDialog = React.useCallback((options: {
    type: DialogType;
    title: string;
    content: string;
    customIcon?: string;
    onConfirm?: () => void;
  }) => {
    setDialogState({
      visible: true,
      type: options.type,
      title: options.title,
      content: options.content,
      customIcon: options.customIcon,
      onConfirm: options.onConfirm,
      confirmLoading: false,
    });
  }, []);

  const setConfirmLoading = React.useCallback((loading: boolean) => {
    setDialogState(prev => ({
      ...prev,
      confirmLoading: loading,
    }));
  }, []);

  const dismissDialog = React.useCallback(() => {
    setDialogState(prev => ({
      ...prev,
      visible: false,
      confirmLoading: false,
    }));
  }, []);

  return {
    dialogState,
    showDeleteDialog,
    showSaveDialog,
    showWarningDialog,
    showInfoDialog,
    showCustomDialog,
    setConfirmLoading,
    dismissDialog,
    isVisible: dialogState.visible,
  };
}; 
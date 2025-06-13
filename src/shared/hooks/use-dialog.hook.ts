/**
 * useDialog Hook - Dialog State Management
 * 
 * @description React hook for managing dialog state with type safety
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 */

import React from 'react';
import { DialogType } from '../components/dialogs';

/**
 * Dialog State Interface
 * @interface DialogState
 */
export interface DialogState {
  /** Whether the dialog is currently visible */
  visible: boolean;
  /** The type of dialog to display */
  type: DialogType;
  /** The dialog title text */
  title: string;
  /** The main dialog content/message */
  content: string;
  /** Callback function executed when user confirms */
  onConfirm?: () => void;
  /** Callback function executed when user dismisses */
  onDismiss?: () => void;
  /** Whether the confirm action is currently loading */
  confirmLoading?: boolean;
  /** Name of the item being acted upon (for delete dialogs) */
  itemName?: string;
  /** Custom icon identifier for the dialog */
  customIcon?: string;
}

/**
 * Dialog Hook Return Interface
 * @interface UseDialogReturn
 */
export interface UseDialogReturn {
  /** Current dialog state */
  dialogState: DialogState;
  
  /** Show a delete confirmation dialog */
  showDeleteDialog: (options: {
    title?: string;
    content?: string;
    itemName?: string;
    onConfirm: () => void;
  }) => void;
  
  /** Show a save/discard changes dialog */
  showSaveDialog: (options: {
    title?: string;
    content?: string;
    onSave: () => void;
    onDiscard?: () => void;
  }) => void;
  
  /** Show a warning dialog */
  showWarningDialog: (options: {
    title?: string;
    content: string;
    onContinue?: () => void;
  }) => void;
  
  /** Show an information dialog */
  showInfoDialog: (options: {
    title?: string;
    content: string;
    onAction?: () => void;
  }) => void;
  
  /** Show a custom dialog with specified type and content */
  showCustomDialog: (options: {
    type: DialogType;
    title: string;
    content: string;
    customIcon?: string;
    onConfirm?: () => void;
  }) => void;
  
  /** Set the loading state for the confirm button */
  setConfirmLoading: (loading: boolean) => void;
  
  /** Dismiss/hide the currently visible dialog */
  dismissDialog: () => void;
  
  /** Whether any dialog is currently visible */
  isVisible: boolean;
}

/**
 * Dialog State Management Hook
 * 
 * Custom React hook for managing dialog state with type safety and comprehensive
 * dialog operations. Provides pre-configured methods for common dialog types
 * including delete confirmations, save dialogs, warnings, and information messages.
 * Features loading states, custom actions, and flexible content configuration.
 * 
 * @function useDialog
 * @returns {UseDialogReturn} Dialog management interface
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Hooks
 * @subcategory UI
 * @module Shared.Hooks
 * @namespace Shared.Hooks.UseDialog
 * 
 * @example
 * Basic dialog usage:
 * ```tsx
 * import { useDialog } from '@/shared/hooks/use-dialog.hook';
 * import { BaseDialog } from '@/shared/components/dialogs';
 * 
 * const UserManagement = () => {
 *   const { dialogState, showDeleteDialog, dismissDialog, setConfirmLoading } = useDialog();
 *   const [users, setUsers] = useState<User[]>([]);
 * 
 *   const handleDeleteUser = async (user: User) => {
 *     showDeleteDialog({
 *       itemName: user.name,
 *       content: `Are you sure you want to delete ${user.name}?`,
 *       onConfirm: async () => {
 *         setConfirmLoading(true);
 *         try {
 *           await api.deleteUser(user.id);
 *           setUsers(prev => prev.filter(u => u.id !== user.id));
 *           dismissDialog();
 *         } catch (error) {
 *           console.error('Delete failed:', error);
 *         } finally {
 *           setConfirmLoading(false);
 *         }
 *       }
 *     });
 *   };
 * 
 *   return (
 *     <View>
 *       {users.map(user => (
 *         <UserItem 
 *           key={user.id} 
 *           user={user} 
 *           onDelete={() => handleDeleteUser(user)}
 *         />
 *       ))}
 *       
 *       <BaseDialog 
 *         {...dialogState}
 *         onDismiss={dismissDialog}
 *       />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Save dialog with form handling:
 * ```tsx
 * const ProfileEditor = () => {
 *   const { showSaveDialog, dialogState, dismissDialog } = useDialog();
 *   const [profile, setProfile] = useState<UserProfile>(initialProfile);
 *   const [hasChanges, setHasChanges] = useState(false);
 *   const navigation = useNavigation();
 * 
 *   const handleBackPress = () => {
 *     if (hasChanges) {
 *       showSaveDialog({
 *         content: 'You have unsaved changes. Do you want to save before leaving?',
 *         onSave: async () => {
 *           await saveProfile(profile);
 *           dismissDialog();
 *           navigation.goBack();
 *         },
 *         onDiscard: () => {
 *           dismissDialog();
 *           navigation.goBack();
 *         }
 *       });
 *     } else {
 *       navigation.goBack();
 *     }
 *   };
 * 
 *   return (
 *     <View>
 *       <ProfileForm 
 *         profile={profile}
 *         onChange={(newProfile) => {
 *           setProfile(newProfile);
 *           setHasChanges(true);
 *         }}
 *       />
 *       
 *       <Button title="Back" onPress={handleBackPress} />
 *       
 *       <BaseDialog 
 *         {...dialogState}
 *         onDismiss={dismissDialog}
 *       />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Multiple dialog types in enterprise application:
 * ```tsx
 * const DataManager = () => {
 *   const { 
 *     showDeleteDialog, 
 *     showWarningDialog, 
 *     showInfoDialog, 
 *     showCustomDialog,
 *     dialogState, 
 *     dismissDialog,
 *     setConfirmLoading 
 *   } = useDialog();
 * 
 *   const [data, setData] = useState<DataItem[]>([]);
 * 
 *   const handleBulkDelete = (selectedItems: DataItem[]) => {
 *     showWarningDialog({
 *       title: 'Bulk Delete Warning',
 *       content: `You are about to delete ${selectedItems.length} items. This action cannot be undone.`,
 *       onContinue: () => {
 *         setConfirmLoading(true);
 *         performBulkDelete(selectedItems).finally(() => {
 *           setConfirmLoading(false);
 *           dismissDialog();
 *         });
 *       }
 *     });
 *   };
 * 
 *   const handleExport = async () => {
 *     try {
 *       const result = await exportData(data);
 *       showInfoDialog({
 *         title: 'Export Successful',
 *         content: `Data exported successfully. ${result.count} items exported.`,
 *         onAction: () => downloadFile(result.url)
 *       });
 *     } catch (error) {
 *       showCustomDialog({
 *         type: 'error',
 *         title: 'Export Failed',
 *         content: 'Failed to export data. Please try again.',
 *         customIcon: 'export-error'
 *       });
 *     }
 *   };
 * 
 *   const handleMaintenance = () => {
 *     showCustomDialog({
 *       type: 'maintenance',
 *       title: 'Maintenance Mode',
 *       content: 'System will enter maintenance mode. Users will be logged out.',
 *       customIcon: 'maintenance-warning',
 *       onConfirm: enterMaintenanceMode
 *     });
 *   };
 * 
 *   return (
 *     <View>
 *       <Button title="Bulk Delete" onPress={() => handleBulkDelete(selectedItems)} />
 *       <Button title="Export Data" onPress={handleExport} />
 *       <Button title="Maintenance Mode" onPress={handleMaintenance} />
 *       
 *       <BaseDialog 
 *         {...dialogState}
 *         onDismiss={dismissDialog}
 *       />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Advanced dialog patterns with state management:
 * ```tsx
 * const useAdvancedDialogs = () => {
 *   const dialog = useDialog();
 *   const [dialogHistory, setDialogHistory] = useState<DialogState[]>([]);
 * 
 *   const showModalStack = (dialogs: DialogState[]) => {
 *     setDialogHistory(dialogs);
 *     dialog.showCustomDialog(dialogs[0]);
 *   };
 * 
 *   const nextDialog = () => {
 *     const remaining = dialogHistory.slice(1);
 *     if (remaining.length > 0) {
 *       setDialogHistory(remaining);
 *       dialog.showCustomDialog(remaining[0]);
 *     } else {
 *       dialog.dismissDialog();
 *       setDialogHistory([]);
 *     }
 *   };
 * 
 *   const showConfirmationChain = () => {
 *     showModalStack([
 *       {
 *         type: 'warning',
 *         title: 'Step 1: Backup Warning',
 *         content: 'This will modify your data. Have you created a backup?',
 *         onConfirm: nextDialog
 *       },
 *       {
 *         type: 'confirmation',
 *         title: 'Step 2: Final Confirmation',
 *         content: 'Are you absolutely sure you want to proceed?',
 *         onConfirm: executeAction
 *       }
 *     ]);
 *   };
 * 
 *   return { ...dialog, showConfirmationChain, dialogHistory };
 * };
 * ```
 * 
 * @features
 * - Type-safe dialog state management
 * - Pre-configured dialog types (delete, save, warning, info)
 * - Custom dialog support with flexible content
 * - Loading state management for async actions
 * - Callback-based action handling
 * - Item name support for contextual messages
 * - Custom icon support
 * - Memory efficient state management
 * - React.useCallback optimization
 * - Enterprise-ready dialog patterns
 * 
 * @architecture
 * - React hooks pattern
 * - Centralized dialog state
 * - Callback-based actions
 * - Type-safe interfaces
 * - Immutable state updates
 * - Memory optimization
 * - Clean separation of concerns
 * 
 * @state_management
 * - Single dialog state object
 * - Immutable state updates
 * - Callback optimization
 * - Loading state tracking
 * - Visibility management
 * - Action callback storage
 * 
 * @performance
 * - React.useCallback optimization
 * - Minimal re-renders
 * - Efficient state updates
 * - Memory leak prevention
 * - Optimized callback handling
 * 
 * @accessibility
 * - Screen reader compatible dialogs
 * - Keyboard navigation support
 * - Focus management
 * - High contrast support
 * - Clear action descriptions
 * 
 * @use_cases
 * - Delete confirmations
 * - Save/discard dialogs
 * - Warning messages
 * - Information notifications
 * - Error dialogs
 * - Success confirmations
 * - Multi-step confirmations
 * - Bulk action warnings
 * 
 * @best_practices
 * - Use appropriate dialog types
 * - Provide clear, actionable content
 * - Handle loading states properly
 * - Test dialog flows thoroughly
 * - Consider accessibility requirements
 * - Use descriptive titles and content
 * - Handle error cases gracefully
 * - Optimize for mobile interfaces
 * 
 * @dependencies
 * - react: React library for hooks
 * - ../components/dialogs: DialogType interface
 * 
 * @see {@link DialogType} for available dialog types
 * @see {@link BaseDialog} for dialog component integration
 * 
 * @todo Add dialog animation configuration
 * @todo Implement dialog stacking support
 * @todo Add dialog persistence options
 * @todo Include dialog analytics tracking
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
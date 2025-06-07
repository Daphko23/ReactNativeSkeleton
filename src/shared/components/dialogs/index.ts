/**
 * Dialog Components Exports
 */

// Base Generic Dialog
export { GenericDialog } from './generic-dialog.component';
export type { GenericDialogProps, DialogType, DialogAction } from './generic-dialog.component';

// Dialog Presets
export {
  DeleteConfirmationDialog,
  SaveConfirmationDialog,
  WarningDialog,
  InfoDialog
} from './dialog-presets.component';

export type {
  DeleteConfirmationDialogProps,
  SaveConfirmationDialogProps,
  WarningDialogProps,
  InfoDialogProps
} from './dialog-presets.component'; 
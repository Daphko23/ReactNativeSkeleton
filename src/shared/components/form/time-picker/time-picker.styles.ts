import {StyleSheet} from 'react-native';
import {colors, spacing, typography} from '@core/theme';

// Semi-transparente Farbe für Overlays
const MODAL_OVERLAY_COLOR = 'rgba(0, 0, 0, 0.5)';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  errorContainer: {
    borderColor: colors.error,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  // Modale Dialog-Styles
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: MODAL_OVERLAY_COLOR,
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    width: '90%',
  },
  // Neue Stile für den Picker im Modal
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  picker: {
    height: 200,
    width: '100%',
  },
  pickerContainer: {
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  timeText: {
    color: colors.text,
    fontSize: 16,
  },
});

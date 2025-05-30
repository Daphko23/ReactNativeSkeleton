import {StyleSheet} from 'react-native';
import {colors} from '@core/theme';

// Konstanten für Farben
const MODAL_OVERLAY_COLOR = 'rgba(0, 0, 0, 0.5)';

export const styles = StyleSheet.create({
  confirmButton: {
    marginLeft: 8,
  },
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
  datePickerIOS: {
    height: 180,
    width: '100%',
  },
  dateText: {
    color: colors.text,
    fontSize: 16,
  },
  errorContainer: {
    borderColor: colors.error,
  },
  label: {
    color: colors.text,
    marginBottom: 8,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalContainer: {
    backgroundColor: MODAL_OVERLAY_COLOR,
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionButton: {
    marginVertical: 4,
  },
  optionGroup: {
    marginBottom: 16,
  },
  optionGroupTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  optionsScrollView: {
    maxHeight: 400,
  },
  picker: {
    height: 200,
    width: '100%',
  },
  pickerContainer: {
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
  },
  testButton: {
    marginLeft: 8,
  },
});

# Dialog Component System

Eine vollständig wiederverwendbare Dialog-Component-Bibliothek für Enterprise React Native Anwendungen.

## Components

### 1. GenericDialog
Die Basis-Component für alle Dialog-Varianten.

```tsx
import { GenericDialog } from '@/shared/components/dialogs';

<GenericDialog
  visible={showDialog}
  onDismiss={() => setShowDialog(false)}
  type="confirmation"
  title="Bestätigung erforderlich"
  content="Möchten Sie fortfahren?"
  actions={[
    {
      id: 'cancel',
      label: 'Abbrechen',
      mode: 'text',
      onPress: () => setShowDialog(false)
    },
    {
      id: 'confirm',
      label: 'Bestätigen',
      mode: 'contained',
      onPress: handleConfirm
    }
  ]}
  theme={theme}
  t={t}
/>
```

### 2. Dialog Presets
Vorkonfigurierte Dialog-Varianten für häufige Use Cases.

#### DeleteConfirmationDialog

```tsx
import { DeleteConfirmationDialog } from '@/shared/components/dialogs';

<DeleteConfirmationDialog
  visible={showDeleteDialog}
  onDismiss={() => setShowDeleteDialog(false)}
  onConfirm={handleDelete}
  itemName="Projektname"  // Optional: für personalisierte Nachrichten
  confirmLoading={isDeleting}
  theme={theme}
  t={t}
/>
```

#### SaveConfirmationDialog

```tsx
import { SaveConfirmationDialog } from '@/shared/components/dialogs';

<SaveConfirmationDialog
  visible={showSaveDialog}
  onDismiss={() => setShowSaveDialog(false)}
  onSave={handleSave}
  onDiscard={handleDiscard}  // Optional
  showDiscardOption={true}
  saveLoading={isSaving}
  theme={theme}
  t={t}
/>
```

#### WarningDialog

```tsx
import { WarningDialog } from '@/shared/components/dialogs';

<WarningDialog
  visible={showWarning}
  onDismiss={() => setShowWarning(false)}
  content="Dies könnte unerwartete Folgen haben."
  onContinue={handleContinue}  // Optional
  continueLabel="Trotzdem fortfahren"
  theme={theme}
  t={t}
/>
```

#### InfoDialog

```tsx
import { InfoDialog } from '@/shared/components/dialogs';

<InfoDialog
  visible={showInfo}
  onDismiss={() => setShowInfo(false)}
  content="Der Vorgang wurde erfolgreich abgeschlossen."
  onAction={handleNext}  // Optional
  actionLabel="Weiter"
  theme={theme}
  t={t}
/>
```

### 3. useDialog Hook
Praktischer Hook für vereinfachte Dialog-Verwaltung.

```tsx
import { useDialog } from '@/shared/hooks/use-dialog.hook';
import { GenericDialog } from '@/shared/components/dialogs';

const MyComponent = () => {
  const {
    dialogState,
    showDeleteDialog,
    showSaveDialog,
    showWarningDialog,
    dismissDialog,
    setConfirmLoading
  } = useDialog();

  const handleDeleteItem = () => {
    showDeleteDialog({
      itemName: 'Dieses Element',
      onConfirm: async () => {
        setConfirmLoading(true);
        await deleteItem();
        dismissDialog();
      }
    });
  };

  const handleUnsavedChanges = () => {
    showSaveDialog({
      onSave: handleSave,
      onDiscard: handleDiscard
    });
  };

  return (
    <>
      {/* Deine UI */}
      <Button onPress={handleDeleteItem}>Löschen</Button>
      
      {/* Ein einziger Dialog für alle Varianten */}
      <GenericDialog
        visible={dialogState.visible}
        onDismiss={dismissDialog}
        type={dialogState.type}
        title={dialogState.title}
        content={dialogState.content}
        actions={[
          {
            id: 'cancel',
            label: 'Abbrechen',
            mode: 'text',
            onPress: dismissDialog
          },
          {
            id: 'confirm',
            label: 'Bestätigen',
            mode: 'contained',
            onPress: dialogState.onConfirm,
            loading: dialogState.confirmLoading
          }
        ]}
        theme={theme}
        t={t}
      />
    </>
  );
};
```

## Dialog Types

- `confirmation` - Standard-Bestätigungsdialog (blau)
- `warning` - Warnung (orange)
- `error` - Fehler (rot)
- `info` - Information (blau)
- `delete` - Löschbestätigung (rot)
- `custom` - Benutzerdefiniert

## ActionButtons Pattern

Alle Dialogs unterstützen das ActionButtons Pattern mit flexiblen Button-Konfigurationen:

```tsx
const actions: DialogAction[] = [
  {
    id: 'cancel',
    label: 'Abbrechen',
    mode: 'text',
    onPress: onCancel
  },
  {
    id: 'secondary',
    label: 'Verwerfen',
    mode: 'outlined',
    color: theme.colors.error,
    onPress: onDiscard
  },
  {
    id: 'primary',
    label: 'Speichern',
    mode: 'contained',
    onPress: onSave,
    loading: isSaving,
    disabled: !hasChanges
  }
];
```

## Theme Integration

Alle Dialog-Components sind vollständig theme-integriert und unterstützen:

- Material Design 3 Farben
- Dark/Light Mode
- Custom Theme Colors
- Accessibility

## Übersetzungen

Vollständige i18n-Unterstützung mit Fallback-Werten:

```tsx
// In deinen Übersetzungsdateien
{
  "dialogs": {
    "delete": {
      "title": "Löschen bestätigen",
      "titleWithItem": "{{item}} löschen",
      "content": "Sind Sie sicher, dass Sie dieses Element permanent löschen möchten?",
      "contentWithItem": "Sind Sie sicher, dass Sie \"{{item}}\" permanent löschen möchten?"
    },
    "save": {
      "title": "Änderungen speichern?",
      "content": "Sie haben nicht gespeicherte Änderungen. Möchten Sie diese speichern?"
    }
  }
}
``` 
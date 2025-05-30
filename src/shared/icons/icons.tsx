import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  makeColoredIcon,
  makeSizeOnlyIcon,
  makeStaticIcon,
} from './icon.factory';

export const Icons = {
  // Für FAB, Button, etc.
  add: makeColoredIcon(Ionicons, 'add'),
  save: makeColoredIcon(Ionicons, 'save'),
  checkmark: makeColoredIcon(Ionicons, 'checkmark'),
  filter: makeColoredIcon(Ionicons, 'filter'),
  search: makeColoredIcon(Ionicons, 'search'),
  funnel: makeColoredIcon(Ionicons, 'funnel'),
  refresh: makeColoredIcon(Ionicons, 'refresh'),

  // Für Card.Title, Appbar, etc.
  close: makeSizeOnlyIcon(Ionicons, 'close'),

  // Für Chip, Menü etc.
  delete: makeStaticIcon(Ionicons, 'trash', 18),
  info: makeStaticIcon(Ionicons, 'information-circle', 18),
};

/**
 * @file src/features/shared/components/search-bar.component.tsx
 * Reusable search input with debounce and customizable icon.
 */
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {styles} from './search-bar.styles';
import {Icons} from '@shared/icons/icons';

export interface SearchBarProps {
  /** Platzhalter-Text */
  placeholder: string;
  /** Kontrollierter Startwert */
  initialValue: string;
  /** Callback bei Textänderung */
  onSearch: (text: string) => void;
  /** Debounce-Dauer in ms */
  debounceTime?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  initialValue,
  onSearch,
  debounceTime = 300,
}) => {
  const [value, setValue] = useState<string>(initialValue);

  // Sync internal state with initialValue prop changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const handler = setTimeout(() => onSearch(value), debounceTime);
    return () => clearTimeout(handler);
  }, [value, debounceTime, onSearch]);

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        style={styles.searchBar}
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        right={<TextInput.Icon icon={Icons.search} />}
      />
    </View>
  );
};

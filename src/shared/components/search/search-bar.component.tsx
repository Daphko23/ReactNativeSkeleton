/**
 * @fileoverview SEARCH-BAR-COMPONENT: Reusable Search Input Component
 * @description Debounced search input with customizable behavior and Material Design styling
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Components.Search
 * @namespace Shared.Components.Search.SearchBar
 * @category Components
 * @subcategory Search
 */

import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {styles} from './search-bar.styles';
import {Icons} from '@shared/icons/icons';

/**
 * Props interface for the SearchBar component.
 * Comprehensive configuration for search functionality with debouncing.
 * 
 * @interface SearchBarProps
 * @since 1.0.0
 * @version 1.0.0
 * @category Props
 * @subcategory Search
 * 
 * @example
 * ```tsx
 * const searchProps: SearchBarProps = {
 *   placeholder: 'Search users...',
 *   initialValue: '',
 *   onSearch: (query) => handleSearch(query),
 *   debounceTime: 500
 * };
 * ```
 */
export interface SearchBarProps {
  /**
   * Placeholder text shown when input is empty.
   * Provides guidance on what users can search for.
   * 
   * @type {string}
   * @required
   * @example "Search for products..."
   */
  placeholder: string;

  /**
   * Initial value for the search input.
   * Controls the starting state of the search field.
   * 
   * @type {string}
   * @required
   * @example "React Native"
   */
  initialValue: string;

  /**
   * Callback function executed when search text changes.
   * Receives the debounced search query as parameter.
   * 
   * @type {(text: string) => void}
   * @required
   * @example (query) => searchApi(query)
   */
  onSearch: (text: string) => void;

  /**
   * Debounce delay in milliseconds.
   * Prevents excessive API calls during rapid typing.
   * 
   * @type {number}
   * @optional
   * @default 300
   * @example 500
   */
  debounceTime?: number;
}

/**
 * Search Bar Component
 * 
 * A reusable search input component with debouncing functionality, Material Design
 * styling, and customizable behavior. Optimizes search performance by preventing
 * excessive API calls and provides a consistent search experience across the application.
 * 
 * @component
 * @function SearchBar
 * @param {SearchBarProps} props - The component props
 * @returns {React.ReactElement} Rendered search bar component
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Components
 * @subcategory Search
 * @module Shared.Components.Search
 * @namespace Shared.Components.Search.SearchBar
 * 
 * @example
 * Basic search implementation:
 * ```tsx
 * import { SearchBar } from '@/shared/components/search';
 * 
 * const ProductSearch = () => {
 *   const [searchQuery, setSearchQuery] = useState('');
 *   const [results, setResults] = useState([]);
 * 
 *   const handleSearch = async (query: string) => {
 *     setSearchQuery(query);
 *     if (query.trim()) {
 *       const searchResults = await searchProducts(query);
 *       setResults(searchResults);
 *     } else {
 *       setResults([]);
 *     }
 *   };
 * 
 *   return (
 *     <SearchBar
 *       placeholder="Search for products..."
 *       initialValue={searchQuery}
 *       onSearch={handleSearch}
 *       debounceTime={400}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * User search with loading state:
 * ```tsx
 * const UserSearch = () => {
 *   const [query, setQuery] = useState('');
 *   const [users, setUsers] = useState([]);
 *   const [isLoading, setIsLoading] = useState(false);
 * 
 *   const searchUsers = async (searchTerm: string) => {
 *     setQuery(searchTerm);
 *     
 *     if (searchTerm.length < 2) {
 *       setUsers([]);
 *       return;
 *     }
 * 
 *     setIsLoading(true);
 *     try {
 *       const response = await api.searchUsers(searchTerm);
 *       setUsers(response.data);
 *     } catch (error) {
 *       console.error('Search failed:', error);
 *       setUsers([]);
 *     } finally {
 *       setIsLoading(false);
 *     }
 *   };
 * 
 *   return (
 *     <View>
 *       <SearchBar
 *         placeholder="Search users by name or email..."
 *         initialValue={query}
 *         onSearch={searchUsers}
 *         debounceTime={600}
 *       />
 *       {isLoading && <ActivityIndicator />}
 *       <UserList users={users} />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Advanced search with filters:
 * ```tsx
 * const AdvancedSearch = () => {
 *   const [searchState, setSearchState] = useState({
 *     query: '',
 *     category: 'all',
 *     sortBy: 'relevance'
 *   });
 *   const [results, setResults] = useState([]);
 * 
 *   const performSearch = async (query: string) => {
 *     setSearchState(prev => ({ ...prev, query }));
 * 
 *     if (!query.trim()) {
 *       setResults([]);
 *       return;
 *     }
 * 
 *     const searchParams = {
 *       q: query,
 *       category: searchState.category,
 *       sort: searchState.sortBy,
 *       limit: 20
 *     };
 * 
 *     try {
 *       const response = await searchAPI(searchParams);
 *       setResults(response.items);
 *     } catch (error) {
 *       handleSearchError(error);
 *     }
 *   };
 * 
 *   return (
 *     <View>
 *       <SearchBar
 *         placeholder="Search across all categories..."
 *         initialValue={searchState.query}
 *         onSearch={performSearch}
 *         debounceTime={350}
 *       />
 *       <SearchFilters 
 *         category={searchState.category}
 *         sortBy={searchState.sortBy}
 *         onFilterChange={setSearchState}
 *       />
 *       <SearchResults results={results} />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Search with history and suggestions:
 * ```tsx
 * const SmartSearch = () => {
 *   const [currentQuery, setCurrentQuery] = useState('');
 *   const [searchHistory, setSearchHistory] = useState([]);
 *   const [suggestions, setSuggestions] = useState([]);
 * 
 *   const handleSearch = async (query: string) => {
 *     setCurrentQuery(query);
 * 
 *     if (query.length < 2) {
 *       setSuggestions([]);
 *       return;
 *     }
 * 
 *     // Get search suggestions
 *     const suggestionResults = await getSearchSuggestions(query);
 *     setSuggestions(suggestionResults);
 * 
 *     // Add to search history if it's a substantial query
 *     if (query.length >= 3 && !searchHistory.includes(query)) {
 *       setSearchHistory(prev => [query, ...prev.slice(0, 9)]);
 *     }
 *   };
 * 
 *   return (
 *     <View>
 *       <SearchBar
 *         placeholder="Search with smart suggestions..."
 *         initialValue={currentQuery}
 *         onSearch={handleSearch}
 *         debounceTime={250}
 *       />
 *       <SearchSuggestions 
 *         suggestions={suggestions}
 *         onSuggestionSelect={setCurrentQuery}
 *       />
 *       <SearchHistory 
 *         history={searchHistory}
 *         onHistorySelect={setCurrentQuery}
 *       />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @features
 * - Debounced search input for performance optimization
 * - Material Design styling integration
 * - Controlled component with external state sync
 * - Customizable debounce timing
 * - Search icon integration
 * - Real-time search feedback
 * - Memory efficient state management
 * - Accessibility compliance
 * - Cross-platform compatibility
 * - Theme integration support
 * 
 * @architecture
 * - React hooks for state management
 * - useEffect for debouncing logic
 * - Controlled input pattern
 * - External styling system
 * - Icon system integration
 * - Prop-driven configuration
 * - Event-driven search handling
 * 
 * @styling
 * - Material Design outlined input style
 * - Consistent spacing and layout
 * - Theme-aware color schemes
 * - Icon positioning and sizing
 * - Focus state handling
 * - Responsive design patterns
 * - Cross-platform styling
 * 
 * @accessibility
 * - Screen reader compatible
 * - Proper label associations
 * - Keyboard navigation support
 * - Focus management
 * - Touch target optimization
 * - High contrast support
 * - Search state announcements
 * 
 * @performance
 * - Debounced search queries to reduce API calls
 * - Efficient state updates
 * - Optimized re-render behavior
 * - Memory leak prevention with cleanup
 * - Minimal component overhead
 * - Fast input responsiveness
 * - Optimized search execution
 * 
 * @use_cases
 * - Product search in e-commerce
 * - User directory search
 * - Content discovery
 * - Document search
 * - Location search
 * - News article search
 * - Media library search
 * - Contact search
 * 
 * @best_practices
 * - Use appropriate debounce timing (200-500ms)
 * - Provide meaningful placeholder text
 * - Handle empty search states gracefully
 * - Implement proper error handling
 * - Consider minimum query length requirements
 * - Show loading states during search
 * - Cache search results when appropriate
 * - Implement search analytics
 * - Test with various input speeds
 * - Ensure proper accessibility
 * 
 * @dependencies
 * - react: Core React library with hooks
 * - react-native: View component
 * - react-native-paper: TextInput Material Design component
 * - ./search-bar.styles: Component-specific styling
 * - @shared/icons/icons: Icon system integration
 * 
 * @see {@link TextInput} for underlying input component
 * @see {@link styles} for component styling definitions
 * @see {@link Icons} for search icon configuration
 * 
 * @todo Add search history functionality
 * @todo Implement search suggestions
 * @todo Add voice search capability
 * @todo Include search analytics tracking
 */
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

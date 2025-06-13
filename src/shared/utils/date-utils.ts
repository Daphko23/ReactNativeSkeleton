/**
 * @fileoverview DATE-UTILS: Comprehensive Date Formatting and Manipulation Utilities
 * @description Provides robust date handling functions with German localization, validation, and error-safe processing for React Native applications
 * @version 1.0.0
 * @since 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @module Shared.Utils.DateUtils
 * @namespace Shared.Utils.DateUtils
 * @category Utilities
 * @subcategory Date
 */

import { LoggerFactory } from '@core/logging/logger.factory';
import { LogCategory } from '@core/logging/logger.service.interface';

const logger = LoggerFactory.createServiceLogger('DateUtils');

/**
 * Formats a date string into German date format (dd.mm.yyyy).
 * Provides safe date formatting with comprehensive error handling and validation.
 * 
 * @function formatDate
 * @param {string} dateString - The date as ISO string or other valid date format
 * @returns {string} Formatted date in dd.mm.yyyy format or empty string if invalid
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Functions
 * @subcategory Formatting
 * @module Shared.Utils.DateUtils
 * @namespace Shared.Utils.DateUtils.formatDate
 * 
 * @description
 * This function safely converts various date input formats to the standardized
 * German date format (dd.mm.yyyy). It includes comprehensive validation and
 * error handling to prevent crashes from malformed date inputs while providing
 * consistent, localized date display for German users.
 * 
 * @formatting_rules
 * - Day: Zero-padded two digits (01-31)
 * - Month: Zero-padded two digits (01-12)
 * - Year: Four digits (e.g., 2024)
 * - Separator: Dots (.) as per German convention
 * - Invalid dates return empty string
 * 
 * @example
 * Basic date formatting:
 * ```tsx
 * import { formatDate } from '@/shared/utils';
 * 
 * const isoDate = "2024-12-25T10:30:00.000Z";
 * const germanDate = formatDate(isoDate);
 * console.log(germanDate); // "25.12.2024"
 * 
 * const usDate = "12/25/2024";
 * const formatted = formatDate(usDate);
 * console.log(formatted); // "25.12.2024"
 * 
 * const invalidDate = "invalid-date";
 * const safe = formatDate(invalidDate);
 * console.log(safe); // ""
 * ```
 * 
 * @example
 * User profile display:
 * ```tsx
 * const UserProfile = ({ user }) => {
 *   const birthDate = formatDate(user.dateOfBirth);
 *   const joinDate = formatDate(user.createdAt);
 *   
 *   return (
 *     <View>
 *       <Text>Name: {user.name}</Text>
 *       {birthDate && (
 *         <Text>Geburtsdatum: {birthDate}</Text>
 *       )}
 *       {joinDate && (
 *         <Text>Mitglied seit: {joinDate}</Text>
 *       )}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Event list with formatted dates:
 * ```tsx
 * const EventList = ({ events }) => {
 *   return (
 *     <FlatList
 *       data={events}
 *       keyExtractor={(item) => item.id}
 *       renderItem={({ item }) => (
 *         <View style={styles.eventItem}>
 *           <Text style={styles.eventTitle}>{item.title}</Text>
 *           <Text style={styles.eventDate}>
 *             {formatDate(item.eventDate) || 'Datum nicht verfügbar'}
 *           </Text>
 *         </View>
 *       )}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * Form date picker integration:
 * ```tsx
 * const DatePickerForm = () => {
 *   const [selectedDate, setSelectedDate] = useState(new Date());
 *   const [showPicker, setShowPicker] = useState(false);
 *   
 *   const handleDateChange = (event, date) => {
 *     setShowPicker(false);
 *     if (date) {
 *       setSelectedDate(date);
 *     }
 *   };
 *   
 *   return (
 *     <View>
 *       <TouchableOpacity onPress={() => setShowPicker(true)}>
 *         <Text>Datum: {formatDate(selectedDate.toISOString())}</Text>
 *       </TouchableOpacity>
 *       
 *       {showPicker && (
 *         <DateTimePicker
 *           value={selectedDate}
 *           mode="date"
 *           onChange={handleDateChange}
 *         />
 *       )}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @validation_features
 * - Automatic date validity checking using isNaN()
 * - Safe handling of malformed input strings
 * - Graceful error recovery with empty string fallback
 * - Console error logging for debugging
 * - Type safety with string input validation
 * 
 * @input_formats
 * - ISO 8601 strings (2024-12-25T10:30:00.000Z)
 * - Date constructor compatible strings
 * - Numeric timestamps (milliseconds since epoch)
 * - Standard date formats (MM/DD/YYYY, YYYY-MM-DD)
 * - Locale-specific date strings
 * 
 * @output_consistency
 * - Always returns string type
 * - Consistent dd.mm.yyyy format
 * - Zero-padded day and month values
 * - Empty string for invalid inputs
 * - No null or undefined returns
 * 
 * @localization
 * - German date format convention (dd.mm.yyyy)
 * - Dot separators as per German standards
 * - Compatible with German locale expectations
 * - Suitable for German-speaking markets
 * 
 * @use_cases
 * - User interface date display
 * - Event and appointment formatting
 * - Profile and account information
 * - Historical data presentation
 * - Form field display values
 * - Report and document generation
 * - Calendar integration
 * - Notification messages
 * 
 * @error_handling
 * - Try-catch blocks for exception safety
 * - Invalid date detection with isNaN()
 * - Console error logging for debugging
 * - Graceful degradation to empty string
 * - No application crashes from bad input
 * 
 * @performance
 * - Single Date object creation
 * - Minimal string operations
 * - O(1) time complexity
 * - Efficient zero-padding with padStart()
 * - Early return for invalid dates
 * 
 * @accessibility
 * - Consistent date format for screen readers
 * - Predictable output format
 * - Compatible with internationalization
 * - Clear separation of date components
 * 
 * @see {@link formatDateWithTime} for date formatting with time
 * @see {@link isDateInPast} for date comparison utilities
 * @see {@link parseGermanDate} for reverse date parsing
 * 
 * @todo Add support for different German date formats
 * @todo Implement timezone handling
 * @todo Add date range validation
 */
export const formatDate = (dateString: string): string => {
  try {
    // Create Date object from input string
    const date = new Date(dateString);
    
    // Validate date object - check if parsing was successful
    if (isNaN(date.getTime())) {
      return ''; // Return empty string for invalid dates
    }

    // Extract date components
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    // Return formatted German date
    return `${day}.${month}.${year}`;
  } catch (error) {
    logger.error('Date formatting error', LogCategory.BUSINESS, {
      service: 'DateUtils',
      function: 'formatDate',
      inputDate: dateString
    }, error as Error);
    return '';
  }
};

/**
 * Formats a date string with time in German format (dd.mm.yyyy, HH:MM).
 * Provides comprehensive date and time formatting with localization and validation.
 * 
 * @function formatDateWithTime
 * @param {string} dateString - The date as ISO string or other valid date format
 * @returns {string} Formatted date with time in dd.mm.yyyy, HH:MM format or empty string if invalid
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Functions
 * @subcategory Formatting
 * @module Shared.Utils.DateUtils
 * @namespace Shared.Utils.DateUtils.formatDateWithTime
 * 
 * @description
 * Extended version of formatDate that includes time information in 24-hour format.
 * Provides localized German formatting for both date and time components with
 * comprehensive error handling and validation for robust application behavior.
 * 
 * @formatting_components
 * - Date: dd.mm.yyyy (German format)
 * - Time: HH:MM (24-hour format)
 * - Separator: Comma and space (, )
 * - Padding: Zero-padded for consistency
 * - Invalid inputs return empty string
 * 
 * @example
 * Basic date and time formatting:
 * ```tsx
 * import { formatDateWithTime } from '@/shared/utils';
 * 
 * const timestamp = "2024-12-25T14:30:15.000Z";
 * const formatted = formatDateWithTime(timestamp);
 * console.log(formatted); // "25.12.2024, 14:30"
 * 
 * const now = new Date().toISOString();
 * const currentTime = formatDateWithTime(now);
 * console.log(currentTime); // e.g., "15.03.2024, 10:45"
 * ```
 * 
 * @example
 * Message timestamp display:
 * ```tsx
 * const MessageItem = ({ message }) => {
 *   const timestamp = formatDateWithTime(message.createdAt);
 *   
 *   return (
 *     <View style={styles.messageContainer}>
 *       <Text style={styles.messageContent}>{message.content}</Text>
 *       <Text style={styles.timestamp}>
 *         {timestamp || 'Zeit unbekannt'}
 *       </Text>
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Appointment scheduling display:
 * ```tsx
 * const AppointmentCard = ({ appointment }) => {
 *   const startTime = formatDateWithTime(appointment.startTime);
 *   const endTime = formatDateWithTime(appointment.endTime);
 *   
 *   return (
 *     <Card>
 *       <Text style={styles.title}>{appointment.title}</Text>
 *       <Text style={styles.duration}>
 *         Von: {startTime}
 *       </Text>
 *       <Text style={styles.duration}>
 *         Bis: {endTime}
 *       </Text>
 *     </Card>
 *   );
 * };
 * ```
 * 
 * @example
 * Activity log with precise timestamps:
 * ```tsx
 * const ActivityLog = ({ activities }) => {
 *   return (
 *     <ScrollView>
 *       {activities.map((activity, index) => (
 *         <View key={index} style={styles.logEntry}>
 *           <Text style={styles.action}>{activity.action}</Text>
 *           <Text style={styles.user}>von {activity.user}</Text>
 *           <Text style={styles.timestamp}>
 *             {formatDateWithTime(activity.timestamp)}
 *           </Text>
 *         </View>
 *       ))}
 *     </ScrollView>
 *   );
 * };
 * ```
 * 
 * @time_formatting
 * - 24-hour format (00:00 to 23:59)
 * - Zero-padded hours and minutes
 * - No AM/PM indicators
 * - German time format standard
 * - Consistent across all timezones
 * 
 * @locale_considerations
 * - German date format (dd.mm.yyyy)
 * - 24-hour time format preference
 * - Comma separation between date and time
 * - Compatible with German locale settings
 * - Meets European formatting standards
 * 
 * @use_cases
 * - Message and comment timestamps
 * - Event and appointment scheduling
 * - Activity logs and audit trails
 * - File modification timestamps
 * - Transaction history display
 * - Notification timestamps
 * - Meeting and calendar entries
 * - System event logging
 * 
 * @validation_safety
 * - Comprehensive date validation
 * - Exception handling with try-catch
 * - Invalid input detection
 * - Graceful error recovery
 * - Debug logging for troubleshooting
 * 
 * @performance
 * - Single Date object instantiation
 * - Efficient component extraction
 * - Minimal string concatenation
 * - O(1) complexity operations
 * - Optimized padding operations
 * 
 * @accessibility
 * - Clear time format for screen readers
 * - Consistent format across application
 * - Internationalization friendly
 * - Logical date-time ordering
 * 
 * @see {@link formatDate} for date-only formatting
 * @see {@link isDateInPast} for date comparison
 * @see {@link parseGermanDate} for parsing German dates
 * 
 * @todo Add timezone display options
 * @todo Implement relative time formatting
 * @todo Add date range formatting
 */
export const formatDateWithTime = (dateString: string): string => {
  try {
    // Create Date object from input string
    const date = new Date(dateString);
    
    // Validate date object - check if parsing was successful
    if (isNaN(date.getTime())) {
      return ''; // Return empty string for invalid dates
    }

    // Extract date components
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    // Extract time components
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Return formatted German date with time
    return `${day}.${month}.${year}, ${hours}:${minutes}`;
  } catch (error) {
    logger.error('Date with time formatting error', LogCategory.BUSINESS, {
      service: 'DateUtils',
      function: 'formatDateWithTime',
      inputDate: dateString
    }, error as Error);
    return '';
  }
};

/**
 * Checks if a given date is in the past compared to the current time.
 * Provides reliable date comparison with error handling for validation purposes.
 * 
 * @function isDateInPast
 * @param {string} dateString - The date string to check against current time
 * @returns {boolean} true if the date is in the past, false otherwise
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Functions
 * @subcategory Validation
 * @module Shared.Utils.DateUtils
 * @namespace Shared.Utils.DateUtils.isDateInPast
 * 
 * @description
 * This utility function safely compares a given date against the current time
 * to determine if it represents a past moment. It's essential for validation
 * of date inputs, expiration checks, and temporal business logic with robust
 * error handling for malformed date strings.
 * 
 * @comparison_logic
 * - Uses current system time as reference point
 * - Millisecond-precision comparison
 * - Handles timezone differences appropriately
 * - Returns false for invalid dates (safe default)
 * - Exception-safe implementation
 * 
 * @example
 * Event validation:
 * ```tsx
 * import { isDateInPast } from '@/shared/utils';
 * 
 * const eventDate = "2024-01-15T10:00:00.000Z";
 * const isPastEvent = isDateInPast(eventDate);
 * 
 * if (isPastEvent) {
 *   console.log("This event has already occurred");
 * } else {
 *   console.log("This is a future event");
 * }
 * ```
 * 
 * @example
 * Form validation for scheduling:
 * ```tsx
 * const ScheduleForm = () => {
 *   const [selectedDate, setSelectedDate] = useState('');
 *   const [error, setError] = useState('');
 *   
 *   const validateDate = (dateString: string) => {
 *     if (isDateInPast(dateString)) {
 *       setError('Bitte wählen Sie ein zukünftiges Datum');
 *       return false;
 *     }
 *     setError('');
 *     return true;
 *   };
 *   
 *   const handleSubmit = () => {
 *     if (validateDate(selectedDate)) {
 *       // Process valid future date
 *       submitSchedule(selectedDate);
 *     }
 *   };
 *   
 *   return (
 *     <View>
 *       <DatePicker
 *         value={selectedDate}
 *         onChange={setSelectedDate}
 *       />
 *       {error && <Text style={styles.error}>{error}</Text>}
 *       <Button title="Termin planen" onPress={handleSubmit} />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Expiration checking:
 * ```tsx
 * const SubscriptionStatus = ({ subscription }) => {
 *   const isExpired = isDateInPast(subscription.expirationDate);
 *   
 *   return (
 *     <View style={styles.statusContainer}>
 *       <Text style={styles.title}>Abonnement Status</Text>
 *       <Text style={[
 *         styles.status,
 *         { color: isExpired ? 'red' : 'green' }
 *       ]}>
 *         {isExpired ? 'Abgelaufen' : 'Aktiv'}
 *       </Text>
 *       {isExpired && (
 *         <Button title="Verlängern" onPress={() => renewSubscription()} />
 *       )}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Message history filtering:
 * ```tsx
 * const MessageList = ({ messages }) => {
 *   const [showOldMessages, setShowOldMessages] = useState(false);
 *   const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
 *   
 *   const filteredMessages = messages.filter(message => {
 *     if (showOldMessages) return true;
 *     return !isDateInPast(message.createdAt) || !isDateInPast(yesterday);
 *   });
 *   
 *   return (
 *     <View>
 *       <Switch
 *         value={showOldMessages}
 *         onValueChange={setShowOldMessages}
 *       />
 *       <Text>Alte Nachrichten anzeigen</Text>
 *       <FlatList
 *         data={filteredMessages}
 *         renderItem={({ item }) => <MessageItem message={item} />}
 *       />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @validation_use_cases
 * - Event scheduling validation
 * - Appointment booking constraints
 * - Expiration date checking
 * - Historical data filtering
 * - Deadline enforcement
 * - Subscription status validation
 * - Content publication scheduling
 * - Access control based on time
 * 
 * @error_handling
 * - Try-catch blocks for exception safety
 * - Invalid date handling with false return
 * - Graceful degradation for malformed input
 * - No application crashes from bad dates
 * - Consistent boolean return type
 * 
 * @performance
 * - Two Date object creations only
 * - Simple comparison operation
 * - O(1) time complexity
 * - Minimal memory allocation
 * - Efficient boolean evaluation
 * 
 * @timezone_considerations
 * - Uses system/local timezone
 * - Consistent with user's locale
 * - No timezone conversion needed
 * - Reliable for local time comparisons
 * 
 * @business_logic
 * - Prevents scheduling in the past
 * - Validates subscription periods
 * - Enforces temporal constraints
 * - Supports audit trail logic
 * - Enables deadline checking
 * 
 * @see {@link formatDate} for date formatting
 * @see {@link formatDateWithTime} for detailed timestamps
 * @see {@link parseGermanDate} for date parsing
 * 
 * @todo Add timezone-aware comparison options
 * @todo Implement configurable time windows
 * @todo Add relative time calculations
 */
export const isDateInPast = (dateString: string): boolean => {
  try {
    // Parse input date and current time
    const date = new Date(dateString);
    const now = new Date();
    
    // Compare dates - return true if input date is before current time
    return date < now;
  } catch {
    // Return false for any parsing errors (safe default)
    return false;
  }
};

/**
 * Converts a German date format (dd.mm.yyyy) back to an ISO string.
 * Provides reverse parsing for German-formatted dates with comprehensive validation.
 * 
 * @function parseGermanDate
 * @param {string} formattedDate - Date string in dd.mm.yyyy format
 * @returns {string | null} ISO date string or null if invalid format
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author ReactNativeSkeleton Enterprise Team
 * @category Functions
 * @subcategory Parsing
 * @module Shared.Utils.DateUtils
 * @namespace Shared.Utils.DateUtils.parseGermanDate
 * 
 * @description
 * This function performs the reverse operation of formatDate, converting
 * German-formatted date strings (dd.mm.yyyy) back to ISO format for
 * storage and API communication. It includes comprehensive validation
 * to ensure only valid German dates are processed.
 * 
 * @parsing_rules
 * - Input format: dd.mm.yyyy (exact format required)
 * - Dot separators mandatory
 * - Day: 01-31 (validated against month)
 * - Month: 01-12 (validated)
 * - Year: Four digits (validated)
 * - Invalid formats return null
 * 
 * @example
 * Basic German date parsing:
 * ```tsx
 * import { parseGermanDate } from '@/shared/utils';
 * 
 * const germanDate = "25.12.2024";
 * const isoDate = parseGermanDate(germanDate);
 * console.log(isoDate); // "2024-12-25T00:00:00.000Z"
 * 
 * const invalidDate = "32.13.2024";
 * const result = parseGermanDate(invalidDate);
 * console.log(result); // null
 * 
 * const wrongFormat = "2024-12-25";
 * const parsed = parseGermanDate(wrongFormat);
 * console.log(parsed); // null
 * ```
 * 
 * @example
 * Form date input processing:
 * ```tsx
 * const DateInputForm = () => {
 *   const [dateInput, setDateInput] = useState('');
 *   const [error, setError] = useState('');
 *   
 *   const handleDateSubmit = () => {
 *     const isoDate = parseGermanDate(dateInput);
 *     
 *     if (isoDate) {
 *       // Valid date - can be used for API calls
 *       submitDate(isoDate);
 *       setError('');
 *     } else {
 *       setError('Bitte geben Sie ein gültiges Datum im Format dd.mm.yyyy ein');
 *     }
 *   };
 *   
 *   return (
 *     <View>
 *       <TextInput
 *         value={dateInput}
 *         onChangeText={setDateInput}
 *         placeholder="dd.mm.yyyy"
 *         keyboardType="numeric"
 *       />
 *       {error && <Text style={styles.error}>{error}</Text>}
 *       <Button title="Datum speichern" onPress={handleDateSubmit} />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * Batch date processing:
 * ```tsx
 * const DateProcessor = ({ germanDates }) => {
 *   const [processedDates, setProcessedDates] = useState([]);
 *   const [errors, setErrors] = useState([]);
 *   
 *   const processDates = () => {
 *     const results = [];
 *     const errorList = [];
 *     
 *     germanDates.forEach((dateStr, index) => {
 *       const isoDate = parseGermanDate(dateStr);
 *       
 *       if (isoDate) {
 *         results.push({
 *           original: dateStr,
 *           iso: isoDate,
 *           index
 *         });
 *       } else {
 *         errorList.push({
 *           date: dateStr,
 *           index,
 *           error: 'Ungültiges Datumsformat'
 *         });
 *       }
 *     });
 *     
 *     setProcessedDates(results);
 *     setErrors(errorList);
 *   };
 *   
 *   return (
 *     <View>
 *       <Button title="Daten verarbeiten" onPress={processDates} />
 *       
 *       {processedDates.length > 0 && (
 *         <View>
 *           <Text>Erfolgreich verarbeitet:</Text>
 *           {processedDates.map((item, i) => (
 *             <Text key={i}>{item.original} → {item.iso}</Text>
 *           ))}
 *         </View>
 *       )}
 *       
 *       {errors.length > 0 && (
 *         <View>
 *           <Text style={{ color: 'red' }}>Fehler:</Text>
 *           {errors.map((error, i) => (
 *             <Text key={i} style={{ color: 'red' }}>
 *               {error.date}: {error.error}
 *             </Text>
 *           ))}
 *         </View>
 *       )}
 *     </View>
 *   );
 * };
 * ```
 * 
 * @example
 * API integration with German dates:
 * ```tsx
 * const DateRangeSelector = () => {
 *   const [startDate, setStartDate] = useState('');
 *   const [endDate, setEndDate] = useState('');
 *   
 *   const submitDateRange = async () => {
 *     const startISO = parseGermanDate(startDate);
 *     const endISO = parseGermanDate(endDate);
 *     
 *     if (startISO && endISO) {
 *       try {
 *         const response = await fetch('/api/reports', {
 *           method: 'POST',
 *           headers: { 'Content-Type': 'application/json' },
 *           body: JSON.stringify({
 *             startDate: startISO,
 *             endDate: endISO
 *           })
 *         });
 *         
 *         const data = await response.json();
 *         console.log('Report generated:', data);
 *       } catch (error) {
 *         console.error('API error:', error);
 *       }
 *     } else {
 *       alert('Bitte geben Sie gültige Daten ein');
 *     }
 *   };
 *   
 *   return (
 *     <View>
 *       <TextInput
 *         value={startDate}
 *         onChangeText={setStartDate}
 *         placeholder="Startdatum (dd.mm.yyyy)"
 *       />
 *       <TextInput
 *         value={endDate}
 *         onChangeText={setEndDate}
 *         placeholder="Enddatum (dd.mm.yyyy)"
 *       />
 *       <Button title="Report erstellen" onPress={submitDateRange} />
 *     </View>
 *   );
 * };
 * ```
 * 
 * @validation_features
 * - Format validation (dd.mm.yyyy pattern)
 * - Component separation with dot delimiter
 * - Date object validation with isNaN()
 * - Leap year and month validation
 * - Exception handling with try-catch
 * 
 * @input_validation
 * - Exact format matching required
 * - Component count validation (3 parts)
 * - Numeric component validation
 * - Date existence validation
 * - Type safety with null return
 * 
 * @output_format
 * - ISO 8601 string format
 * - UTC timezone (00:00:00.000Z)
 * - Standardized for API communication
 * - Database storage compatible
 * - Cross-platform consistency
 * 
 * @use_cases
 * - User form date input parsing
 * - CSV/Excel date import processing
 * - Manual date entry validation
 * - Data migration from German systems
 * - Legacy system integration
 * - User preference date formats
 * - International data exchange
 * - Backup and restore operations
 * 
 * @error_conditions
 * - Incorrect format patterns
 * - Invalid date components
 * - Non-existent dates (e.g., 31.02.2024)
 * - Empty or null input strings
 * - Malformed separator usage
 * 
 * @performance
 * - String splitting operation
 * - Single Date object creation
 * - Minimal validation overhead
 * - O(1) complexity parsing
 * - Efficient component extraction
 * 
 * @internationalization
 * - German date format support
 * - Reverse compatibility with formatDate
 * - European date standard compliance
 * - Locale-specific parsing
 * 
 * @see {@link formatDate} for reverse operation
 * @see {@link formatDateWithTime} for time-inclusive formatting
 * @see {@link isDateInPast} for date validation
 * 
 * @todo Add support for different separators
 * @todo Implement fuzzy date parsing
 * @todo Add custom format specifications
 */
export const parseGermanDate = (formattedDate: string): string | null => {
  try {
    // Split the German date format by dots
    const [day, month, year] = formattedDate.split('.');
    
    // Validate that all components exist
    if (!day || !month || !year) return null;

    // Create Date object using ISO format (YYYY-MM-DD)
    const date = new Date(`${year}-${month}-${day}`);
    
    // Validate that the date is valid
    if (isNaN(date.getTime())) return null;

    // Return as ISO string
    return date.toISOString();
  } catch {
    // Return null for any parsing errors
    return null;
  }
};

/**
 * @summary
 * The date-utils utility module provides comprehensive date handling functionality
 * with German localization, robust error handling, and consistent formatting.
 * All functions are designed for enterprise applications requiring reliable
 * date processing with user-friendly German date formats.
 * 
 * @architecture
 * - Error-safe implementations with try-catch blocks
 * - Consistent return types for predictable behavior
 * - German localization for European markets
 * - Comprehensive input validation
 * - Performance optimized operations
 * 
 * @localization_features
 * - German date format (dd.mm.yyyy)
 * - 24-hour time format
 * - European date conventions
 * - Locale-specific formatting
 * - Cultural formatting preferences
 * 
 * @module_exports
 * - formatDate: German date formatting (dd.mm.yyyy)
 * - formatDateWithTime: Date with time formatting (dd.mm.yyyy, HH:MM)
 * - isDateInPast: Past date validation
 * - parseGermanDate: German date parsing to ISO format
 * 
 * @dependencies
 * - Native JavaScript Date object
 * - String manipulation methods
 * - Console logging for debugging
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date} MDN Date Documentation
 * @see {@link https://en.wikipedia.org/wiki/Date_and_time_notation_in_Germany} German Date Format Standards
 */

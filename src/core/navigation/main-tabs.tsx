import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from './navigation.types';
import {View, Text} from 'react-native';
// import {t} from 'i18next'; // TODO: Use when implementing translations

const Tab = createBottomTabNavigator<MainTabParamList>();

// Placeholder component until features are implemented
const PlaceholderScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Feature wird entwickelt</Text>
  </View>
);

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="HomeTab"
        component={PlaceholderScreen}
        options={{title: 'Home'}}
      />
      {/* weitere Tabs… */}
    </Tab.Navigator>
  );
}

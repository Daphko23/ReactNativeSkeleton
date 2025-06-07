import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {MainTabParamList} from './navigation.types';
import {View, Text, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/theme.system';
// import {t} from 'i18next'; // TODO: Use when implementing translations

// Feature Navigators
import { ProfileNavigator } from '@features/profile/presentation/navigation/profile.navigator';
import { NotificationCenterScreen } from '@features/notifications/presentation/screens/notification-center.screen';
import { CreditNavigator } from '@features/credits/presentation/navigation/credit.navigator';
import { ThemeDemoScreen } from '@features/profile/presentation/screens/theme-demo/theme-demo.screen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createStackNavigator();

// Enhanced Home Screen with navigation to features
const HomeScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
        <Text style={{fontSize: 28, fontWeight: 'bold', marginBottom: 8, color: theme.colors.text}}>
          Willkommen
        </Text>
        <Text style={{fontSize: 18, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: 40}}>
          ReactNative Skeleton Enterprise App
        </Text>
      
      {/* Quick Actions */}
      <View style={{width: '100%', maxWidth: 300}}>
        
        {/* Theme Demo Access - Direkte Navigation zum ThemeDemoScreen */}
        <TouchableOpacity 
          style={{
            backgroundColor: theme.colors.primary, 
            padding: 16, 
            borderRadius: 12, 
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center'
          }}
          onPress={() => navigation.navigate('ThemeDemo')}
          activeOpacity={0.8}
        >
          <Icon name="color-palette" size={24} color="white" style={{marginRight: 12}} />
          <View style={{flex: 1}}>
            <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>
              Theme Demo
            </Text>
            <Text style={{color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 2}}>
              UI Komponenten testen
            </Text>
          </View>
          <Icon name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>

        {/* Credits Access - Navigation zu CreditNavigator über SettingsTab */}
        <TouchableOpacity 
          style={{
            backgroundColor: theme.colors.warning, 
            padding: 16, 
            borderRadius: 12, 
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center'
          }}
          onPress={() => {
            // Navigation zu SettingsTab (Credits)
            const parentNav = navigation.getParent();
            if (parentNav) {
              parentNav.navigate('SettingsTab');
            }
          }}
          activeOpacity={0.8}
        >
          <Icon name="diamond" size={24} color="white" style={{marginRight: 12}} />
          <View style={{flex: 1}}>
            <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>
              Credits
            </Text>
            <Text style={{color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 2}}>
              Guthaben verwalten
            </Text>
          </View>
          <Icon name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>

        {/* App Info */}
        <View style={{
          backgroundColor: theme.colors.surface, 
          padding: 16, 
          borderRadius: 12, 
          borderWidth: 1, 
          borderColor: theme.colors.border
        }}>
          <Text style={{fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center'}}>
            Clean Architecture • Supabase Backend{'\n'}
            i18n • Theme System • Enterprise Ready
          </Text>
        </View>
      </View>
    </View>
  </SafeAreaView>
  );
};

// Home Navigator mit Stack für HomeScreen und ThemeDemoScreen
const HomeNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          color: theme.colors.text,
        },
      }}
    >
      <HomeStack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
      />
      <HomeStack.Screen 
        name="ThemeDemo" 
        component={ThemeDemoScreen}
        options={{
          headerShown: true,
          title: 'Theme Demo',
          headerBackTitle: 'Zurück',
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            color: theme.colors.text,
          },
        }}
      />
    </HomeStack.Navigator>
  );
};

export default function MainTabNavigator() {
  const { t } = useTranslation();
  const { theme, isDark } = useTheme();
  
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'NotificationsTab':
              iconName = focused ? 'notifications' : 'notifications-outline';
              break;
            case 'SettingsTab':
              iconName = focused ? 'diamond' : 'diamond-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 88, // Etwas höher für bessere Touch-Targets
          paddingHorizontal: 16,
          elevation: 8, // Android shadow
          shadowColor: isDark ? '#000' : '#000', // iOS shadow
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
          color: theme.colors.text,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      })}
    >
      {/* Home Tab - Hauptscreen mit Übersicht */}
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{
          title: t('navigation.tabBar.home'),
          tabBarLabel: t('navigation.tabBar.home'),
        }}
      />

      {/* Profile Tab - Benutzerprofil */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          title: t('navigation.tabBar.profile'),
          tabBarLabel: t('navigation.tabBar.profile'),
        }}
      />

      {/* Notifications Tab - Mitteilungen */}
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationCenterScreen}
        options={{
          title: t('navigation.tabBar.notifications'),
          tabBarLabel: t('navigation.tabBar.notifications'),
        }}
      />

      {/* Settings Tab - Zeigt direkt Credits Navigator */}
      <Tab.Screen
        name="SettingsTab"
        component={CreditNavigator}
        options={{
          title: t('navigation.tabBar.credits'),
          tabBarLabel: t('navigation.tabBar.credits'),
        }}
      />
    </Tab.Navigator>
  );
}




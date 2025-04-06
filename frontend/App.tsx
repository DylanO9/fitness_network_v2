import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './src/screens/HomeScreen';
import MacroTrackerScreen from './src/screens/MacroTrackerScreen';
import WorkoutPlannerScreen from './src/screens/WorkoutPlannerScreen';
import ProgressTrackingScreen from './src/screens/ProgressTrackingScreen';
import CoachingScreen from './src/screens/CoachingScreen';
import WorkoutBuilderScreen from './src/screens/WorkoutBuilderScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  WorkoutBuilder: undefined;
  Login: undefined;
  SignUp: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  MacroTracker: undefined;
  WorkoutPlanner: undefined;
  ProgressTracking: undefined;
  Coaching: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="MacroTracker" 
        component={MacroTrackerScreen} 
        options={{ title: 'Macro Tracker' }}
      />
      <Tab.Screen 
        name="WorkoutPlanner" 
        component={WorkoutPlannerScreen} 
        options={{ title: 'Workout Planner' }}
      />
      <Tab.Screen 
        name="ProgressTracking" 
        component={ProgressTrackingScreen} 
        options={{ title: 'Progress' }}
      />
      <Tab.Screen 
        name="Coaching" 
        component={CoachingScreen} 
        options={{ title: 'Coaching' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {!isAuthenticated ? (
            <>
              <Stack.Screen 
                name="Login" 
                component={LoginScreen} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="SignUp" 
                component={SignUpScreen} 
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <>
              <Stack.Screen 
                name="MainTabs" 
                component={MainTabs} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="WorkoutBuilder" 
                component={WorkoutBuilderScreen} 
                options={{ title: 'Workout Builder' }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

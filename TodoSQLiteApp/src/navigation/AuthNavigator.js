import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import Maintabs from './MainTabs';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    
        
      <Stack.Navigator
        
        screenOptions={{ headerShown: false }}
      >
        {user ? (
          <Stack.Screen name="MainTabs" component={Maintabs} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    
    
  );
};

export default AuthNavigator
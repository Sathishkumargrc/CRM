import React from 'react';
import BottomTabs from '../components/BottomTabs';
import {Login, Welcome_screen} from '../screens';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        header: () => null,
      }}>
      <Stack.Screen name="Welcome" component={Welcome_screen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Landing_bottomTab" component={BottomTabs} />
    </Stack.Navigator>
  );
};

export default AuthStack;

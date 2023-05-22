import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import icons from '../constants/icons';
import Tabs from './Tabs';
import HomeScreen from '../screens/HomeScreen';
import 'react-native-gesture-handler';
import ProfileScreen from '../screens/ProfileScreen';
import ApplyLeaveScreen from '../screens/ApplyLeaveScreen';
import LeaveRequestScreen from '../screens/LeaveRequestScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        header: () => null,
        tabBarStyle: {
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
        },
      }}

      //    sceneContainerStyle into the screen body part
    >
      <Tab.Screen
        name="Home_screen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return <Tabs focused={focused} icons={icons.Rent} />;
          },
        }}
      />
      <Tab.Screen
        name="Calender_screen"
        component={ApplyLeaveScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return <Tabs focused={focused} icons={icons.Calendor} />;
          },
        }}
      />
      <Tab.Screen
        name="File_screen"
        component={LeaveRequestScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return <Tabs focused={focused} icons={icons.File_edit} />;
          },
        }}
      />
      <Tab.Screen
        name="Custom_screen"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return <Tabs focused={focused} icons={icons.Custom} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;

import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native';
import React from 'react'

const DrawerNavigator = () => {

    const Drawer = createDrawerNavigator();

  return (
   <NavigationContainer>
    <Drawer.Navigator>
        <Drawer.Screen />
        <Drawer.Screen />
    </Drawer.Navigator>
   </NavigationContainer>
  )
}

export default DrawerNavigator
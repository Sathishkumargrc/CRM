import React from "react";
import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import BottomTabs from "./src/components/BottomTabs";
import AuthStack from "./src/stacks/AuthStack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash_screen from "./src/screens/Splash_screen";
import { LeaveDetails, Login } from "./src/screens";
import ListAllProjects from "./src/screens/ListAllProjects";
import Training from "./src/screens/Training";
import AddFixedExpenses from "./src/screens/AddFixedExpenses";
import UpdateFixedExpenses from "./src/screens/UpdateFixedExpenses";
import { Provider } from "react-redux";
import store from "./src/redux/Store";
import AddPayments from "./src/screens/AddPayments";
import UpdateReceivedPayments from "./src/screens/UpdateReceivedPayments";
// import PushNotification from "react-native-push-notification";


const Stack = createNativeStackNavigator(); 

const App = () => {
  return(
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        header : () => null
      }} initialRouteName = "Splash" >
        <Stack.Screen name="Splash" component={Splash_screen} />
        {/* Auth stack --> Welcome, Login */}
        <Stack.Screen name="Auth" component={AuthStack} />

        <Stack.Screen name="Login" component={Login} />
       {/* Splash --> Landing BottomTabs */}
        <Stack.Screen name="Landing_bottomTab" component={BottomTabs} />
        <Stack.Screen name='LeaveDetails' component={LeaveDetails} />
        <Stack.Screen name='ListAllProjects' component={ListAllProjects} />
        <Stack.Screen name="Training" component={Training} />
        <Stack.Screen name="AddFixedExpenses" component={AddFixedExpenses} />
        <Stack.Screen name="UpdateFixedExpenses" component={UpdateFixedExpenses} />
        <Stack.Screen name="AddPayments" component={AddPayments} />
        <Stack.Screen name="UpdateReceivedPayments" component={UpdateReceivedPayments} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  )
}

export default App;
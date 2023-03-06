import React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';
import Onboarding from './src/components/Onboard';
import Login from './src/components/Login';
import Register from './src/components/Register';
import Forgot from './src/components/Forgot';
import Account from './src/components/Account';
import Chats from './src/components/Chats';
import Contacts from './src/components/Contacts';

// Assists with app navigation
const Stack = createStackNavigator();
LogBox.ignoreAllLogs(true);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Login" component={Login} options={{
          ...TransitionPresets.ScaleFromCenterAndroid,
        }} />
        <Stack.Screen name="Register" component={Register} options={{
          ...TransitionPresets.ModalTransition,
        }} />
        <Stack.Screen name="Forgot" component={Forgot} />
        <Stack.Screen name="Account" component={Account} options={{
          ...TransitionPresets.ScaleFromCenterAndroid,
        }} />
        <Stack.Screen name="Chats" component={Chats} options={{
          ...TransitionPresets.ModalFadeTransition,
        }} />
        <Stack.Screen name="Contacts" component={Contacts} options={{
          ...TransitionPresets.ModalFadeTransition,
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

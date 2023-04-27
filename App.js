import React, {useState, useEffect} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage'
import Requests from './src/components/Requests';
import Chat from './src/components/Chat';
import { authentication } from './firebase';

// We currently have 388 prompts stored in firebase


// Assists with app navigation
const Stack = createStackNavigator();
LogBox.ignoreAllLogs(true);

const App = () => {
  const [firstTimeLaunched, setFirstTimeLaunched] = React.useState(null);
  const [signedIn, setSignedIn] = useState(false);
 

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setFirstTimeLaunched(true);
      } else {
        setFirstTimeLaunched(false);
      }
    });
  }, []);

  if (firstTimeLaunched === null) {
    return null;
  } else if (firstTimeLaunched) {
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
          <Stack.Screen name="Requests" component={Requests} />
          <Stack.Screen name="Chats" component={Chats} options={{
            ...TransitionPresets.ModalFadeTransition, title: "Chats"
          }} />
          <Stack.Screen name="Chat" component={Chat} options={{
          ...TransitionPresets.ModalFadeTransition, title: 'Chat'
        }} />
          <Stack.Screen name="Contacts" component={Contacts} options={{
            ...TransitionPresets.ModalFadeTransition,
          }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else { // this is not their first time launching the app
    // will return login screen every time. Have to account for logged in user.
    return (
      <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
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
        <Stack.Screen name="Requests" component={Requests} />
        <Stack.Screen name="Chats" component={Chats} options={{
          ...TransitionPresets.ModalFadeTransition, title: 'Chats'
        }} />
        <Stack.Screen name="Chat" component={Chat} options={{
          ...TransitionPresets.ModalFadeTransition, title: 'Chat'
        }} />
        <Stack.Screen name="Contacts" component={Contacts} options={{
          ...TransitionPresets.ModalFadeTransition,
        }} />
      </Stack.Navigator>
    </NavigationContainer>
    );
  }
};

export default App;

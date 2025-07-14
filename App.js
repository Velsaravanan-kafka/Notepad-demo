import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './Screens/Homepage';
import Brocode from './Screens/Normal';
import Notes from './Screens/Notes';
import Practice from './Screens/Practice';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Profile" component={Brocode}/>
        <Stack.Screen name="Notes" component={Notes}/>
        <Stack.Screen name = "Practice" component={Practice}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

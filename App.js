import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RentScreen from './components/RentScreen';
import UserScreen from './components/UserScreen';
import CarScreen from './components/CarScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='UserScreen'>
        <Stack.Screen name="UserScreen" component={UserScreen} options={{title:'Inicio de Sesión'}} />
        <Stack.Screen name="CarScreen" component={CarScreen} options={{title:'Lista de Carros'}} />
        <Stack.Screen name="RentScreen" component={RentScreen} options={{title:'Rentar Carros'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

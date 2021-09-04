import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppScreen from './app/AppScreen';

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <AppScreen />
      </NavigationContainer>
    );
  }
}

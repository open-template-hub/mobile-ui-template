import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppScreen from './app/app.screen';

export default class App extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <NavigationContainer>
        <AppScreen />
      </NavigationContainer>
    );
  }
}

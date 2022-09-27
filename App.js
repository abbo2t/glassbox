import { StatusBar } from 'expo-status-bar';
import {Appearance, StyleSheet, Text, View, Button, LogBox} from 'react-native';
import {useEffect, useState} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PuzzleOne from './components/PuzzleOne';
import PuzzleTwentyThree from './components/PuzzleTwentyThree';
import PuzzleEighteen from './components/PuzzleEighteen';


const Stack = createNativeStackNavigator();

const originalColorScheme = 'light';

const respondToAppearanceChange = (setSolved, setColorSchemeHasChanged) => {
  console.log('yooooo');
  if (Appearance.getColorScheme() !== originalColorScheme) {
    setColorSchemeHasChanged(true);
  } else {
    setSolved(true);
  }
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PuzzleOne" component={PuzzleOne} />
        <Stack.Screen name="PuzzleTwentyThree" component={PuzzleTwentyThree} />
        <Stack.Screen name="PuzzleEighteen" component={PuzzleEighteen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({ navigation }) => {
  return (
    <>
    <Button
      title="Go to first puzzle"
      onPress={() =>
        navigation.navigate('PuzzleOne', { respondToAppearanceChange: respondToAppearanceChange })
      }
    />
    <Button
      title="Go to 23rd puzzle"
      onPress={() =>
        navigation.navigate('PuzzleTwentyThree', { name: '' })
      }
    />
    <Button
      title="Go to 18th puzzle"
      onPress={() =>
        navigation.navigate('PuzzleEighteen', { name: '' })
      }
    />
    </>
  );
};


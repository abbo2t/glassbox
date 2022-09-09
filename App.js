import { StatusBar } from 'expo-status-bar';
import {Appearance, StyleSheet, Text, View, Button} from 'react-native';
import {useEffect, useState} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PuzzleOne from './components/PuzzleOne';
import PuzzleTwentyThree from './components/PuzzleTwentyThree';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PuzzleOne" component={PuzzleOne} />
        <Stack.Screen name="PuzzleTwentyThree" component={PuzzleTwentyThree} />
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
        navigation.navigate('PuzzleOne', { name: '' })
      }
    />
    <Button
      title="Go to 23rd puzzle"
      onPress={() =>
        navigation.navigate('PuzzleTwentyThree', { name: '' })
      }
    />
    </>
  );
};


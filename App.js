import { StatusBar } from 'expo-status-bar';
import {Appearance, StyleSheet, Text, View, Button} from 'react-native';
import {useEffect, useState} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PuzzleOneScreen" component={PuzzleOneScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const HomeScreen = ({ navigation }) => {
  return (
    <Button
      title="Go to first puzzle"
      onPress={() =>
        navigation.navigate('PuzzleOneScreen', { name: '' })
      }
    />
  );
};
const PuzzleOneScreen = ({ navigation, route }) => {
  const [solved, setSolved] = useState(false);
  const [colorSchemeHasChanged, setColorSchemeHasChanged] = useState(false);

  useEffect(() => {
    const originalColorScheme = Appearance.getColorScheme();

    Appearance.addChangeListener(() => {
      if (Appearance.getColorScheme() !== originalColorScheme) {
        setColorSchemeHasChanged(true);
      } else {
        setSolved(true);
      }
    });
  }, []);
  return (
  <View style={styles.container}>
    <Text>{colorSchemeHasChanged  && !solved ? ' almost there!' : ''} {solved ? 'nice!' : 'good luck!'}</Text>
    <StatusBar style="auto" />
  </View>
  )
};

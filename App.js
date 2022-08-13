import { StatusBar } from 'expo-status-bar';
import {Appearance, StyleSheet, Text, View} from 'react-native';
import {useEffect, useState} from "react";

export default function App() {
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

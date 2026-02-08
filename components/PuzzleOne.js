import { StatusBar } from 'expo-status-bar';
import { Appearance, StyleSheet, Text, View, Button} from 'react-native';
import {useEffect, useState} from "react";

const PuzzleOne = ({ navigation, route }) => {
    const [solved, setSolved] = useState(false);
    const [colorSchemeHasChanged, setColorSchemeHasChanged] = useState(false);
  
    useEffect(() => {
      const originalColorScheme = Appearance.getColorScheme();
      console.log('Original color scheme:', originalColorScheme);
      const listener = Appearance.addChangeListener(({ colorScheme }) => {
        console.log('Color scheme changed:', colorScheme);
        if (colorScheme && colorScheme !== originalColorScheme) {
          setColorSchemeHasChanged(true);
        } else if (colorScheme && colorScheme === originalColorScheme) {
          setSolved(true);
        }
      });
      return () => {
        if (listener && typeof listener.remove === 'function') {
          listener.remove();
        }
      };
    }, []);
    return (
    <View style={styles.container}>
      <Text>{colorSchemeHasChanged  && !solved ? ' almost there!' : ''} {solved ? 'nice!' : 'good luck!'}</Text>
      <StatusBar style="auto" />
    </View>
    )
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  export default PuzzleOne;
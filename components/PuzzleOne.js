import { StatusBar } from 'expo-status-bar';
import { Appearance, StyleSheet, Text, View, Button} from 'react-native';
import {useEffect, useState} from "react";

const PuzzleOne = (props) => {
    const [solved, setSolved] = useState(false);
    const [colorSchemeHasChanged, setColorSchemeHasChanged] = useState(false);
  
    useEffect(() => {
      Appearance.addChangeListener(() => props.respondToAppearanceChange(setSolved, setColorSchemeHasChanged));
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
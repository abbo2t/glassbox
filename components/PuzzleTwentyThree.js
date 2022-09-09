import { StatusBar } from 'expo-status-bar';
import { Appearance, StyleSheet, Text, View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {useEffect, useState} from "react";
import Ionicons from '@expo/vector-icons/Ionicons';

const PuzzleTwentyThree = ({ navigation, route }) => {
    const [solved, setSolved] = useState(false);
    const [connectionType, setConnectionType] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [hasBeenConnected, setHasBeenConnected] = useState(false);
    let hasForSureBeenConnected = false;
  
    useEffect(() => {

        NetInfo.fetch().then(state => {
            if (false !== state.isConnected) {
                console.log('connected  initially')
                setHasBeenConnected(true);
                hasForSureBeenConnected = true;
            }
        });

        const unsubscribe = NetInfo.addEventListener(state => {
            setConnectionType(state.type);
            setIsConnected(state.isConnected);

            if (false === state.isConnected && hasForSureBeenConnected) {
                setSolved(true);
            }

            if (state.isConnected) {
                setHasBeenConnected(true);
                hasForSureBeenConnected = true;
            }
        });
        
        // To unsubscribe to these update, just use:
        //unsubscribe();
    }, []);
    return (
    <View style={styles.container}>
      <Text>{connectionType !== 'none' ? (connectionType == 'wifi' ? <Ionicons name="md-wifi-outline" size={64} color="green" /> : <Ionicons name="md-cellular-outline" size={64} color="green" />) : ''}</Text>
      <Text>{solved ? 'Way to go!' : ''}</Text>
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

  export default PuzzleTwentyThree;
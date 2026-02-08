import { StatusBar } from 'expo-status-bar';
import { Appearance, StyleSheet, Text, View, Button } from 'react-native';
import { useEffect, useState } from "react";
import * as ScreenCapture from 'expo-screen-capture';
import * as MediaLibrary from 'expo-media-library';

const PuzzleEighteen = ({ navigation, route }) => {
  // VolumeManager is not available in Expo managed workflow.
  // The volume puzzle is currently disabled.
  return (
    <View style={styles.container}>
      <Text>Volume puzzle is not available in Expo Go.</Text>
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

const [voluumeHasBeenMaxedOut] = useState(false);
  const [screenshotHasBeenTaken, setScreenshotHasBeenTaken] = useState(false);
  const [headphonesHaveBeenConnected, setHeadphonesHaveBeenConnected] = useState(false);
  let hasZeroedVolumeOut = false;
  let hasMaxedVolumeOut = false;
  let hasTakenScreenshot = false;
  let hasConnectedHeadphones = false;

  useEffect(() => {
    const volumeListener = VolumeManager.addVolumeListener((result) => {
      // returns the current volume as a float (0-1)
      console.log(result.volume);


      if (Math.round(result.volume * 1000) == 0) {
        hasZeroedVolumeOut = true;
        setVolumeHasBeenZeroedOut(true);
      }
      if (Math.round(result.volume * 1000) == 1000) {
        hasMaxedVolumeOut = true;
        setVolumeHasBeenMaxedOut(true);
      }

      // on android, the result object will also have the keys
      // music, system, ring, alarm, notification
    });

    // const { status } = await MediaLibrary.requestPermissionsAsync();
    // if (status === 'granted') {
    //   ScreenCapture.addScreenshotListener(() => {
    //     alert('Thanks for screenshotting my beautiful app 😊');
    //     hasTakenScreenshot = true;
    //     setScreenshotHasBeenTaken(true);
    //   });
    // }

    deviceInfoEmitter.addListener('RNDeviceInfo_headphoneConnectionDidChange', (result) => {
      console.log(result);
    });

    // HeadphoneDetection.addListener((s) => {
    //   if (s.audioJack || s.bluetooth) {
    //     setHeadphonesHaveBeenConnected(true);
    //     hasConnectedHeadphones = true;
    //   }
    // });



    // clean up function
    return function () {
      // remove listener, just call .remove on the volumeListener
      // EventSubscription. Never forget to clean up your listeners.
      volumeListener.remove();
    }
  }, []);
  return (
    <View style={styles.container}>
      <Text>{ !(hasConnectedHeadphones && hasMaxedVolumeOut && hasTakenScreenshot && hasZeroedVolumeOut) ? 'good luck!' : '🎉'}</Text>
      <Text>{volumeHasBeenZeroedOut ? '🔇✅' : ''}</Text>
      <Text>{volumeHasBeenMaxedOut ? '🔊✅' : ''}</Text>
      <Text>{screenshotHasBeenTaken ? '📸✅' : ''}</Text>
      <Text>{headphonesHaveBeenConnected ? '🎧✅' : ''}</Text>
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

export default PuzzleEighteen;export default PuzzleEighteen;
import { StatusBar } from 'expo-status-bar';
import { Appearance, StyleSheet, Text, View, Button, NativeEventEmitter, NativeModules } from 'react-native';
import { useEffect, useState } from "react";
import * as ScreenCapture from 'expo-screen-capture';
import * as MediaLibrary from 'expo-media-library';
//import HeadphoneDetection from 'react-native-headphone-detection';
//import { getUniqueId, getManufacturer } from 'react-native-device-info';
//import { useIsHeadphonesConnected } from 'react-native-device-info';

let deviceInfoEmitter = null;
if (NativeModules.RNDeviceInfo) {
  deviceInfoEmitter = new NativeEventEmitter(NativeModules.RNDeviceInfo);
}

let VolumeManager = null;
try {
  // Optional dependency: keep puzzle/test runtime stable if the native module is absent.
  const volumeManagerModule = require('react-native-volume-manager');
  VolumeManager = volumeManagerModule?.VolumeManager ?? null;
} catch (error) {
  VolumeManager = null;
}

const PuzzleEighteen = ({ navigation, route }) => {
  const [solved, setSolved] = useState(false);
  const [volumeHasBeenZeroedOut, setVolumeHasBeenZeroedOut] = useState(false);
  const [volumeHasBeenMaxedOut, setVolumeHasBeenMaxedOut] = useState(false);
  const [screenshotHasBeenTaken, setScreenshotHasBeenTaken] = useState(false);
  const [headphonesHaveBeenConnected, setHeadphonesHaveBeenConnected] = useState(false);
  let hasZeroedVolumeOut = false;
  let hasMaxedVolumeOut = false;
  let hasTakenScreenshot = false;
  let hasConnectedHeadphones = false;

  useEffect(() => {
    const volumeListener = VolumeManager?.addVolumeListener((result) => {
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

    const headphoneListener = deviceInfoEmitter?.addListener('RNDeviceInfo_headphoneConnectionDidChange', (result) => {
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
      if (volumeListener && typeof volumeListener.remove === 'function') {
        volumeListener.remove();
      }
      if (headphoneListener && typeof headphoneListener.remove === 'function') {
        headphoneListener.remove();
      }
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

export default PuzzleEighteen;
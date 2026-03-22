import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LightSensor } from 'expo-sensors';

const REQUIRED_DARK_MS = 10000;
const MAX_DARK_MS = 20000;
const DARK_THRESHOLD_LUX = 5;
const IOS_CAPTURE_INTERVAL_MS = 800;
const IOS_DARK_BASE64_MAX = 3000;
const COLOR_PALETTE = ['#E63946', '#FF9F1C', '#2A9D8F', '#3A86FF', '#8338EC'];

const getRandomColor = () => {
  const index = Math.floor(Math.random() * COLOR_PALETTE.length);
  return COLOR_PALETTE[index];
};

const PuzzleThirteen = () => {
  const usesCameraFlow = Platform.OS === 'ios';
  const cameraRef = useRef(null);
  const inFlightCaptureRef = useRef(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [sensorState, setSensorState] = useState('checking');
  const [holdMs, setHoldMs] = useState(0);
  const [armed, setArmed] = useState(false);
  const [solved, setSolved] = useState(false);
  const [fillColor, setFillColor] = useState('#111111');
  const [hintText, setHintText] = useState('');

  const darkStartRef = useRef(null);
  const armedRef = useRef(false);
  const solvedRef = useRef(false);

  const resetAttempt = (hint = '') => {
    darkStartRef.current = null;
    armedRef.current = false;
    setArmed(false);
    setHoldMs(0);
    setHintText(hint);
  };

  const progressPercent = useMemo(() => {
    const percent = Math.floor((holdMs / REQUIRED_DARK_MS) * 100);
    return Math.min(percent, 100);
  }, [holdMs]);

  const solve = () => {
    if (solvedRef.current) {
      return;
    }

    solvedRef.current = true;
    setFillColor(getRandomColor());
    setSolved(true);
  };

  const handleDarknessSample = (isDarkFrame) => {
    const now = Date.now();

    if (isDarkFrame) {
      if (darkStartRef.current === null) {
        darkStartRef.current = now;
        setHintText('Keep covering the lens...');
      }

      const elapsed = now - darkStartRef.current;
      setHoldMs(elapsed);

      if (elapsed > MAX_DARK_MS) {
        resetAttempt('Too long. Uncover and try again.');
        return;
      }

      if (elapsed >= REQUIRED_DARK_MS && !armedRef.current) {
        armedRef.current = true;
        setArmed(true);
        setHintText('Ready: uncover now');
      }

      return;
    }

    if (darkStartRef.current === null) {
      return;
    }

    const elapsed = now - darkStartRef.current;

    if (armedRef.current && elapsed >= REQUIRED_DARK_MS && elapsed <= MAX_DARK_MS) {
      solve();
      return;
    }

    if (elapsed < REQUIRED_DARK_MS) {
      resetAttempt('Not long enough. Cover lens for at least 10 seconds.');
      return;
    }

    resetAttempt('Try again.');
  };

  useEffect(() => {
    if (!usesCameraFlow || solvedRef.current || !cameraReady || !permission?.granted) {
      return;
    }

    let mounted = true;

    const captureAndAnalyze = async () => {
      if (!mounted || inFlightCaptureRef.current || !cameraRef.current || solvedRef.current) {
        return;
      }

      inFlightCaptureRef.current = true;
      try {
        const snapshot = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.05,
          skipProcessing: true,
          shutterSound: false,
        });

        if (!mounted || solvedRef.current) {
          return;
        }

        const base64Length = typeof snapshot?.base64 === 'string' ? snapshot.base64.length : Number.MAX_SAFE_INTEGER;
        const isDarkFrame = base64Length <= IOS_DARK_BASE64_MAX;
        handleDarknessSample(isDarkFrame);
      } catch (error) {
        if (mounted) {
          setSensorState('error');
        }
      } finally {
        inFlightCaptureRef.current = false;
      }
    };

    const intervalId = setInterval(captureAndAnalyze, IOS_CAPTURE_INTERVAL_MS);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [cameraReady, permission?.granted, usesCameraFlow]);

  useEffect(() => {
    if (!usesCameraFlow) {
      return;
    }

    if (!permission) {
      return;
    }

    if (permission.granted) {
      setSensorState('ready');
      return;
    }

    setSensorState('permission-needed');
  }, [permission, usesCameraFlow]);

  useEffect(() => {
    if (!usesCameraFlow || permission?.granted || !permission?.canAskAgain) {
      return;
    }

    requestPermission();
  }, [permission?.granted, permission?.canAskAgain, requestPermission, usesCameraFlow]);

  useEffect(() => {
    if (usesCameraFlow) {
      return;
    }

    let mounted = true;
    let lightSubscription = null;

    const handleLightReading = ({ illuminance }) => {
      if (typeof illuminance !== 'number' || !mounted || solvedRef.current) {
        return;
      }

      const now = Date.now();

      if (illuminance <= DARK_THRESHOLD_LUX) {
        if (darkStartRef.current === null) {
          darkStartRef.current = now;
        }

        const elapsed = now - darkStartRef.current;
        setHoldMs(elapsed);

        if (elapsed >= REQUIRED_DARK_MS && !armedRef.current) {
          armedRef.current = true;
          setArmed(true);
        }

        return;
      }

      darkStartRef.current = null;
      setHoldMs(0);

      if (armedRef.current) {
        solve();
      }
    };

    const startSensor = async () => {
      try {
        const available = await LightSensor.isAvailableAsync();

        if (!mounted) {
          return;
        }

        if (!available) {
          setSensorState('unavailable');
          return;
        }

        setSensorState('ready');
        LightSensor.setUpdateInterval(500);
        lightSubscription = LightSensor.addListener(handleLightReading);
      } catch (error) {
        setSensorState('error');
      }
    };

    startSensor();

    return () => {
      mounted = false;
      if (lightSubscription && typeof lightSubscription.remove === 'function') {
        lightSubscription.remove();
      }
    };
  }, [usesCameraFlow]);

  if (solved) {
    return (
      <View style={[styles.container, { backgroundColor: fillColor }]}>
        <Text style={styles.solvedTitle}>Puzzle Solved</Text>
        <Text style={styles.solvedSubtitle}>You held darkness long enough.</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Puzzle 13</Text>
      {usesCameraFlow ? (
        <>
          <Text style={styles.copy}>
            Cover your front camera lens for 10-20 seconds, then uncover it.
          </Text>
          <Text style={styles.progress}>Dark hold: {(holdMs / 1000).toFixed(1)}s</Text>
          <Text style={styles.status}>Target window: 10.0s to 20.0s</Text>
          {sensorState === 'permission-needed' && (
            <>
              <Text style={styles.help}>Camera permission is required for this puzzle.</Text>
              <Button title="Allow camera" onPress={requestPermission} />
            </>
          )}
          {permission?.granted && (
            <CameraView
              ref={cameraRef}
              style={styles.cameraProbe}
              facing="front"
              onCameraReady={() => setCameraReady(true)}
            />
          )}
          {hintText ? <Text style={styles.help}>{hintText}</Text> : null}
        </>
      ) : (
        <>
          <Text style={styles.copy}>
            Cover the top front of your phone for about 10 seconds, then uncover it.
          </Text>
          <Text style={styles.progress}>Dark hold progress: {progressPercent}%</Text>
          <Text style={styles.status}>
            {armed ? 'Ready: uncover now' : 'Waiting for sustained darkness'}
          </Text>
        </>
      )}
      {sensorState === 'checking' && <Text style={styles.help}>Checking sensor availability...</Text>}
      {sensorState === 'unavailable' && (
        <Text style={styles.help}>Ambient light sensor is unavailable on this device.</Text>
      )}
      {sensorState === 'error' && (
        <Text style={styles.help}>Unable to read sensor data. Please try again.</Text>
      )}
      <StatusBar style="dark" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#f4f3ee',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2933',
  },
  copy: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    color: '#334e68',
  },
  progress: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#102a43',
  },
  status: {
    fontSize: 15,
    fontWeight: '600',
    color: '#486581',
  },
  help: {
    marginTop: 10,
    textAlign: 'center',
    color: '#9c6644',
  },
  cameraProbe: {
    width: 2,
    height: 2,
    opacity: 0,
  },
  solvedTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
  },
  solvedSubtitle: {
    marginTop: 8,
    fontSize: 18,
    color: '#ffffff',
  },
});

export default PuzzleThirteen;

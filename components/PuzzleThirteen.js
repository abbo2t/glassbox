import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Platform, StyleSheet, Text, View } from 'react-native';
import { LightSensor } from 'expo-sensors';

const REQUIRED_DARK_MS = 10000;
const MAX_DARK_MS = 20000;
const DARK_THRESHOLD_LUX = 5;
const COLOR_PALETTE = ['#E63946', '#FF9F1C', '#2A9D8F', '#3A86FF', '#8338EC'];

const getRandomColor = () => {
  const index = Math.floor(Math.random() * COLOR_PALETTE.length);
  return COLOR_PALETTE[index];
};

const PuzzleThirteen = () => {
  const usesScreenOffFlow = Platform.OS === 'ios';
  const [sensorState, setSensorState] = useState('checking');
  const [holdMs, setHoldMs] = useState(0);
  const [armed, setArmed] = useState(false);
  const [solved, setSolved] = useState(false);
  const [fillColor, setFillColor] = useState('#111111');

  const darkStartRef = useRef(null);
  const screenOffStartRef = useRef(null);
  const armedRef = useRef(false);
  const solvedRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);

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

  useEffect(() => {
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

    const handleAppStateChange = (nextState) => {
      const previous = appStateRef.current;
      const now = Date.now();

      if (usesScreenOffFlow) {
        if (previous === 'active' && nextState !== 'active') {
          screenOffStartRef.current = now;
        }

        if (previous !== 'active' && nextState === 'active') {
          const startedAt = screenOffStartRef.current;
          screenOffStartRef.current = null;

          if (typeof startedAt === 'number') {
            const elapsed = now - startedAt;
            setHoldMs(elapsed);

            if (elapsed >= REQUIRED_DARK_MS && elapsed <= MAX_DARK_MS && !solvedRef.current) {
              solve();
            }
          }
        }
      } else {
        const wasBackgrounded = previous !== 'active' && nextState === 'active';
        if (wasBackgrounded && armedRef.current && !solvedRef.current) {
          solve();
        }
      }

      appStateRef.current = nextState;
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    const startSensor = async () => {
      if (usesScreenOffFlow) {
        setSensorState('ready');
        return;
      }

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
      if (appStateSubscription && typeof appStateSubscription.remove === 'function') {
        appStateSubscription.remove();
      }
    };
  }, []);

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
      {usesScreenOffFlow ? (
        <>
          <Text style={styles.copy}>
            Turn your screen off for 10-20 seconds, then turn it back on.
          </Text>
          <Text style={styles.progress}>Last off duration: {(holdMs / 1000).toFixed(1)}s</Text>
          <Text style={styles.status}>Target window: 10.0s to 20.0s</Text>
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

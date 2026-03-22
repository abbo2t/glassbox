import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';

const COLOR_PALETTE = ['#E63946', '#FF9F1C', '#2A9D8F', '#3A86FF', '#8338EC'];
const getRandomColor = () => COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];

const PuzzleFifteen = () => {
  const solvedRef = useRef(false);
  const [solved, setSolved] = useState(false);
  const [fillColor, setFillColor] = useState('#111111');
  const [listenerAvailable, setListenerAvailable] = useState(true);
  const [hintVisible, setHintVisible] = useState(false);

  useEffect(() => {
    let subscription = null;

    try {
      subscription = ScreenCapture.addScreenshotListener(() => {
        if (solvedRef.current) return;
        solvedRef.current = true;
        setFillColor(getRandomColor());
        setSolved(true);
      });

      if (!subscription) {
        setListenerAvailable(false);
      }
    } catch {
      setListenerAvailable(false);
    }

    return () => {
      subscription?.remove();
    };
  }, []);

  if (solved) {
    return (
      <View style={[styles.container, { backgroundColor: fillColor }]}>
        <Text style={styles.solvedTitle}>Puzzle Solved</Text>
        <Text style={styles.solvedSubtitle}>Nice screenshot.</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Puzzle 15</Text>
      {!listenerAvailable && (
        <Text style={styles.copy}>Screenshot detection is not available on this device.</Text>
      )}
      {listenerAvailable && hintVisible && (
        <Text style={styles.copy}>Take a screenshot to solve this puzzle.</Text>
      )}
      {listenerAvailable && !hintVisible && (
        <Text style={styles.hint} onPress={() => setHintVisible(true)}>hint</Text>
      )}
      <StatusBar style="dark" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f3ee',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
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
  hint: {
    marginTop: 12,
    fontSize: 13,
    color: '#9c6644',
    textDecorationLine: 'underline',
  },
});

export default PuzzleFifteen;

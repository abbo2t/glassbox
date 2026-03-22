import { StatusBar } from 'expo-status-bar';
import { DeviceMotion } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const COLOR_PALETTE = ['#E63946', '#FF9F1C', '#2A9D8F', '#3A86FF', '#8338EC'];
const getRandomColor = () => COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];

const RAD_TO_DEG = 180 / Math.PI;
const LEVEL_TOL = 2.0;
const FACE_TOL = 0.9;

const isNear = (value, target, tol) => Math.abs(value - target) <= tol;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const CIRCLE_SIZE = 220;
const BUBBLE_SIZE = 28;
const MAX_OFFSET = (CIRCLE_SIZE - BUBBLE_SIZE) / 2 - 8;

const PuzzleLevel = () => {
  const solvedRef = useRef(false);
  const [solved, setSolved] = useState(false);
  const [fillColor, setFillColor] = useState('#111111');
  const [hintVisible, setHintVisible] = useState(false);

  // bubble position in px
  const [bubbleX, setBubbleX] = useState(0);
  const [bubbleY, setBubbleY] = useState(0);

  const [achievements, setAchievements] = useState({
    level: false,    // flat, face up, portrait
    right: false,    // rotated 90° right
    upsideDown: false, // rotated 180°
    faceUp: false,   // lying flat face up
    faceDown: false, // lying flat face down
  });

  useEffect(() => {
    DeviceMotion.setUpdateInterval(60);

    const sub = DeviceMotion.addListener(({ rotation, accelerationIncludingGravity }) => {
      if (solvedRef.current) return;
      const gravity = accelerationIncludingGravity;
      if (!gravity) return;

      const { x, y, z } = gravity;
      const roll  = Math.atan2(y, z) * RAD_TO_DEG;
      const pitch = Math.atan2(-x, Math.sqrt(y * y + z * z)) * RAD_TO_DEG;
      const faceUp   = z >  FACE_TOL;
      const faceDown = z < -FACE_TOL;

      const bx = clamp((roll  / 35) * MAX_OFFSET, -MAX_OFFSET, MAX_OFFSET);
      const by = clamp((pitch / 35) * MAX_OFFSET, -MAX_OFFSET, MAX_OFFSET);
      setBubbleX(bx);
      setBubbleY(by);

      setAchievements((prev) => {
        const next = {
          level:      prev.level      || (isNear(roll, 0, LEVEL_TOL) && isNear(pitch, 0, LEVEL_TOL)),
          right:      prev.right      || (isNear(Math.abs(roll), 90, LEVEL_TOL) && isNear(pitch, 0, LEVEL_TOL)),
          upsideDown: prev.upsideDown || (isNear(Math.abs(roll), 180, LEVEL_TOL) && isNear(pitch, 0, LEVEL_TOL)),
          faceUp:     prev.faceUp     || faceUp,
          faceDown:   prev.faceDown   || faceDown,
        };

        if (!solvedRef.current && Object.values(next).every(Boolean)) {
          solvedRef.current = true;
          setFillColor(getRandomColor());
          setSolved(true);
        }

        return next;
      });
    });

    return () => sub.remove();
  }, []);

  const totalDone = Object.values(achievements).filter(Boolean).length;

  if (solved) {
    return (
      <View style={[styles.container, { backgroundColor: fillColor }]}>
        <Text style={styles.solvedTitle}>Puzzle Solved</Text>
        <Text style={styles.solvedSubtitle}>You found every angle.</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Puzzle 1–6</Text>

      <View style={styles.circle}>
        <View style={styles.crossV} />
        <View style={styles.crossH} />
        <View
          style={[
            styles.bubble,
            { transform: [{ translateX: bubbleX }, { translateY: bubbleY }] },
          ]}
        />
      </View>

      <View style={styles.dotsRow}>
        {Object.values(achievements).map((done, i) => (
          <View key={i} style={[styles.dot, done && styles.dotDone]} />
        ))}
      </View>

      {!hintVisible && (
        <Text style={styles.hint} onPress={() => setHintVisible(true)}>hint</Text>
      )}
      {hintVisible && (
        <Text style={styles.copy}>Rotate your phone into every orientation.</Text>
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
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2933',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 1.5,
    borderColor: '#c8c5bc',
    backgroundColor: '#eceae3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossV: {
    position: 'absolute',
    width: 1,
    height: CIRCLE_SIZE - 40,
    backgroundColor: '#c8c5bc',
  },
  crossH: {
    position: 'absolute',
    height: 1,
    width: CIRCLE_SIZE - 40,
    backgroundColor: '#c8c5bc',
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    backgroundColor: '#334e68',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#c8c5bc',
  },
  dotDone: {
    backgroundColor: '#334e68',
  },
  copy: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    color: '#334e68',
  },
  hint: {
    fontSize: 13,
    color: '#9c6644',
    textDecorationLine: 'underline',
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

export default PuzzleLevel;

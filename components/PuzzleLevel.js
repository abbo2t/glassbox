import { StatusBar } from 'expo-status-bar';
import { DeviceMotion } from 'expo-sensors';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const RAD_TO_DEG = 180 / Math.PI;
const LEVEL_TOL = 2.0;
const FACE_TOL = 0.9;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const isNear = (value, target, tol) => Math.abs(value - target) <= tol;

const PuzzleLevel = () => {
  const [roll, setRoll] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [faceUp, setFaceUp] = useState(false);
  const [faceDown, setFaceDown] = useState(false);
  const [achievements, setAchievements] = useState({
    level: false,
    right: false,
    upsideDown: false,
    up: false,
    down: false,
  });

  useEffect(() => {
    DeviceMotion.setUpdateInterval(80);
    const subscription = DeviceMotion.addListener((data) => {
      const gravity = data.accelerationIncludingGravity;
      if (!gravity) {
        return;
      }

      const { x, y, z } = gravity;
      const nextRoll = Math.atan2(y, z) * RAD_TO_DEG;
      const nextPitch = Math.atan2(-x, Math.sqrt(y * y + z * z)) * RAD_TO_DEG;
      const nextFaceUp = z > FACE_TOL;
      const nextFaceDown = z < -FACE_TOL;

      setRoll(nextRoll);
      setPitch(nextPitch);
      setFaceUp(nextFaceUp);
      setFaceDown(nextFaceDown);

      setAchievements((prev) => ({
        level: prev.level || (isNear(nextRoll, 0, LEVEL_TOL) && isNear(nextPitch, 0, LEVEL_TOL)),
        right:
          prev.right ||
          (isNear(Math.abs(nextRoll), 90, LEVEL_TOL) && isNear(nextPitch, 0, LEVEL_TOL)),
        upsideDown:
          prev.upsideDown ||
          (isNear(Math.abs(nextRoll), 180, LEVEL_TOL) && isNear(nextPitch, 0, LEVEL_TOL)),
        up: prev.up || nextFaceUp,
        down: prev.down || nextFaceDown,
      }));
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const solved =
    achievements.level &&
    achievements.right &&
    achievements.upsideDown &&
    achievements.up &&
    achievements.down;

  const bubbleOffset = useMemo(() => {
    const maxOffset = (CIRCLE_SIZE - BUBBLE_SIZE) / 2 - 6;
    const x = clamp((roll / 35) * maxOffset, -maxOffset, maxOffset);
    const y = clamp((pitch / 35) * maxOffset, -maxOffset, maxOffset);
    return { x, y };
  }, [roll, pitch]);

  return (
    <View style={styles.container}>
      <View style={styles.levelWrapper}>
        <View style={styles.circle}>
          <View style={styles.crossVertical} />
          <View style={styles.crossHorizontal} />
          <View
            style={[
              styles.bubble,
              { transform: [{ translateX: bubbleOffset.x }, { translateY: bubbleOffset.y }] },
            ]}
          />
        </View>
        <View style={styles.readout}>
          <Text style={styles.angleText}>Roll {roll.toFixed(1)}
          </Text>
          <Text style={styles.angleText}>Pitch {pitch.toFixed(1)}
          </Text>
        </View>
      </View>

      <View style={styles.checklist}>
        <Text style={styles.checkItem}>{achievements.level ? '✓' : '○'} 0° level</Text>
        <Text style={styles.checkItem}>{achievements.right ? '✓' : '○'} 90° right edge</Text>
        <Text style={styles.checkItem}>{achievements.upsideDown ? '✓' : '○'} 180° upside down</Text>
        <Text style={styles.checkItem}>{achievements.up ? '✓' : '○'} face up</Text>
        <Text style={styles.checkItem}>{achievements.down ? '✓' : '○'} face down</Text>
        <Text style={styles.resultText}>{solved ? 'Solved' : 'Align to clear all'}</Text>
      </View>

      <StatusBar style="light" />
    </View>
  );
};

const CIRCLE_SIZE = 240;
const BUBBLE_SIZE = 24;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelWrapper: {
    alignItems: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 2,
    borderColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
  },
  crossVertical: {
    position: 'absolute',
    width: 2,
    height: CIRCLE_SIZE - 40,
    backgroundColor: '#2f2f2f',
  },
  crossHorizontal: {
    position: 'absolute',
    height: 2,
    width: CIRCLE_SIZE - 40,
    backgroundColor: '#2f2f2f',
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    backgroundColor: '#f7d35a',
    borderWidth: 2,
    borderColor: '#f4c847',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  readout: {
    marginTop: 16,
    alignItems: 'center',
  },
  angleText: {
    color: '#d9d9d9',
    fontSize: 16,
    letterSpacing: 1,
  },
  checklist: {
    marginTop: 28,
    width: 260,
  },
  checkItem: {
    color: '#c9c9c9',
    fontSize: 14,
    marginBottom: 6,
  },
  resultText: {
    marginTop: 12,
    color: '#f7d35a',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PuzzleLevel;

import { StatusBar } from 'expo-status-bar';
import * as Brightness from 'expo-brightness';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';

const COLOR_PALETTE = ['#E63946', '#FF9F1C', '#2A9D8F', '#3A86FF', '#8338EC'];
const getRandomColor = () => COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];

const PuzzleSevenAndEight = () => {
	const solvedRef = useRef(false);
	const [solved, setSolved] = useState(false);
	const [fillColor, setFillColor] = useState('#111111');
	const [hintVisible, setHintVisible] = useState(false);
	const [hasDimmed, setHasDimmed] = useState(false);
	const [hasBrightened, setHasBrightened] = useState(false);

	useEffect(() => {
		let mounted = true;

		const checkBrightness = async () => {
			try {
				const value = await Brightness.getBrightnessAsync();
				if (!mounted || typeof value !== 'number') return;

				if (value <= 0.05) setHasDimmed(true);
				if (value >= 0.95) setHasBrightened(true);
			} catch {
				// brightness API unavailable
			}
		};

		checkBrightness();
		const intervalId = setInterval(checkBrightness, 750);

		return () => {
			mounted = false;
			clearInterval(intervalId);
		};
	}, []);

	useEffect(() => {
		if (hasDimmed && hasBrightened && !solvedRef.current) {
			solvedRef.current = true;
			setFillColor(getRandomColor());
			setSolved(true);
		}
	}, [hasDimmed, hasBrightened]);

	if (solved) {
		return (
			<View style={[styles.container, { backgroundColor: fillColor }]}>
				<Text style={styles.solvedTitle}>Puzzle Solved</Text>
				<Text style={styles.solvedSubtitle}>You found the extremes.</Text>
				<StatusBar style="light" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Puzzle 7–8</Text>

			<View style={styles.dotsRow}>
				<View style={[styles.dot, hasDimmed && styles.dotDone]} />
				<View style={[styles.dot, hasBrightened && styles.dotDone]} />
			</View>

			{!hintVisible && (
				<Text style={styles.hint} onPress={() => setHintVisible(true)}>hint</Text>
			)}
			{hintVisible && (
				<Text style={styles.copy}>Adjust your screen brightness to both extremes.</Text>
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

export default PuzzleSevenAndEight;

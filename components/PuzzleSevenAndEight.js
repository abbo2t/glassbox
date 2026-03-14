import { StatusBar } from 'expo-status-bar';
import * as Brightness from 'expo-brightness';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

const PuzzleSevenAndEight = () => {
	const [hasDimmed, setHasDimmed] = useState(false);
	const [hasBrightened, setHasBrightened] = useState(false);

	useEffect(() => {
		let mounted = true;

		const checkBrightness = async () => {
			try {
				const value = await Brightness.getBrightnessAsync();
				if (!mounted || typeof value !== 'number') {
					return;
				}

				if (value <= 0.05) {
					setHasDimmed(true);
				}

				if (value >= 0.95) {
					setHasBrightened(true);
				}
			} catch (error) {
				// Keep the puzzle usable even if brightness APIs are unavailable.
			}
		};

		checkBrightness();
		const intervalId = setInterval(checkBrightness, 750);

		return () => {
			mounted = false;
			clearInterval(intervalId);
		};
	}, []);

	const solved = hasDimmed && hasBrightened;

	return (
		<View style={styles.container}>
			<Text>{solved ? 'Great work!' : 'good luck!'}</Text>
			<Text>{hasDimmed ? '7: brightness down ✅' : '7: brightness down'}</Text>
			<Text>{hasBrightened ? '8: brightness up ✅' : '8: brightness up'}</Text>
			<StatusBar style="auto" />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default PuzzleSevenAndEight;
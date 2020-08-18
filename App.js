import React, { useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
	TouchableOpacity,
} from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

const App = () => {
	const [note, setNote] = useState('');
	const [inputValue, setInputValue] = useState('');

	const handleChange = (input) => {
		setNote(input);
		setInputValue(input);
	};

	const askPermissions = async () => {
		const { status: existingStatus } = await Permissions.getAsync(
			Permissions.NOTIFICATIONS
		);
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
			finalStatus = status;
			console.log('asked');
		}
		if (finalStatus !== 'granted') {
			console.log('already granted');

			return false;
		}
		return true;
	};

	const sendNotification = async () => {
		askPermissions();

		let notificationId = await Notifications.presentLocalNotificationAsync({
			title: note,
		});
		// console.log(notificationId); // can be saved in AsyncStorage or send to server
		setInputValue('');
	};

	return (
		<View style={styles.container}>
			<View style={styles.upperContainer}>
				<View style={styles.innerContainer}>
					<Text style={styles.title}>Noted.</Text>
					<TextInput
						style={styles.inputNote}
						onChangeText={(input) => handleChange(input)}
						placeholder="Text goes here"
						value={inputValue}
					/>
					<TouchableOpacity onPress={sendNotification} style={styles.button}>
						<Text style={styles.buttonText}>PUSH</Text>
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.version}>
				<Text style={styles.versionNumber}>v1.0</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black',
	},
	upperContainer: {
		marginTop: 50,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
		backgroundColor: 'black',
	},
	title: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 35,
	},
	innerContainer: {
		width: 200,
		marginBottom: 150,
	},
	inputNote: {
		borderWidth: 1,
		borderColor: 'white',
		marginTop: 10,
		marginBottom: 5,
		padding: 5,
		borderRadius: 5,
		color: 'white',
	},
	button: {
		elevation: 8,
		backgroundColor: 'white',
		borderRadius: 5,
		paddingVertical: 10,
		paddingHorizontal: 12,
	},
	buttonText: {
		fontSize: 15,
		color: 'black',
		fontWeight: 'bold',
		alignSelf: 'center',
		textTransform: 'uppercase',
	},
	version: {
		backgroundColor: 'black',
	},
	versionNumber: {
		color: 'white',
		textAlign: 'center',
	},
});

export default App;

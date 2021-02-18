import React, { useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Dimensions,
	Switch,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

const App = () => {
	const [titleValue, setTitleValue] = useState('');
	const [bodyValue, setBodyValue] = useState('');
	const [isEnabled, setIsEnabled] = useState(false);
	const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

	const handleChange = (input) => {
		setTitleValue(input);
	};

	const askPermissions = async () => {
		const { status: existingStatus } = await Permissions.getAsync(
			Permissions.NOTIFICATIONS
		);
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			return false;
		}
		return true;
	};

	const sendNotification = async () => {
		askPermissions();

		if (titleValue === '') {
			return;
		}

		Notifications.setNotificationHandler({
			handleNotification: async () => ({
				shouldShowAlert: true,
				shouldPlaySound: true,
				shouldSetBadge: true,
			}),
		});

		await Notifications.scheduleNotificationAsync({
			content: {
				title: titleValue,
				body: bodyValue !== '' ? bodyValue : null,
			},
			trigger: null,
		}).then(() => {
			setTitleValue('');
			setBodyValue('');
		});
		// console.log(notificationId); // can be saved in AsyncStorage or send to server
	};

	return (
		<KeyboardAvoidingView style={styles.container} behavior="height">
			<View style={styles.innerContainer}>
				<View style={styles.topContainer}>
					<Text style={styles.title}>noted.</Text>
					<Switch
						style={styles.switch}
						trackColor={{ false: '#cccccc', true: '#cccccc' }}
						thumbColor={isEnabled ? '#ffffff' : '#ffffff'}
						ios_backgroundColor="#3e3e3e"
						onValueChange={toggleSwitch}
						value={isEnabled}
					/>
				</View>
				<TextInput
					selectionColor="white"
					style={styles.inputNote}
					onChangeText={(input) => setTitleValue(input)}
					placeholderTextColor="grey"
					placeholder={isEnabled ? 'title goes here...' : 'note goes here...'}
					value={titleValue}
				/>
				{isEnabled && (
					<TextInput
						selectionColor="white"
						style={styles.inputNote}
						onChangeText={(input) => setBodyValue(input)}
						placeholderTextColor="grey"
						placeholder="body goes here..."
						value={bodyValue}
					/>
				)}
				<TouchableOpacity onPress={sendNotification} style={styles.button}>
					<Text style={styles.buttonText}>NOTE</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 150,
	},
	upperContainer: {
		marginTop: 50,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexGrow: 1,
		backgroundColor: 'black',
	},
	topContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	switch: {},
	title: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 35,
	},
	innerContainer: {
		width: Dimensions.get('window').width,
		paddingLeft: 40,
		paddingRight: 40,
	},
	inputNote: {
		borderWidth: 1,
		borderColor: 'white',
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

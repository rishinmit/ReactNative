import React, {useState, useEffect} from 'react';
import {View, Text, Button, PermissionsAndroid, Platform} from 'react-native';
import Voice from '@react-native-voice/voice';

const App = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Request microphone permission for Android
  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message:
              'This app needs access to your microphone to recognize speech.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Microphone permission denied');
        }
      } catch (err) {
        console.error('Permission error:', err);
      }
    }
  };

  useEffect(() => {
    requestMicrophonePermission();

    // Add event listeners for speech recognition
    Voice.onSpeechStart = () => console.log('Speech started');
    Voice.onSpeechEnd = () => {
      console.log('Speech ended');
      setIsListening(false);
    };
    Voice.onSpeechResults = event => {
      setRecognizedText(event.value ? event.value[0] : '');
      console.log('Speech Results:', event.value);
    };
    Voice.onSpeechError = error =>
      console.error('Speech recognition error:', error);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      setRecognizedText('');
      setIsListening(true);
      await Voice.start('en-IN');
    } catch (error) {
      console.error('Voice start error:', error);
    }
  };

  const stopListening = async () => {
    try {
      setIsListening(false);
      await Voice.stop();
    } catch (error) {
      console.error('Voice stop error:', error);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 25, marginBottom: 20}}>Recognized Text:</Text>
      <Text style={{fontSize: 18, color: 'green', marginBottom: 20}}>
        {recognizedText || 'No speech detected'}
      </Text>
      <Button
        title="Start Listening bantai yaaaar"
        onPress={startListening}
        disabled={isListening}
      />
      <Button
        title="Stop Listening na"
        onPress={stopListening}
        disabled={!isListening}
      />
    </View>
  );
};

export default App;

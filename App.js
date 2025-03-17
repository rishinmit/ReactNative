import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  PermissionsAndroid,
  Platform,
  FlatList,
  StyleSheet,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import axios from 'axios';

const App = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [schedule, setSchedule] = useState([]);

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

    Voice.onSpeechStart = () => console.log('Speech started');
    Voice.onSpeechEnd = () => {
      console.log('Speech ended');
      stopListening();
      setIsListening(false);
    };
    Voice.onSpeechResults = event => {
      const text = event.value ? event.value[0] : '';
      setRecognizedText(text);
      generateSchedule(text);
      console.log('Speech Results:', text);
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
      setSchedule([]);
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

  const generateSchedule = async inputText => {
    if (!inputText) return;

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content:
                'Extract only the specific time and task from the user input. Return a valid JSON array with only one object in the format [{"time": "12:00 PM", "task": "Meeting"}]. No extra tasks.',
            },
            {
              role: 'user',
              content: `Extract schedule from: "${inputText}".`,
            },
          ],
          temperature: 0.3, // Keep it low to ensure precise output
          max_tokens: 50,
        },
        {
          headers: {
            Authorization: `Bearer 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`, // Replace with your API key
            'Content-Type': 'application/json',
          },
        },
      );

      let rawApiResponse = response.data.choices[0]?.message?.content;
      console.log('Raw API Response:', rawApiResponse);

      // Extract only the JSON part from response
      const jsonMatch = rawApiResponse.match(/\[.*\]/s);
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0]); // Parse only JSON
        setSchedule(jsonData);
      } else {
        console.error('Failed to extract JSON');
        setSchedule([]);
      }
    } catch (error) {
      console.error(
        'Error generating schedule:',
        error.response?.data || error.message,
      );
      setSchedule([]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI-Powered Daily Schedule</Text>

      <Text style={styles.label}>Recognized Text:</Text>
      <Text style={styles.recognizedText}>
        {recognizedText || 'No speech detected'}
      </Text>

      <Button
        title="🎤 Start Listening"
        onPress={startListening}
        disabled={isListening}
      />
      <Button
        title="🛑 Stop Listening"
        onPress={stopListening}
        disabled={!isListening}
      />

      {schedule.length > 0 && (
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Generated Schedule:</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Time</Text>
            <Text style={styles.tableHeaderCell}>Task</Text>
          </View>
          <FlatList
            data={schedule}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.time}</Text>
                <Text style={styles.tableCell}>{item.task}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
  },
  recognizedText: {
    fontSize: 18,
    color: 'blue',
    marginBottom: 20,
  },
  tableContainer: {
    marginTop: 20,
    width: '100%',
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 10,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'black',
    padding: 10,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default App;

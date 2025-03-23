import React, { useState, useEffect } from 'react';
import promptText from './prompt';
import { URL } from './config';
import {
  View,
  Text,
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import axios from 'axios';

const App = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

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
    fetchTasks();

    Voice.onSpeechStart = () => console.log('Speech started');
    Voice.onSpeechEnd = () => {
      console.log('Speech ended');
      stopListening();
      setIsListening(false);
    };
    Voice.onSpeechResults = event => {
      const text = event.value ? event.value[0] : '';
      setRecognizedText(text);
      if (updatingTaskId) {
        updateTask(updatingTaskId, text);
      } else {
        generateSchedule(text);
      }
      console.log('Speech Results:', text);
    };
    Voice.onSpeechError = error =>
      console.error('Speech recognition error:', error);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [updatingTaskId]);

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

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${URL}/get-tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      console.log('Deleting task with ID:', taskId);
      const response = await axios.delete(`${URL}/delete-task/${taskId}`);
      console.log('Delete response:', response.data);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error.response?.data || error.message);
    }
  };

  const startUpdatingTask = (taskId) => {
    setUpdatingTaskId(taskId);
    startListening();
  };

  const updateTask = async (taskId, updatedText) => {
    try {
      console.log('Updating task with ID:', taskId);
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: promptText,
            },
            {
              role: 'user',
              content: `Extract schedule including date, time, and task from: "${updatedText}".`,
            },
          ],
          temperature: 0.3,
          max_tokens: 50,
        },
        {
          headers: {
            Authorization: `Bearer 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`,
            'Content-Type': 'application/json',
          },
        },
      );
      
      let rawApiResponse = response.data.choices[0]?.message?.content;
      console.log('Raw API Response:', rawApiResponse);

      const jsonMatch = rawApiResponse.match(/\[.*?\]/s);
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0]);
        console.log('Extracted JSON:', jsonData);

        if (jsonData.length > 0) {
          const updateData = {};
          if (jsonData[0].date) updateData.date = jsonData[0].date;
          if (jsonData[0].time) updateData.time = jsonData[0].time;
          if (jsonData[0].task) updateData.task = jsonData[0].task;

          const response = await axios.put(`${URL}/update-task/${taskId}`, updateData);
          console.log('Update response:', response.data);
          setUpdatingTaskId(null);
          fetchTasks();
        } else {
          console.error('Extracted JSON is empty');
        }
      } else {
        console.error('Failed to extract JSON from API response');
      }
    } catch (error) {
      console.error('Error updating task:', error.response?.data || error.message);
    }
  };
  const saveScheduleToDB = async (scheduleData) => {
    if (!scheduleData || scheduleData.length === 0) {
      console.error('No valid schedule data to save.');
      return;
    }
  
    try {
      for (const item of scheduleData) {
        const { date, time, task } = item;
        await axios.post(`${URL}/save-task`, { date, time, task });
      }
      console.log('Tasks saved successfully');
      fetchTasks(); // Refresh tasks
    } catch (error) {
      console.error('Error saving task:', error.response?.data || error.message);
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
              content: promptText,
            },
            {
              role: 'user',
              content: `Extract schedule from: "${inputText}".`,
            },
          ],
          temperature: 0.3,
          max_tokens: 50,
        },
        {
          headers: {
            Authorization: `Bearer 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`,
            'Content-Type': 'application/json',
          },
        },
      );

      let rawApiResponse = response.data.choices[0]?.message?.content;
      console.log('Raw API Response:', rawApiResponse);

      const jsonMatch = rawApiResponse.match(/\[.*?\]/s);
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0]);
        console.log('Extracted JSON:', jsonData);

        if (jsonData.length > 0) {
          saveScheduleToDB(jsonData);
        } else {
          console.error('Extracted JSON is empty');
        }
      } else {
        console.error('Failed to extract JSON from API response');
      }
    } catch (error) {
      console.error('Error generating schedule:', error.response?.data || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI-Powered Speech Recognition</Text>
      <Text style={styles.label}>Recognized Text:</Text>
      <Text style={styles.recognizedText}>{recognizedText || 'No speech detected'}</Text>

      <View style={styles.buttonContainer}>
        <Button title="🎤 Start Listening" onPress={startListening} disabled={isListening} />
        <Button title="🛑 Stop Listening" onPress={stopListening} disabled={!isListening} />
      </View>

      {/* <Text style={styles.title}>📅 Schedule</Text> */}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.date} - {item.time}: {item.task}</Text>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(item._id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.updateButton} onPress={() => startUpdatingTask(item._id)}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
    marginTop: 20,
    color: '#333',
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
    color: 'red',
  },
  recognizedText: {
    fontSize: 18,
    color: 'pink',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  taskItem: {
    backgroundColor: 'black',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    width: '100%',
  },
  taskText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  updateButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
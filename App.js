import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import VoiceControls from './components/VoiceControls';
import TaskList from './components/TaskList';
import useSpeechHandler from './components/SpeechHandler';

const App = () => {
  const {
    recognizedText,
    isListening,
    tasks,
    startListening,
    stopListening,
    deleteTask,
    startUpdatingTask,
  } = useSpeechHandler();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI-Powered Speech Recognition</Text>
      <Text style={styles.label}>Recognized Text:</Text>
      <Text style={styles.recognizedText}>
        {recognizedText || 'No speech detected'}
      </Text>

      <VoiceControls
        isListening={isListening}
        onStart={startListening}
        onStop={stopListening}
      />

      <Text style={styles.title}>Schedule</Text>
      <TaskList
        tasks={tasks}
        onDelete={deleteTask}
        onUpdate={startUpdatingTask}
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
  title: {fontSize: 25, fontWeight: 'bold', marginTop: 20, color: '#333'},
  label: {fontSize: 20, marginBottom: 10, color: 'red'},
  recognizedText: {
    fontSize: 18,
    color: 'pink',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default App;

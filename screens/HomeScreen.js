import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import VoiceControls from '../components/VoiceControls';
import {useSpeech} from '../components/SpeechContext';

const HomeScreen = () => {
  const {recognizedText, isListening, startListening, stopListening} =
    useSpeech();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Speech Recognition</Text>
      <Text style={styles.label}>Current Recognized Task:</Text>
      <Text style={styles.recognizedText}>
        {recognizedText || 'No input yet'}
      </Text>

      <VoiceControls
        isListening={isListening}
        onStart={startListening}
        onStop={stopListening}
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
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: 'black'},
  label: {fontSize: 18, color: 'red'},
  recognizedText: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    marginBottom: 30,
  },
});

export default HomeScreen;

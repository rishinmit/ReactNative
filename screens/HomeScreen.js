import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import VoiceControls from '../components/VoiceControls';
import { useSpeech } from '../components/SpeechContext';

const HomeScreen = () => {
  const { recognizedText, isListening, startListening, stopListening } = useSpeech();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#e3f2fd" />

      <Text style={styles.title}>🚀 VoiceTask Assistant</Text>

      <View style={styles.recognitionBox}>
        <Text style={styles.label}>Recognized:</Text>
        <Text style={styles.recognizedText}>
          {recognizedText || 'Nothing yet, boss 😎'}
        </Text>
      </View>

      <VoiceControls
        isListening={isListening}
        onStart={startListening}
        onStop={stopListening}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd', 
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0ea5e9', 
    marginBottom: 40,
    textAlign: 'center',
  },
  recognitionBox: {
    backgroundColor: '#ffffff',
    padding: 22,
    borderRadius: 18,
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#7c4dff', 
    marginBottom: 40,
  },
  label: {
    fontSize: 18,
    color: '#7c4dff', 
    fontWeight: '600',
    marginBottom: 10,
  },
  recognizedText: {
    fontSize: 20,
    color: '#1e293b', 
    fontWeight: '500',
  },
});

export default HomeScreen;

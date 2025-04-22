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
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 36,
    textAlign: 'center',
    fontFamily: 'System',
  },
  recognitionBox: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 20,
    width: '100%',
    maxWidth: 380,
    borderWidth: 2,
    borderColor: '#7c4dff',
    marginBottom: 36,
  },
  label: {
    fontSize: 18,
    color: '#7c4dff',
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'System',
  },
  recognizedText: {
    fontSize: 20,
    color: '#1e293b', 
    fontWeight: '500',
    fontFamily: 'System',
  },
});



export default HomeScreen;

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const VoiceControls = ({isListening, onStart, onStop}) => (
  <View style={styles.container}>
    {!isListening ? (
      <TouchableOpacity style={[styles.button, styles.start]} onPress={onStart}>
        <Text style={styles.text}>🎤 Start Listening</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity style={[styles.button, styles.stop]} onPress={onStop}>
        <Text style={styles.text}>🛑 Stop Listening</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 999,
    backgroundColor: '#22c55e', 
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    width: 260,
    alignItems: 'center',
    elevation: 6,
  },
  start: {
    backgroundColor: '#28a745', 
  },
  stop: {
    backgroundColor: '#1e293b', 
  },
  text: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 18,
    fontFamily: 'System',
    letterSpacing: 1,
  },
});

export default VoiceControls;

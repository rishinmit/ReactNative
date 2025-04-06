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
    marginVertical: 20,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 300,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
    width: 250,
    alignItems: 'center',
  },
  start: {
    backgroundColor: '#28a745', 
  },
  stop: {
    backgroundColor: '#dc3545', 
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
  },
});

export default VoiceControls;

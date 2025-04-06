import React from 'react';
import {View, Button, StyleSheet} from 'react-native';

const VoiceControls = ({isListening, onStart, onStop}) => (
  <View style={styles.buttonContainer}>
    <Button
      title="🎤 Start Listening"
      onPress={onStart}
      disabled={isListening}
    />
    <Button
      title="🛑 Stop Listening"
      onPress={onStop}
      disabled={!isListening}
    />
  </View>
);

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
});

export default VoiceControls;

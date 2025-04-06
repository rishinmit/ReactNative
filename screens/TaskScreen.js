import React from 'react';
import {View, StyleSheet} from 'react-native';
import TaskList from '../components/TaskList';
import useSpeechHandler from '../components/SpeechHandler';
import {useSpeech} from '../components/SpeechContext';

const TaskScreen = () => {
  const {tasks, deleteTask, startUpdatingTask} = useSpeech();

  return (
    <View style={styles.container}>
      <TaskList
        tasks={tasks}
        onDelete={deleteTask}
        onUpdate={startUpdatingTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
});

export default TaskScreen;

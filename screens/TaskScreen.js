import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, StatusBar } from 'react-native';
import TaskList from '../components/TaskList';
import { useSpeech } from '../components/SpeechContext';

const TaskScreen = () => {
  const { tasks, deleteTask, startUpdatingTask } = useSpeech();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#e3f2fd" />

      <Text style={styles.header}>📋 Your Tasks</Text>

      <View style={styles.taskListWrapper}>
        <TaskList
          tasks={tasks}
          onDelete={deleteTask}
          onUpdate={startUpdatingTask}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0ea5e9', 
    marginBottom: 10,
    textAlign: 'center',
  },
  taskListWrapper: {
    flex: 1,
    paddingBottom: 20,
  },
});

export default TaskScreen;

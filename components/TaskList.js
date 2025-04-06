import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';

const TaskList = ({tasks, onDelete, onUpdate}) => (
  <FlatList
    data={tasks}
    keyExtractor={item => item._id}
    renderItem={({item}) => (
      <View style={styles.taskItem}>
        <Text style={styles.taskText}>
          {item.date} - {item.time}: {item.task}
        </Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(item._id)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => onUpdate(item._id)}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  taskItem: {
    backgroundColor: 'black',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    width: '100%',
  },
  taskText: {fontSize: 16, color: 'white', fontWeight: 'bold'},
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  updateButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {color: 'white', fontWeight: 'bold'},
});

export default TaskList;

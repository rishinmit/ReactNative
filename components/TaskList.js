import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const TaskList = ({ tasks, onDelete, onUpdate }) => (
  <FlatList
    data={tasks}
    keyExtractor={item => item._id}
    contentContainerStyle={styles.container}
    renderItem={({ item }) => (
      <View style={styles.taskCard}>
        <Text style={styles.taskDateTime}>
          📅 {item.date} ‧ ⏰ {item.time}
        </Text>
        <Text style={styles.taskDescription}>{item.task}</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(item._id)}>
            <Text style={styles.buttonText}>🗑 Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => onUpdate(item._id)}>
            <Text style={styles.buttonText}>✏️ Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  taskCard: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#38bdf8',
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',

  },
  taskDateTime: {
    color: '#0284c7',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  taskDescription: {
    color: '#0f172a',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  updateButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TaskList;

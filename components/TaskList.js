import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const TaskList = ({ tasks, onDelete, onUpdate }) => {
  const [doneTasks, setDoneTasks] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const toggleDone = (id) => {
    setDoneTasks((prev) =>
      prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
    );
  };

  return (
    <>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => {
          const isDone = doneTasks.includes(item._id);

          return (
            <View style={[styles.taskCard, isDone && styles.taskCardDone]}>
              <Text style={styles.taskDateTime}>
                📅 {item.date} ‧ ⏰ {item.time}
              </Text>

              <Text
                style={[
                  styles.taskDescription,
                  isDone && {
                    color: '#f1f5f9',
                    textDecorationLine: 'line-through',
                  },
                ]}
              >
                {item.task}
              </Text>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => toggleDone(item._id)}
                >
                  <Text style={styles.buttonText}>
                    {isDone ? 'Undo' : 'Done'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={() => onUpdate(item._id)}
                >
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    setSelectedTaskId(item._id);
                    setDeleteModalVisible(true);
                  }}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Delete Task?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete this task?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  onDelete(selectedTaskId);
                  setDeleteModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

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
  taskCardDone: {
    backgroundColor: '#1e293b',
    borderColor: '#475569',
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
  },
  doneButton: {
    backgroundColor: 'green',
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
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    width: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e293b',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#475569',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: '#94a3b8',
  },
  confirmButton: {
    backgroundColor: '#ef4444',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default TaskList;

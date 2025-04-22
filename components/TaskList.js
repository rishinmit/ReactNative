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
        renderItem={({ item, index }) => {
          const isDone = doneTasks.includes(item._id);

          return (
            <View style={[styles.taskCard, isDone && styles.taskCardDone]}>
              <Text style={styles.taskNumber}>
                {index + 1}
              </Text>
              <Text style={styles.taskDateTime}>
                📅 {item.date} ‧ ⏰ {item.time}
              </Text>
              <Text
                style={[
                  styles.taskDescription,
                  isDone && {
                    color: 'green',
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
    paddingBottom: 24,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
  },
  taskCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 18,
    borderColor: 'skyblue',
    borderWidth: 1.5,
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
  taskCardDone: {
    backgroundColor: '#ecfdf5', 
    borderColor: '#4ade80', 
    borderWidth: 2,
  },
  taskNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0ea5e9',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'System',
  },
  taskDateTime: {
    color: '#0891b2',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    textAlign: 'center',
  },
  taskDescription: {
    color: '#0f172a',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
  },
  doneButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
  },
  updateButton: {
    backgroundColor: '#facc15',
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalView: {
    backgroundColor: '#ffffff',
    padding: 28,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    width: 320,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    color: '#1e293b',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#475569',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: '#3b82f6',
  },
  confirmButton: {
    backgroundColor: '#dc2626',
  },
  modalButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
});


export default TaskList;

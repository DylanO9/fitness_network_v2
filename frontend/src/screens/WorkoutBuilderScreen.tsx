import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes: string;
}

interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
}

interface WorkoutSplit {
  id: string;
  name: string;
  description: string;
  workouts: Workout[];
}

const WorkoutBuilderScreen = () => {
  const [splits, setSplits] = useState<WorkoutSplit[]>([]);
  const [selectedSplit, setSelectedSplit] = useState<WorkoutSplit | null>(null);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [newSplitName, setNewSplitName] = useState('');
  const [newSplitDescription, setNewSplitDescription] = useState('');
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [newExercise, setNewExercise] = useState<Partial<Exercise>>({
    name: '',
    sets: 3,
    reps: 10,
    weight: 0,
    notes: '',
  });

  useEffect(() => {
    loadSplits();
  }, []);

  const loadSplits = async () => {
    try {
      const storedSplits = await AsyncStorage.getItem('workoutSplits');
      if (storedSplits) {
        setSplits(JSON.parse(storedSplits));
      }
    } catch (error) {
      console.error('Error loading splits:', error);
    }
  };

  const saveSplits = async (updatedSplits: WorkoutSplit[]) => {
    try {
      await AsyncStorage.setItem('workoutSplits', JSON.stringify(updatedSplits));
      setSplits(updatedSplits);
    } catch (error) {
      console.error('Error saving splits:', error);
    }
  };

  const createNewSplit = () => {
    if (newSplitName.trim()) {
      const newSplit: WorkoutSplit = {
        id: Date.now().toString(),
        name: newSplitName,
        description: newSplitDescription,
        workouts: [],
      };
      const updatedSplits = [...splits, newSplit];
      saveSplits(updatedSplits);
      setNewSplitName('');
      setNewSplitDescription('');
      setShowSplitModal(false);
    }
  };

  const addWorkoutToSplit = () => {
    if (newWorkoutName.trim() && selectedSplit) {
      const newWorkout: Workout = {
        id: Date.now().toString(),
        name: newWorkoutName,
        exercises: [],
      };
      const updatedSplit = {
        ...selectedSplit,
        workouts: [...selectedSplit.workouts, newWorkout],
      };
      const updatedSplits = splits.map(split => 
        split.id === selectedSplit.id ? updatedSplit : split
      );
      saveSplits(updatedSplits);
      setSelectedSplit(updatedSplit);
      setNewWorkoutName('');
      setShowWorkoutModal(false);
    }
  };

  const addExerciseToWorkout = (workoutId: string) => {
    if (newExercise.name?.trim()) {
      const exercise: Exercise = {
        id: Date.now().toString(),
        name: newExercise.name,
        sets: newExercise.sets || 3,
        reps: newExercise.reps || 10,
        weight: newExercise.weight || 0,
        notes: newExercise.notes || '',
      };

      const updatedSplit = {
        ...selectedSplit!,
        workouts: selectedSplit!.workouts.map(workout => 
          workout.id === workoutId
            ? { ...workout, exercises: [...workout.exercises, exercise] }
            : workout
        ),
      };

      const updatedSplits = splits.map(split => 
        split.id === selectedSplit!.id ? updatedSplit : split
      );

      saveSplits(updatedSplits);
      setSelectedSplit(updatedSplit);
      setNewExercise({
        name: '',
        sets: 3,
        reps: 10,
        weight: 0,
        notes: '',
      });
      setShowExerciseModal(false);
    }
  };

  const renderSplitItem = ({ item }: { item: WorkoutSplit }) => (
    <TouchableOpacity
      style={styles.splitItem}
      onPress={() => setSelectedSplit(item)}
    >
      <Text style={styles.splitName}>{item.name}</Text>
      <Text style={styles.splitDescription}>{item.description}</Text>
      <Text style={styles.workoutCount}>
        {item.workouts.length} workouts
      </Text>
    </TouchableOpacity>
  );

  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <View style={styles.workoutItem}>
      <Text style={styles.workoutName}>{item.name}</Text>
      <FlatList
        data={item.exercises}
        renderItem={({ item: exercise }) => (
          <View style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseDetails}>
              {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight}kg
            </Text>
            {exercise.notes && (
              <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
            )}
          </View>
        )}
        keyExtractor={exercise => exercise.id}
      />
      <TouchableOpacity
        style={styles.addExerciseButton}
        onPress={() => {
          setShowExerciseModal(true);
          setNewExercise({
            name: '',
            sets: 3,
            reps: 10,
            weight: 0,
            notes: '',
          });
        }}
      >
        <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowSplitModal(true)}
        >
          <Text style={styles.createButtonText}>Create New Split</Text>
        </TouchableOpacity>
      </View>

      {selectedSplit ? (
        <View style={styles.selectedSplitContainer}>
          <View style={styles.selectedSplitHeader}>
            <Text style={styles.selectedSplitName}>{selectedSplit.name}</Text>
            <TouchableOpacity
              onPress={() => setSelectedSplit(null)}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.splitDescription}>{selectedSplit.description}</Text>

          <FlatList
            data={selectedSplit.workouts}
            renderItem={renderWorkoutItem}
            keyExtractor={workout => workout.id}
            style={styles.workoutList}
          />

          <TouchableOpacity
            style={styles.addWorkoutButton}
            onPress={() => setShowWorkoutModal(true)}
          >
            <Text style={styles.addWorkoutButtonText}>Add Workout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={splits}
          renderItem={renderSplitItem}
          keyExtractor={split => split.id}
          style={styles.splitList}
        />
      )}

      {/* New Split Modal */}
      <Modal
        visible={showSplitModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Split</Text>
            <TextInput
              style={styles.input}
              placeholder="Split Name"
              value={newSplitName}
              onChangeText={setNewSplitName}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={newSplitDescription}
              onChangeText={setNewSplitDescription}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowSplitModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={createNewSplit}
              >
                <Text style={styles.modalButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* New Workout Modal */}
      <Modal
        visible={showWorkoutModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Workout</Text>
            <TextInput
              style={styles.input}
              placeholder="Workout Name"
              value={newWorkoutName}
              onChangeText={setNewWorkoutName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowWorkoutModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={addWorkoutToSplit}
              >
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* New Exercise Modal */}
      <Modal
        visible={showExerciseModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Exercise</Text>
            <TextInput
              style={styles.input}
              placeholder="Exercise Name"
              value={newExercise.name}
              onChangeText={name => setNewExercise({ ...newExercise, name })}
            />
            <View style={styles.exerciseInputs}>
              <TextInput
                style={[styles.input, styles.smallInput]}
                placeholder="Sets"
                value={newExercise.sets?.toString()}
                onChangeText={sets => setNewExercise({ ...newExercise, sets: parseInt(sets) || 0 })}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.smallInput]}
                placeholder="Reps"
                value={newExercise.reps?.toString()}
                onChangeText={reps => setNewExercise({ ...newExercise, reps: parseInt(reps) || 0 })}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.smallInput]}
                placeholder="Weight (kg)"
                value={newExercise.weight?.toString()}
                onChangeText={weight => setNewExercise({ ...newExercise, weight: parseInt(weight) || 0 })}
                keyboardType="numeric"
              />
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Notes"
              value={newExercise.notes}
              onChangeText={notes => setNewExercise({ ...newExercise, notes })}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowExerciseModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={() => addExerciseToWorkout(selectedSplit!.workouts[0].id)}
              >
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  createButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  splitList: {
    flex: 1,
  },
  splitItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  splitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  splitDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  workoutCount: {
    fontSize: 14,
    color: '#2ecc71',
    marginTop: 5,
  },
  selectedSplitContainer: {
    flex: 1,
  },
  selectedSplitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedSplitName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#2ecc71',
    fontSize: 16,
  },
  workoutList: {
    flex: 1,
  },
  workoutItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  exerciseItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  exerciseNotes: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  addWorkoutButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  addWorkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addExerciseButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addExerciseButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  createButton: {
    backgroundColor: '#2ecc71',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallInput: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default WorkoutBuilderScreen; 
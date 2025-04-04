import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, ScrollView, Alert } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type WorkoutPlannerNavigationProp = NativeStackNavigationProp<RootStackParamList>;

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
  description: string;
  exercises: Exercise[];
}

interface WorkoutDay {
  date: string;
  workoutId: string;
  completed: boolean;
}

interface WorkoutSplit {
  id: string;
  name: string;
  description: string;
  workouts: Workout[];
  isCurrent: boolean;
}

const WorkoutPlannerScreen = () => {
  const navigation = useNavigation<WorkoutPlannerNavigationProp>();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [workoutDays, setWorkoutDays] = useState<Record<string, WorkoutDay>>({});
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showWorkoutDetailsModal, setShowWorkoutDetailsModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [currentSplit, setCurrentSplit] = useState<WorkoutSplit | null>(null);

  useEffect(() => {
    loadWorkouts();
    loadWorkoutDays();
    loadCurrentSplit();
  }, []);

  const loadCurrentSplit = async () => {
    try {
      const storedSplits = await AsyncStorage.getItem('workoutSplits');
      if (storedSplits) {
        const splits: WorkoutSplit[] = JSON.parse(storedSplits);
        const current = splits.find(split => split.isCurrent);
        if (current) {
          setCurrentSplit(current);
          setWorkouts(current.workouts);
        }
      }
    } catch (error) {
      console.error('Error loading current split:', error);
    }
  };

  const loadWorkouts = async () => {
    try {
      const storedWorkouts = await AsyncStorage.getItem('workouts');
      if (storedWorkouts) {
        setWorkouts(JSON.parse(storedWorkouts));
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  const loadWorkoutDays = async () => {
    try {
      const storedDays = await AsyncStorage.getItem('workoutDays');
      if (storedDays) {
        setWorkoutDays(JSON.parse(storedDays));
      }
    } catch (error) {
      console.error('Error loading workout days:', error);
    }
  };

  const saveWorkoutDay = async (workoutDay: WorkoutDay) => {
    try {
      const newWorkoutDays = { ...workoutDays, [workoutDay.date]: workoutDay };
      await AsyncStorage.setItem('workoutDays', JSON.stringify(newWorkoutDays));
      setWorkoutDays(newWorkoutDays);
    } catch (error) {
      console.error('Error saving workout day:', error);
    }
  };

  const getMarkedDates = () => {
    const marked: Record<string, any> = {};
    Object.entries(workoutDays).forEach(([date, day]) => {
      marked[date] = {
        marked: true,
        dotColor: day.completed ? '#2ecc71' : '#e74c3c',
        selected: date === selectedDate,
      };
    });
    marked[selectedDate] = { selected: true, marked: marked[selectedDate]?.marked };
    return marked;
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    setShowWorkoutModal(true);
  };

  const handleWorkoutSelect = (workout: Workout) => {
    const workoutDay: WorkoutDay = {
      date: selectedDate,
      workoutId: workout.id,
      completed: false,
    };
    saveWorkoutDay(workoutDay);
    setShowWorkoutModal(false);
  };

  const toggleWorkoutCompletion = () => {
    const currentDay = workoutDays[selectedDate];
    if (currentDay) {
      const updatedDay = { ...currentDay, completed: !currentDay.completed };
      saveWorkoutDay(updatedDay);
    }
  };

  const navigateToWorkoutBuilder = () => {
    navigation.navigate('WorkoutBuilder');
  };

  const viewWorkoutDetails = (workout: Workout) => {
    setSelectedWorkout(workout);
    setShowWorkoutDetailsModal(true);
  };

  const clearStorage = async () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all workout data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('workouts');
              await AsyncStorage.removeItem('workoutDays');
              setWorkouts([]);
              setWorkoutDays({});
              Alert.alert('Success', 'All workout data has been cleared.');
            } catch (error) {
              console.error('Error clearing storage:', error);
              Alert.alert('Error', 'Failed to clear workout data.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={navigateToWorkoutBuilder}
        >
          <Text style={styles.createButtonText}>Create New Workout</Text>
        </TouchableOpacity>
      </View>

      <Calendar
        onDayPress={handleDayPress}
        markedDates={getMarkedDates()}
        theme={{
          selectedDayBackgroundColor: '#2ecc71',
          todayTextColor: '#2ecc71',
          dotColor: '#2ecc71',
        }}
      />

      <View style={styles.selectedDayContainer}>
        <Text style={styles.selectedDayText}>
          {new Date(selectedDate).toLocaleDateString()}
        </Text>
        
        {workoutDays[selectedDate] ? (
          <View style={styles.workoutInfo}>
            <TouchableOpacity onPress={() => viewWorkoutDetails(workouts.find(w => w.id === workoutDays[selectedDate].workoutId)!)}>
              <Text style={styles.workoutName}>
                {workouts.find(w => w.id === workoutDays[selectedDate].workoutId)?.name}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.completionButton,
                { backgroundColor: workoutDays[selectedDate].completed ? '#2ecc71' : '#e74c3c' },
              ]}
              onPress={toggleWorkoutCompletion}
            >
              <Text style={styles.completionButtonText}>
                {workoutDays[selectedDate].completed ? 'Completed' : 'Not Completed'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noWorkoutText}>No workout scheduled</Text>
        )}
      </View>

      {/* Workout Selection Modal */}
      <Modal
        visible={showWorkoutModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Workout</Text>
            
            <FlatList
              data={workouts}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.workoutOption}
                  onPress={() => handleWorkoutSelect(item)}
                >
                  <Text style={styles.workoutOptionText}>{item.name}</Text>
                  <Text style={styles.workoutExerciseCount}>
                    {item.exercises.length} exercises
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={workout => workout.id}
            />

            <TouchableOpacity
              style={styles.createNewButton}
              onPress={navigateToWorkoutBuilder}
            >
              <Text style={styles.createNewButtonText}>Create New Workout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowWorkoutModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Workout Details Modal */}
      <Modal
        visible={showWorkoutDetailsModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedWorkout?.name}</Text>
            <Text style={styles.workoutDescription}>{selectedWorkout?.description}</Text>
            
            <ScrollView style={styles.exercisesList}>
              {selectedWorkout?.exercises.map(exercise => (
                <View key={exercise.id} style={styles.exerciseItem}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight}kg
                  </Text>
                  {exercise.notes && (
                    <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
                  )}
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setShowWorkoutDetailsModal(false);
                navigation.navigate('WorkoutBuilder', { workoutId: selectedWorkout?.id });
              }}
            >
              <Text style={styles.editButtonText}>Edit Workout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowWorkoutDetailsModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
  selectedDayContainer: {
    padding: 20,
  },
  selectedDayText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  workoutInfo: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  completionButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  completionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noWorkoutText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
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
  workoutDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  workoutOption: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  workoutOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  workoutExerciseCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  createNewButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  createNewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exercisesList: {
    maxHeight: 300,
    marginBottom: 20,
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
  editButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  splitSection: {
    marginBottom: 20,
  },
  splitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
});

export default WorkoutPlannerScreen; 
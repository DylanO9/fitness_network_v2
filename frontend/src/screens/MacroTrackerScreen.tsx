import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MacroEntry {
  id: string;
  date: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

const MacroTrackerScreen = () => {
  const [entries, setEntries] = useState<MacroEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [calories, setCalories] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const storedEntries = await AsyncStorage.getItem('macroEntries');
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const saveEntries = async (newEntries: MacroEntry[]) => {
    try {
      await AsyncStorage.setItem('macroEntries', JSON.stringify(newEntries));
      setEntries(newEntries);
    } catch (error) {
      console.error('Error saving entries:', error);
    }
  };

  const handleAddEntry = () => {
    if (!protein || !carbs || !fat || !calories) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newEntry: MacroEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fat: parseFloat(fat),
      calories: parseFloat(calories),
    };

    const updatedEntries = [...entries, newEntry];
    saveEntries(updatedEntries);

    // Clear form
    setProtein('');
    setCarbs('');
    setFat('');
    setCalories('');
  };

  const getMarkedDates = () => {
    const marked: Record<string, any> = {};
    entries.forEach(entry => {
      marked[entry.date] = {
        marked: true,
        dotColor: '#2ecc71',
        selected: entry.date === selectedDate,
      };
    });
    marked[selectedDate] = { selected: true, marked: marked[selectedDate]?.marked };
    return marked;
  };

  const getEntriesForSelectedDate = () => {
    return entries.filter(entry => entry.date === selectedDate);
  };

  const handleSubmit = (field: string) => {
    switch (field) {
      case 'protein':
        // Focus next field or dismiss keyboard
        break;
      case 'carbs':
        // Focus next field or dismiss keyboard
        break;
      case 'fat':
        // Focus next field or dismiss keyboard
        break;
      case 'calories':
        Keyboard.dismiss();
        break;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Calendar
            onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
            markedDates={getMarkedDates()}
            theme={{
              selectedDayBackgroundColor: '#2ecc71',
              todayTextColor: '#2ecc71',
              dotColor: '#2ecc71',
            }}
          />

          <ScrollView 
            style={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Add Entry for {selectedDate}</Text>
              
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Protein (g)</Text>
                  <TextInput
                    style={styles.input}
                    value={protein}
                    onChangeText={setProtein}
                    keyboardType="numeric"
                    placeholder="0"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => handleSubmit('protein')}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Carbs (g)</Text>
                  <TextInput
                    style={styles.input}
                    value={carbs}
                    onChangeText={setCarbs}
                    keyboardType="numeric"
                    placeholder="0"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => handleSubmit('carbs')}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Fat (g)</Text>
                  <TextInput
                    style={styles.input}
                    value={fat}
                    onChangeText={setFat}
                    keyboardType="numeric"
                    placeholder="0"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => handleSubmit('fat')}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Calories</Text>
                  <TextInput
                    style={styles.input}
                    value={calories}
                    onChangeText={setCalories}
                    keyboardType="numeric"
                    placeholder="0"
                    returnKeyType="done"
                    onSubmitEditing={() => handleSubmit('calories')}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.addButton} onPress={handleAddEntry}>
                <Text style={styles.addButtonText}>Add Entry</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.entriesContainer}>
              <Text style={styles.entriesTitle}>Entries for {selectedDate}</Text>
              {getEntriesForSelectedDate().map(entry => (
                <View key={entry.id} style={styles.entryItem}>
                  <View style={styles.macroDetails}>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroLabel}>Protein</Text>
                      <Text style={styles.macroValue}>{entry.protein}g</Text>
                    </View>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroLabel}>Carbs</Text>
                      <Text style={styles.macroValue}>{entry.carbs}g</Text>
                    </View>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroLabel}>Fat</Text>
                      <Text style={styles.macroValue}>{entry.fat}g</Text>
                    </View>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroLabel}>Calories</Text>
                      <Text style={styles.macroValue}>{entry.calories}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  entriesContainer: {
    padding: 20,
  },
  entriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  entryItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  macroDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MacroTrackerScreen; 
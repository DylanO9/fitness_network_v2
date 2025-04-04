import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Client {
  id: string;
  name: string;
  email: string;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
  };
  workoutSplit: string;
}

const CoachingScreen = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const loadClients = async () => {
    try {
      const storedClients = await AsyncStorage.getItem('clients');
      if (storedClients) {
        setClients(JSON.parse(storedClients));
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const saveClient = async (client: Client) => {
    try {
      const newClients = [...clients, client];
      await AsyncStorage.setItem('clients', JSON.stringify(newClients));
      setClients(newClients);
      setNewClientName('');
      setNewClientEmail('');
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const renderClientItem = ({ item }: { item: Client }) => (
    <TouchableOpacity
      style={styles.clientItem}
      onPress={() => setSelectedClient(item)}
    >
      <Text style={styles.clientName}>{item.name}</Text>
      <Text style={styles.clientEmail}>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.input}
          placeholder="Client Name"
          value={newClientName}
          onChangeText={setNewClientName}
        />
        <TextInput
          style={styles.input}
          placeholder="Client Email"
          value={newClientEmail}
          onChangeText={setNewClientEmail}
          keyboardType="email-address"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (newClientName.trim() && newClientEmail.trim()) {
              saveClient({
                id: Date.now().toString(),
                name: newClientName,
                email: newClientEmail,
                macros: {
                  protein: 0,
                  carbs: 0,
                  fat: 0,
                  calories: 0,
                },
                workoutSplit: '',
              });
            }
          }}
        >
          <Text style={styles.addButtonText}>Add Client</Text>
        </TouchableOpacity>
      </View>

      {selectedClient ? (
        <View style={styles.clientDetails}>
          <View style={styles.clientDetailsHeader}>
            <Text style={styles.clientDetailsName}>
              {selectedClient.name}
            </Text>
            <TouchableOpacity
              onPress={() => setSelectedClient(null)}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Macros</Text>
            <View style={styles.macroContainer}>
              <Text style={styles.macroLabel}>Protein:</Text>
              <Text style={styles.macroValue}>
                {selectedClient.macros.protein}g
              </Text>
            </View>
            <View style={styles.macroContainer}>
              <Text style={styles.macroLabel}>Carbs:</Text>
              <Text style={styles.macroValue}>
                {selectedClient.macros.carbs}g
              </Text>
            </View>
            <View style={styles.macroContainer}>
              <Text style={styles.macroLabel}>Fat:</Text>
              <Text style={styles.macroValue}>
                {selectedClient.macros.fat}g
              </Text>
            </View>
            <View style={styles.macroContainer}>
              <Text style={styles.macroLabel}>Calories:</Text>
              <Text style={styles.macroValue}>
                {selectedClient.macros.calories}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workout Split</Text>
            <Text style={styles.workoutSplit}>
              {selectedClient.workoutSplit || 'No workout split assigned'}
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={clients}
          renderItem={renderClientItem}
          keyExtractor={item => item.id}
          style={styles.clientList}
        />
      )}
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clientList: {
    flex: 1,
  },
  clientItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  clientEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  clientDetails: {
    flex: 1,
    padding: 20,
  },
  clientDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  clientDetailsName: {
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  macroLabel: {
    fontSize: 16,
    color: '#333',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  workoutSplit: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default CoachingScreen; 
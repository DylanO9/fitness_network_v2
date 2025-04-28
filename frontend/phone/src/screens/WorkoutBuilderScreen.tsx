import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WorkoutBuilderScreen: React.FC = () => {
    const [exercises, setExercises] = useState<string[]>([]);

    const addExercise = () => {
        setExercises([...exercises, `Exercise ${exercises.length + 1}`]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Workout Builder</Text>
            
            <ScrollView style={styles.exerciseContainer}>
                {exercises.length === 0 ? (
                    <Text style={styles.emptyText}>No exercises added yet. Tap the button below to start building your workout.</Text>
                ) : (
                    exercises.map((exercise, index) => (
                        <View key={index} style={styles.exerciseItem}>
                            <Text style={styles.exerciseText}>{exercise}</Text>
                        </View>
                    ))
                )}
            </ScrollView>
            
            <TouchableOpacity style={styles.addButton} onPress={addExercise}>
                <Text style={styles.addButtonText}>+ Add Exercise</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    exerciseContainer: {
        flex: 1,
        marginBottom: 16,
    },
    exerciseItem: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    exerciseText: {
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 40,
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default WorkoutBuilderScreen;
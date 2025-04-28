import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WorkoutPlannerScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Workout Planner</Text>
            <Text style={styles.subtitle}>Coming Soon</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
    },
});

export default WorkoutPlannerScreen;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CoachingScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Coaching Screen</Text>
            <Text style={styles.subtitle}>Coming Soon</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
});

export default CoachingScreen;
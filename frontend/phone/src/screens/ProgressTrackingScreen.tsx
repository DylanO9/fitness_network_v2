import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressTrackingScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Progress Tracking</Text>
            <Text style={styles.subtitle}>Coming Soon!</Text>
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
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        color: 'gray',
    },
});

export default ProgressTrackingScreen;

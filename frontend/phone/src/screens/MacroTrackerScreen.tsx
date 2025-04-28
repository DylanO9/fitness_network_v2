import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MacroTrackerScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Macro Tracker</Text>
            <Text style={styles.placeholder}>Coming soon...</Text>
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
    placeholder: {
        fontSize: 16,
        color: 'gray',
    },
});

export default MacroTrackerScreen;
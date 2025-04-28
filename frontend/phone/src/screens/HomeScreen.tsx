import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../App';
import { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenNavigationProp = NativeStackNavigationProp<MainTabParamList>;
type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
const HomeScreen = () => {
    const { logout } = useAuth(); // Get the logout function from AuthContext
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const loggedOutNavigation = useNavigation<RootStackNavigationProp>();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Fitness Network</Text>
            
            <View style={styles.quickActions}>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('MacroTracker')}
                >
                    <Text style={styles.actionButtonText}>Track Macros</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('WorkoutPlanner')}
                >
                    <Text style={styles.actionButtonText}>Start Workout</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('ProgressTracking')}
                >
                    <Text style={styles.actionButtonText}>Log Progress</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: '#e74c3c' }]}
                    onPress={async () => {
                        // Add logout logic here
                        // For example: auth.signOut();
                        // Remove token from AsyncStorage
                        logout();
                    }}
                >
                    <Text style={styles.actionButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
        textAlign: 'center',
    },
    quickActions: {
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: '#2ecc71',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default HomeScreen;

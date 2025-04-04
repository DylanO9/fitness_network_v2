import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProgressPhoto {
  id: string;
  uri: string;
  date: string;
  bodyPart: string;
  pose: string;
}

const ProgressTrackingScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const storedPhotos = await AsyncStorage.getItem('progressPhotos');
      if (storedPhotos) {
        setPhotos(JSON.parse(storedPhotos));
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const savePhoto = async (photo: ProgressPhoto) => {
    try {
      const newPhotos = [...photos, photo];
      await AsyncStorage.setItem('progressPhotos', JSON.stringify(newPhotos));
      setPhotos(newPhotos);
    } catch (error) {
      console.error('Error saving photo:', error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newPhoto: ProgressPhoto = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
        date: selectedDate,
        bodyPart: 'Full Body', // Default value
        pose: 'Front', // Default value
      };
      savePhoto(newPhoto);
    }
  };

  const getMarkedDates = () => {
    const marked: Record<string, any> = {};
    photos.forEach(photo => {
      marked[photo.date] = { marked: true, dotColor: '#2ecc71' };
    });
    marked[selectedDate] = { selected: true, marked: marked[selectedDate]?.marked };
    return marked;
  };

  const renderPhotoItem = ({ item }: { item: ProgressPhoto }) => (
    <TouchableOpacity
      style={styles.photoItem}
      onPress={() => setSelectedPhoto(item)}
    >
      <Image source={{ uri: item.uri }} style={styles.photo} />
      <View style={styles.photoInfo}>
        <Text style={styles.photoDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
        <Text style={styles.photoDetails}>
          {item.bodyPart} - {item.pose}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
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

      <View style={styles.content}>
        <TouchableOpacity style={styles.addButton} onPress={pickImage}>
          <Text style={styles.addButtonText}>Add Progress Photo</Text>
        </TouchableOpacity>

        <FlatList
          data={photos.filter(photo => photo.date === selectedDate)}
          renderItem={renderPhotoItem}
          keyExtractor={item => item.id}
          style={styles.photoList}
        />
      </View>

      {selectedPhoto && (
        <View style={styles.modal}>
          <Image source={{ uri: selectedPhoto.uri }} style={styles.modalPhoto} />
          <View style={styles.modalInfo}>
            <Text style={styles.modalDate}>
              {new Date(selectedPhoto.date).toLocaleDateString()}
            </Text>
            <Text style={styles.modalDetails}>
              {selectedPhoto.bodyPart} - {selectedPhoto.pose}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedPhoto(null)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  photoList: {
    flex: 1,
  },
  photoItem: {
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  photo: {
    width: '100%',
    height: 200,
  },
  photoInfo: {
    padding: 10,
  },
  photoDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  photoDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPhoto: {
    width: '90%',
    height: '60%',
    resizeMode: 'contain',
  },
  modalInfo: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 8,
  },
  modalDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalDetails: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  closeButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProgressTrackingScreen; 
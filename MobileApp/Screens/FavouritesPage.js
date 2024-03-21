import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Button, SafeAreaView, TouchableOpacity, Image, Dimensions, StatusBar, FlatList, ScrollView, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { saveMealToFirestore } from '../../MealHistory';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';





function ConfirmMealPage({ navigation }) {
  // Placeholder image URI
  const headerImageUri = 'https://via.placeholder.com/150'; // Update this to your desired image URL

  // Simulate a dynamic list of images
  const images = new Array(8).fill(headerImageUri); // Example: 8 images. Adjust the number as needed.

  const handlePress = () => {
    console.log("Placeholder image and text button pressed!");
    navigation.navigate('Confirm Meal');
    // You can navigate to another screen or execute any action here
    
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(173, 219, 199, 1)' }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.gridContainer}>
          {images.map((imageUri, index) => (
            index === 0 ? (
              <TouchableOpacity key={`container-${index}`} style={styles.imageContainer} onPress={handlePress}>
                <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
                <Text style={styles.imageText}>Fried Rice with Chicken</Text>
              </TouchableOpacity>
            ) : (
              <View key={`container-${index}`} style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
                {/* Optionally add text for other images similar to the first one */}
              </View>
            )
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(173, 219, 199, 1)',
    paddingBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', // Allows items to wrap to the next line
    justifyContent: 'space-around',
    paddingTop: 20,
  },
  imageContainer: {
    width: Dimensions.get('window').width / 2 - 20,
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    width: '100%', // Use the full width of the container
    height: 150, // Set a fixed height for the images
  },
  imageText: {
    marginTop: 8, 
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black', 
    textAlign: 'center',
  },
});

export default ConfirmMealPage;
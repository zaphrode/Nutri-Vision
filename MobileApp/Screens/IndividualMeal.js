import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Button, SafeAreaView, TouchableOpacity, Image, Dimensions, StatusBar, FlatList } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';


function IndividualMeal({navigation}) {
  // State to hold the image URI
  const [imageUri, setImageUri] = useState(null); // Initial state is null

  // Placeholder image URI
  const placeholderImageUri = 'https://via.placeholder.com/150'; // Placeholder URL
  

  // Placeholder ingredients
  const ingredients = [
    { id: '1', name: 'Rice', portion: '200g', imageUrl: 'https://via.placeholder.com/150' },
    { id: '2', name: 'Chicken', portion: '150g', imageUrl: 'https://via.placeholder.com/150' },
  ];

  // Placeholder function for button presses
  const handlePress = (action) => {
    console.log(`Pressed ${action}`);
  };

  const renderIngredientItem = ({ item }) => (
    <View>
      <View style={styles.ingredientItem}>
        <Image
          source={{ uri: item.imageUrl || placeholderImageUri }} // Fallback to the placeholder URI
          style={styles.ingredientImage}
        />
        <Text style={styles.ingredientName}>{item.name}</Text>
        <Text style={styles.ingredientPortion}>{item.portion}</Text>
      </View>
      <View style={styles.separator} />
    </View>
  );

  const AddIngredientButton = () => (
    <View>
      <TouchableOpacity style={styles.addIngredientButton} onPress={() => handlePress('Add Ingredient')}>
        <Text style={styles.addIngredientText}>Add Ingredients</Text>
        <MaterialIcons name="add-circle-outline" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.separator} />
    </View>
  );

  const ConfirmMealButton = () => (
    <TouchableOpacity style={styles.confirmMealButton} onPress={() => handlePress('Confirm Meal')}>
      <Text style={styles.confirmMealText}>Confirm Meal</Text>
    </TouchableOpacity>
  );
  

   // Placeholder mass and calories 
   const foodItemMass = "250g";
   const foodItemCalories = "450 Calories";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="rgba(173, 219, 199, 1)" barStyle="light-content" />
      <View style={styles.imageContainer}>
        {/* Image placeholder */}
        <Image
          source={{ uri: imageUri || placeholderImageUri }}
          style={styles.imageStyle}
          resizeMode="contain"
        />
        {/* Three-dot button */}
        <TouchableOpacity style={styles.threeDotButton} onPress={() => handlePress('More')}>
          <MaterialIcons name="more-horiz" size={30} color="black" />
        </TouchableOpacity>
        {/* Heart button */}
        <TouchableOpacity style={styles.heartButton} onPress={() => handlePress('Favorite')}>
          <MaterialIcons name="favorite-border" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.nutritionalInfoContainer}>
        <Text style={styles.nutritionalInfoContainerText}>Fried Rice with Chicken</Text>
        {/* Mass and Calories with Icons */}
        <View style={styles.nutritionalDetailsContainer}>
          <MaterialIcons name="fitness-center" size={20} color="rgb(127, 127, 127)" />
          <Text style={styles.nutritionalDetailsText}> 250g    </Text>
          <MaterialIcons name="local-fire-department" size={20} color="rgb(127, 127, 127)" />
          <Text style={styles.nutritionalDetailsText}> 550 kcal</Text>
        </View>
        <Text style={styles.ingredientsHeaderText}>Ingredients</Text>
        <FlatList
          data={ingredients}
          renderItem={renderIngredientItem}
          keyExtractor={item => item.id}
          ListFooterComponent={AddIngredientButton}
          style={styles.ingredientsList}
        />
        <ConfirmMealButton />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabItem} onPress={() => handlePress('Home')}>
            <MaterialIcons name="home" size={24} color="#4CAF50" />
            <Text style={styles.tabTitle}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItemCalories} onPress={() => handlePress('Calories')}>
            <MaterialIcons name="fastfood" size={24} color="#4CAF50" />
            <Text style={styles.tabTitle}>Calories</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.scannerButton} onPress={() => handlePress('Scanner')}>
            <MaterialIcons name="center-focus-strong" size={40} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItemProfile} onPress={() => handlePress('Profile')}>
            <MaterialIcons name="person" size={24} color="#4CAF50" />
            <Text style={styles.tabTitle}>Profile</Text>
          </TouchableOpacity>   
          <TouchableOpacity style={styles.tabItem} onPress={() => handlePress('History')}>
            <MaterialIcons name="manage-search" size={24} color="#4CAF50" />
            <Text style={styles.tabTitle}>History</Text>
          </TouchableOpacity>
          </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(173, 219, 199, 1)',
  },
  imageContainer: {
    backgroundColor: 'rgba(173, 219, 199, 1)', 
    paddingVertical: 10, 
    alignItems: 'center', 
    justifyContent: 'center',
    position: 'relative',
  },
  imageStyle: {
    width: 150,
    height: 150,
    marginTop: 30
  },
  threeDotButton: {
    position: 'absolute', 
    top: 15,
    right: 30, 
  },
  heartButton: {
    position: 'absolute', 
    top: 50,
    right: 30, 
  },
  nutritionalInfoContainer: {
    backgroundColor: 'white',
    borderRadius: 40, 
    margin: -50,
    marginLeft: 0,
    marginTop: 40, 
    flex: 1, 
    justifyContent: 'flex-start', 
  },
  nutritionalInfoContainerText: {
    color: 'rgb(127, 127, 127)', 
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
    margin: 16,
  },
  nutritionalDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 150,
  },
  nutritionalDetailsText: {
    fontSize: 18,
    color: 'rgb(127, 127, 127)',
  },
  ingredientsHeaderText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 16,
    marginLeft: 20,
    marginBottom: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  ingredientImage: {
    width: 40,
    height: 40,
    marginLeft: 50,
  },
  ingredientName: {
    fontSize: 16,
    color: 'rgb(127, 127, 127)',
    marginLeft: 80,
  },
  ingredientPortion: {
    fontSize: 16,
    color: 'rgb(127, 127, 127)',
    marginRight: 100,
    flex: 1,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: 'grey',
    alignSelf: 'stretch',
    marginTop: 8,
    marginLeft: 40,
    marginRight: 90,
  },
  addIngredientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginLeft: 40,
  },
  addIngredientText: {
    fontSize: 16,
    color: 'black',
    marginRight: 150,
  },
  confirmMealButton: {
    backgroundColor: 'grey', 
    borderRadius: 20, 
    paddingVertical: 20, 
    paddingHorizontal: 20, 
    marginVertical: 20, 
    marginHorizontal: 40, 
    marginRight: 90,
    marginBottom: 120,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  confirmMealText: {
    fontSize: 16, 
    color: 'white',
    fontWeight: 'bold',
  },

  bottomContainer: {
    position: 'absolute', 
    bottom: 5,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingVertical: 20, 
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center', 
    height: 50, 
  },
  tabItemCalories: {
    alignItems: 'center',
    marginRight: 20,
  },
  
  tabItemProfile: {
    alignItems: 'center',
    marginLeft: 20,
  },
  tabItem: {
    alignItems: 'center', 
  },
  scannerButton: {
    backgroundColor: '#ccc', 
    height: 75, 
    width: 75, 
    borderRadius: 37.5, // Half the size of width to make it a circle
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -37.5,
    marginRight: -27.5,
    top: -10,
    elevation: 4, 
    shadowColor: '#000', // Optional: adds shadow on iOS
    shadowOffset: { width: 0, height: 2 }, // Optional: adds shadow on iOS
    shadowOpacity: 0.25, // Optional: adds shadow on iOS
    shadowRadius: 3.84, // Optional: adds shadow on iOS
  },
  tabTitle: {
    color: '#4CAF50', 
    fontSize: 15, 
    marginTop: 4,
  },

});

export default IndividualMeal;
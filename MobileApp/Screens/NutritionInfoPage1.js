import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Button, SafeAreaView, TouchableOpacity, Image, Dimensions, StatusBar, FlatList, ScrollView, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { saveMealToFirestore } from '../../MealHistory';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';





function ConfirmMealPage({ navigation }) {
  // State to hold the image URI
  const [imageUri, setImageUri] = useState(null); // Initial state is null

  // Placeholder image URI
  const placeholderImageUri = 'https://via.placeholder.com/150'; // Placeholder URL

  // State variables for nutritional information
  const [servingSize, setServingSize] = useState('Loading...');
  const [calories, setCalories] = useState('Loading...');
  const [carbohydrates, setCarbohydrates] = useState('Loading...');
  const [fats, setFats] = useState('Loading...');
  const [protein, setProtein] = useState('Loading...');

  const fetchNutritionalInfo = async () => {
    try {
      // Simulate fetching data from an API
      // This is where you would make your actual API call
      const apiResponse = {
        servingSize: '1 portion',
        calories: '550 kcal',
        carbohydrates: '200 g',
        fats: '50 g',
        protein: '100 g',
      };
      // Update state variables with the API response
      setServingSize(apiResponse.servingSize);
      setCalories(apiResponse.calories);
      setCarbohydrates(apiResponse.carbohydrates);
      setFats(apiResponse.fats);
      setProtein(apiResponse.protein);
    } catch (error) {
      console.error('Error fetching nutritional info:', error);
      // Handle error or set default error values here
    }
  };

  // Trigger the API call on component mount
  useEffect(() => {
    fetchNutritionalInfo();
  }, []); // Empty dependency array means this runs once on mount

  // State for heart button
  const [isHeartActive, setIsHeartActive] = useState(false);

  // Toggle heart state
  const toggleHeart = () => {
    setIsHeartActive(!isHeartActive); // Toggle between true and false
  };

  // Placeholder function for button presses
  const handlePress = (action) => {
    console.log(`Pressed ${action}`);
  };

  const ConfirmMealButton = () => (
    <TouchableOpacity style={styles.confirmMealButton} onPress={handlePress}>
      <Text style={styles.confirmMealText}>It fits your target!</Text>
    </TouchableOpacity>
  );

  const [carbsPercentage, setCarbsPercentage] = useState(70); // Example percentage
  const [fatsPercentage, setFatsPercentage] = useState(55); // Example percentage
  const [proteinPercentage, setProteinPercentage] = useState(25); // Example percentage


  const ProgressCircle = ({ percentage, fillColor, label }) => {
    const size = 75; // Diameter of the circle
    const strokeWidth = 5; // Width of the circle border
    const radius = (size / 2) - (strokeWidth * 2); // Radius of the circle
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
    return (
      <View style={{ alignItems: 'center', margin: 10 }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            stroke="#ddd" // This is the color for the "unfilled" part of the circle
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke={fillColor}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          />
        </Svg>
        <Text style={{ position: 'absolute', fontWeight: 'bold', top: size * 0.35 }}>{percentage}%</Text>
        <Text style={{ marginTop: 4, fontWeight: 'bold' }}>{label}</Text> 
      </View>
    );
  };


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
        <TouchableOpacity style={styles.heartButton} onPress={toggleHeart}>
        <MaterialIcons
            name={isHeartActive ? "favorite" : "favorite-border"} // Change icon based on state
            size={30}
            color={isHeartActive ? "red" : "black"} // Change color based on state
          />
        </TouchableOpacity>
      </View>
      <View style={styles.nutritionalInfoContainer}>
        <Text style={styles.nutritionalInfoContainerText}>Fried Rice with Chicken</Text>
        {/* Mass and Calories with Icons */}
        <View style={styles.nutritionalDetailsContainer}>
          <MaterialIcons name="fitness-center" size={20} color="rgb(127, 127, 127)" />
          <Text style={styles.nutritionalDetailsText}> 350g    </Text>
          <MaterialIcons name="local-fire-department" size={20} color="rgb(127, 127, 127)" />
          <Text style={styles.nutritionalDetailsText}> 550 kcal</Text>
        </View>
        {/*Nutritional Information */}
        <Text style = {styles.ingredientsHeaderText}>Nutritional Information</Text>
        <View style={styles.innerGreyContainer}>
          <View style={styles.nutritionalInfoRow}>
            <Text style={styles.labelText}>Serving Size:</Text>
            <Text style={styles.valueText}>{servingSize}</Text>
          </View>
          <View style={styles.nutritionalInfoRow}>
            <Text style={styles.labelText}>Calories:</Text>
            <Text style={styles.valueText}>{calories}</Text>
          </View>
          <View style={styles.nutritionalInfoRow}>
            <Text style={styles.labelText}>Carbohydrates:</Text>
            <Text style={styles.valueText}>{carbohydrates}</Text>
          </View>
          <View style={styles.nutritionalInfoRow}>
            <Text style={styles.labelText}>Fats:</Text>
            <Text style={styles.valueText}>{fats}</Text>
          </View>
          <View style={styles.nutritionalInfoRow}>
            <Text style={styles.labelText}>Protein:</Text>
            <Text style={styles.valueText}>{protein}</Text>
          </View>
        </View>
        {/* Nutritional information progress circles */}
        <View style={styles.progressCirclesContainer}>
          <ProgressCircle percentage={carbsPercentage} fillColor="brown" label="Carbohydrates" />
          <ProgressCircle percentage={fatsPercentage} fillColor="yellow" label="Fats" />
          <ProgressCircle percentage={proteinPercentage} fillColor="blue" label="Proteins" />
        </View>
        <ConfirmMealButton />
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
    padding: 16,
    margin: -50,
    marginLeft: 0,
    marginTop: 10,
    flex: 1,
    justifyContent: 'flex-start',
  },
  nutritionalInfoContainerText: {
    color: 'rgb(127, 127, 127)',
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'flex-start',
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

  innerGreyContainer: {
    backgroundColor: '#E0E0E0', 
    borderRadius: 20, 
    padding: 20, 
    marginHorizontal: 20,
    marginTop: 10, 
    marginRight: 70,
    marginLeft: 20,
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  nutritionalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    alignItems: 'center',
  },
  
  labelText: {
    fontSize: 20,
    color: 'rgb(0, 0 ,0)',
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
  },
  
  
  valueText: {
    fontSize: 18,
    color: 'rgb(0, 0 , 0)',
    fontWeight: 'bold',
    textAlign: 'right', 
    flex: 1, 
  },

  progressCirclesContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    alignItems: 'center', 
    marginTop: 10,
    marginRight: 50,
  },

  confirmMealButton: {
    backgroundColor: 'rgb(96, 190, 61)',
    borderRadius: 20,
    paddingVertical: 20,
    marginVertical: 10,
    marginRight: 70,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmMealText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },

});

export default ConfirmMealPage;
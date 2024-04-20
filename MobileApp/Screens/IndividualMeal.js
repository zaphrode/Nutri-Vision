import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, Image, StatusBar, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getMealEntryById, updateMealDataInFirestore } from '../../MealHistory';
import Svg, { Circle } from 'react-native-svg';
import { fetchUserGoalDetails } from '../../goalsDetail';


function IndividualMeal({ route }) {

  // This will read the data passed from the navigate function in the HistoryPage.js
  const { documentId } = route.params;
  //Set initial meal entry to null, and initial goal details to  empty 
  const [mealEntry, setMealEntry] = useState(null);
  const [goalsDetails, setGoalsDetails] = useState([]);

  useEffect(() => {
    fetchUserGoalDetails('haolun@gmail.com').then(setGoalsDetails).catch(console.error);
    if (documentId) {
      fetchNutritionalInfo(documentId);
    }
  }, [documentId]);

  // Goals for macronutrients
  const goalCalories = goalsDetails.Calories;
  const goalCarbohydrates = goalsDetails.Carbs;
  const goalProtein = goalsDetails.Protein;
  const goalFat = goalsDetails.Fats;

  // State to hold the image URI
  const [imageUri, setImageUri] = useState(null); // Initial state is null

  // Placeholder image URI
  const placeholderImageUri = 'https://via.placeholder.com/150'; // Placeholder URL

  //Set the macro nutrients values
  const [calories, setCalories] = useState('Loading...');
  const [carbohydrates, setCarbohydrates] = useState('Loading...');
  const [protein, setProtein] = useState('Loading...');
  const [totalFat, setTotalFat] = useState('Loading...');

  // For toggling favourites 
  const [isFavorite, setIsFavorite] = useState(false);
  // State for heart button color
  const [heartColor, setHeartColor] = useState("black");

  // This function fetches nutritional info by the meal document Id from Firebase.
  // It then sets the heart colour according to the boolean 'favourite' attribute in Firebase. If favourite == true, heart is red; else heart is black.
  // It displays the values of calories, carbs, proteins and fats of the specific meal Id, and its corresponding image 
  const fetchNutritionalInfo = async (documentId) => {
    try {
      if (!documentId) {
        throw new Error('Document ID is missing.');
      }

      const mealEntry = await getMealEntryById(documentId);
      console.log('Fetched meal entry:', mealEntry); 

      setMealEntry(mealEntry);
      setIsFavorite(mealEntry.favourite); // Set isFavorite state based on fetched data
      setHeartColor(mealEntry.favourite ? "red" : "black"); // Set heart color based on fetched data
      const attributesToDisplay = ['calories', 'carbohydrates', 'protein', 'totalFat', 'picture'];
      attributesToDisplay.forEach(attribute => {
        if (mealEntry[attribute] !== 0) {
          switch (attribute) {
            case 'calories':
              setCalories(mealEntry[attribute]);
              break;
            case 'carbohydrates':
              setCarbohydrates(mealEntry[attribute]);
              break;
            case 'protein':
              setProtein(mealEntry[attribute]);
              break;
            case 'totalFat':
              setTotalFat(mealEntry[attribute]);
              break;
            case 'picture':
              setImageUri(mealEntry[attribute]);
            default:
              break;
          }
        }
      });

    } catch (error) {
      console.error('Error fetching nutritional info:', error);
    }
  };

  // Total of each macronutrients consumed
  const totalCaloriesConsumed = calories;
  const totalCarbohydratesConsumed = carbohydrates;
  const totalFatConsumed = totalFat;
  const totlaProteinConsumed = protein;

  // Calculating percentages of macros 
  const calculateCaloriePercentage = () => {
    if (goalCalories > 0) {
      return (totalCaloriesConsumed / goalCalories) * 100;
    }
    return 0;
  };

  const calculateCarbohydratePercentage = () => {
    if (goalCarbohydrates > 0) {
      return (totalCarbohydratesConsumed / goalCarbohydrates) * 100;
    }
    return 0;
  };

  const calculateFatPercentage = () => {
    if (goalFat > 0) {
      return (totalFatConsumed / goalFat) * 100;
    }
    return 0;
  };

  const calculateProteinPercentage = () => {
    if (goalProtein > 0) {
      return (totlaProteinConsumed / goalProtein) * 100;
    }
    return 0;
  };

  // Calculate the percentages for the Circles
  const caloriePercantage = Math.min(calculateCaloriePercentage(), 100);
  const CarbohydratePercentage = Math.min(calculateCarbohydratePercentage(), 100);
  const FatPercentage = Math.min(calculateFatPercentage(), 100);
  const ProteinPercentage = Math.min(calculateProteinPercentage(), 100);


  // Trigger the API call on component mount and when route parameters change
  useEffect(() => {
    if (documentId) {
      fetchNutritionalInfo(documentId);
    }
  }, [documentId]); 

  // Update favourites attribute in database when heart icon is pressed
  const toggleFavorite = async () => {
    try {
      // Toggle the favorite status locally
      setIsFavorite(!isFavorite);

      // Update the database to reflect the change
      updateMealDataInFirestore(documentId, { favourite: !isFavorite });
      setHeartColor(!isFavorite ? "red" : "black");
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      // Handle error
    }
  };

  // Placeholder function for button presses
  const handlePress = (action) => {
    console.log(`Pressed ${action}`);
  };

  //To display the percentage of macros in a circle chart 
  const ProgressCircle = ({ percentage, fillColor, label, value }) => {
    const size = 75; 
    const strokeWidth = 5; 
    const radius = (size / 2) - (strokeWidth * 2); 
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={{ alignItems: 'center', margin: 10, position: 'relative' }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            stroke="#ddd"
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
        {/* Percentage Text with absolute positioning */}
        <Text style={{
          position: 'absolute',
          fontWeight: 'bold',
          fontSize: 14, // Adjust the font size as needed
          left: '55%',
          top: '35%',
          transform: [{ translateX: -size * 0.2 }, { translateY: -size * 0.1 }],
        }}>
          {Math.round(percentage)}%
        </Text>
        {/* Label and Value Text */}
        <Text style={{ fontWeight: 'bold', marginTop: 4 }}>{label}</Text>
      </View>
    );
  };



  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <StatusBar backgroundColor="rgba(173, 219, 199, 1)" barStyle="light-content" />
        <View style={styles.imageContainer}>
          {/* Image placeholder */}
          <Image
            source={{ uri: `data:image/png;base64,${imageUri}` || placeholderImageUri }}
            style={styles.imageStyle}
            resizeMode="contain"
          />
          {/* Heart button */}
          <TouchableOpacity style={styles.heartButton} onPress={toggleFavorite}>
            <MaterialIcons
              name={isFavorite ? "favorite" : "favorite-border"} 
              size={30}
              color={heartColor} 
            />
          </TouchableOpacity>
        </View>
        <View style={styles.nutritionalInfoContainer}>
          <Text style={styles.nutritionalInfoContainerText}>{mealEntry && mealEntry.name}</Text>
          {/* Mass and Calories with Icons */}
          <View style={styles.nutritionalDetailsContainer}>
            <MaterialIcons name="local-fire-department" size={20} color="rgb(127, 127, 127)" />
            <Text style={styles.nutritionalDetailsText}> {calories} </Text>
          </View>
          {/*Nutritional Information */}
          <Text style={styles.ingredientsHeaderText}>Nutritional Information</Text>
          <View style={styles.innerGreyContainer}>

            <View style={styles.nutritionalInfoRow}>
              <Text style={styles.labelText}>Calories:</Text>
              <Text style={styles.valueText}>{calories}</Text>
            </View>
            <View style={styles.nutritionalInfoRow}>
              <Text style={styles.labelText}>Carbohydrates:</Text>
              <Text style={styles.valueText}>{carbohydrates}</Text>
            </View>
            <View style={styles.nutritionalInfoRow}>
              <Text style={styles.labelText}>Protein:</Text>
              <Text style={styles.valueText}>{protein}</Text>
            </View>
            <View style={styles.nutritionalInfoRow}>
              <Text style={styles.labelText}>Total Fat:</Text>
              <Text style={styles.valueText}>{totalFat}</Text>
            </View>
          </View>
          {/* Nutritional information progress circles */}
          <View style={styles.progressCirclesContainer}>
            <ProgressCircle percentage={CarbohydratePercentage} fillColor="brown" label="Carbohydrates" value={carbohydrates} />
            <ProgressCircle percentage={FatPercentage} fillColor="yellow" label="Fats" value={totalFat} />
            <ProgressCircle percentage={ProteinPercentage} fillColor="blue" label="Proteins" value={protein} />
          </View>

        </View>
      </ScrollView>
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
    padding: 10,
    paddingBottom: 160,
    marginTop: 10,
    marginBottom: 100,
    flex: 1,
    justifyContent: 'flex-start',
  },
  nutritionalInfoContainerText: {
    color: 'rgb(127, 127, 127)',
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
    justifyContent: 'flex-start',
    margin: 16,
  },
  nutritionalDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'auto',
    marginTop: 8,
    marginLeft: 250
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
    marginRight: 30,
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
    marginTop: 80,
    marginRight: 20,
  },


  progressLabel: {
    marginTop: 8, 
    fontSize: 14, 
    color: 'rgb(127, 127, 127)', 
    fontWeight: 'bold', 
  },

  progressCircleCarbs: {
    height: 75,
    width: 75,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: 'brown',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleFats: {
    height: 75,
    width: 75,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleProtein: {
    height: 75,
    width: 75,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },


  confirmMealText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },

});

export default IndividualMeal;
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, Image, StatusBar } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { saveMealToFirestore, updateMealDataInFirestore } from '../../MealHistory';
import { fetchNutritionalInfo } from '../../CalorieNinjaAPI';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import { fetchUserGoalDetails, checkMealTarget } from '../../goalsDetail';

/**
 * Displays nutritional information and allows user interactions for saving or adjusting meal preferences.
 * @param {object} route - Contains parameters passed from the previous screen.
 * @param {object} navigation - Allows navigation to other screens.
 */
function NutritionalInfoPage({ route, navigation }) {
  const { content } = route.params;
  const { base64Image } = route.params;

  /** State for storing the image URI for display */
  const [imageUri, setImageUri] = useState(null);

  /** Placeholder URI for image display */
  const placeholderImageUri = 'https://via.placeholder.com/150';

  /** State variables to store nutritional values */
  const [calories, setCalories] = useState('Loading...');
  const [carbohydrates, setCarbohydrates] = useState('Loading...');
  const [fats, setFats] = useState('Loading...');
  const [protein, setProtein] = useState('Loading...');
  const [mealName, setMealName] = useState(null);
  const [mealId, setMealId] = useState(null);
  const [isTargetFit, setIsTargetFit] = useState(null);

  const { ingredients } = route.params;

  /** Fetches and sets nutritional info based on ingredients */
  useEffect(() => {
    console.log("Received ingredients:", ingredients);
    setImageUri(base64Image);
    fetchNutritionalInfo(ingredients)
      .then(data => {
        let totalCalories = 0;
        let totalCarbohydrates = 0;
        let totalFats = 0;
        let totalProtein = 0;
        let ingredientNames = [];

        data.items.forEach(item => {
          totalCalories += item.calories;
          totalCarbohydrates += item.carbohydrates_total_g;
          totalFats += item.fat_total_g;
          totalProtein += item.protein_g;

          ingredientNames.push(item.name);
        });

        totalCalories = Math.round(totalCalories);
        totalCarbohydrates = Math.round(totalCarbohydrates);
        totalFats = Math.round(totalFats);
        totalProtein = Math.round(totalProtein);

        const mealName = ingredientNames.join(' , ');
        setMealName(mealName);
        setCalories(totalCalories);
        setCarbohydrates(totalCarbohydrates);
        setFats(totalFats);
        setProtein(totalProtein);

        checkMealTarget('haolun@gmail.com', totalCalories) 
        .then(result => {
          setIsTargetFit(result);
        });

        const mealData = {
          name: mealName,
          calories: totalCalories,
          carbohydrates: totalCarbohydrates,
          totalFat: totalFats,
          protein: totalProtein,
          createdAt: new Date(),
          favourite: false,
          picture: base64Image
        };

        saveMealToFirestore(mealData)
          .then(mealId => {
            setMealId(mealId);
            console.log('Combined meal saved with ID:', mealId);
          })
          .catch(error => console.error('Error saving combined meal:', error));
      })
      .catch(error => console.error('Error fetching nutritional info:', error));
  }, [base64Image, ingredients]);

  /** Toggles the favorite status of the meal */
  const [isFavorite, setIsFavorite] = useState(false);
  const [heartColor, setHeartColor] = useState("black");

  /** Updates favorite status in the database */
  const toggleFavorite = async () => {
    try {
      setIsFavorite(!isFavorite);
      updateMealDataInFirestore(mealId, { favourite: !isFavorite });
      setHeartColor(!isFavorite ? "red" : "black");
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  /** Logs button presses for diagnostic purposes */
  const handlePress = (action) => {
    console.log(`Pressed ${action}`);
  };

  /** Component to display a button based on meal fit to target */
  const ConfirmMealButton = () => {
    if (isTargetFit == true) {
      return (
        <TouchableOpacity style={[styles.confirmMealButton, { backgroundColor: 'rgb(96, 190, 61)' }]} onPress={() => navigation.navigate('Tabs')}>
          <Text style={styles.confirmMealText}>It fits your target!</Text>
        </TouchableOpacity>
      );
    } else if (isTargetFit == false) {
      return (
        <TouchableOpacity style={[styles.confirmMealButton, { backgroundColor: 'red' }]} onPress={() => navigation.navigate('Tabs')}>
          <Text style={styles.confirmMealText}>It does not fit your target!</Text>
        </TouchableOpacity>
      );
    }
  };

  /** Sets initial macros percentages */
  const [carbsPercentage, setCarbsPercentage] = useState(0);
  const [fatsPercentage, setFatsPercentage] = useState(0);
  const [proteinPercentage, setProteinPercentage] = useState(0);

  /** Updates macro percentages based on user goals */
  useEffect(() => {
    const fetchGoalDetails = async () => {
      try {
        const userEmail = 'haolun@gmail.com';
        const goalDetails = await fetchUserGoalDetails(userEmail);
        const targetCarbs = goalDetails.Carbs;
        const targetFats = goalDetails.Fats;
        const targetProtein = goalDetails.Protein;
        const carbsPercent = Math.round((carbohydrates / targetCarbs) * 100);
        const fatsPercent = Math.round((fats / targetFats) * 100);
        const proteinPercent = Math.round((protein / targetProtein) * 100);
        setCarbsPercentage(carbsPercent);
        setFatsPercentage(fatsPercent);
        setProteinPercentage(proteinPercent);
      } catch (error) {
        console.error('Error fetching user goal details:', error);
      }
    };
    fetchGoalDetails();
  }, [carbohydrates, fats, protein]);

  /** Renders a progress circle for macronutrients */
  const ProgressCircle = ({ percentage, fillColor, label }) => {
    const size = 75;
    const strokeWidth = 5;
    const radius = (size / 2) - (strokeWidth * 2);
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={{ alignItems: 'center', margin: 10 }}>
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
        <Text style={{ position: 'absolute', fontWeight: 'bold', top: size * 0.35 }}>{percentage}%</Text>
        <Text style={{ marginTop: 4, fontWeight: 'bold' }}>{label}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="rgba(173, 219, 199, 1)" barStyle="light-content" />
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `data:image/png;base64,${imageUri}` || placeholderImageUri }}
          style={styles.imageStyle}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.heartButton} onPress={toggleFavorite}>
          <MaterialIcons
            name={isFavorite ? "favorite" : "favorite-border"} 
            size={30}
            color={heartColor} 
          />
        </TouchableOpacity>
      </View>
      <View style={styles.nutritionalInfoContainer}>
        <Text style={styles.nutritionalInfoContainerText}>{mealName}</Text>
        <View style={styles.nutritionalDetailsContainer}>
          <MaterialIcons name="local-fire-department" size={20} color="rgb(127, 127, 127)" />
          <Text style={styles.nutritionalDetailsText}>{calories}</Text>
        </View>
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
            <Text style={styles.labelText}>Fats:</Text>
            <Text style={styles.valueText}>{fats}</Text>
          </View>
          <View style={styles.nutritionalInfoRow}>
            <Text style={styles.labelText}>Protein:</Text>
            <Text style={styles.valueText}>{protein}</Text>
          </View>
        </View>
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
    textAlign: 'auto',
    margin: 16,
  },
  nutritionalDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'auto',
    marginTop: 8,
    marginLeft: 250,
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

  progressCircleContainer: {
    alignItems: 'center',
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
  progressValue:
  {
    fontWeight: 'bold',
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

export default NutritionalInfoPage;

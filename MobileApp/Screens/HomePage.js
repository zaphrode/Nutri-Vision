import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Image, Platform, SafeAreaView, ScrollView, 
        StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { getMealHistoryFromFirestore } from '../../MealHistory';
import { getProfileByEmail } from '../../ProfileHistory';
import { fetchUserGoalDetails } from '../../goalsDetail';

export default function HomePage({navigation}) {

    // Variables for date
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Variables for meals and goals
    const [mealEntries, setMealEntries] = useState([]);
    const [goalsDetails, setGoalsDetails] = useState([]);

    // Goals for macronutrients
    const goalCalories = goalsDetails.Calories;
    const goalCarbohydrates = goalsDetails.Carbs;
    const goalProtein = goalsDetails.Protein;
    const goalFat = goalsDetails.Fats;

    // Total of each macronutrients consumed
    const totalCaloriesConsumed = mealEntries.reduce((total, entry) => total + entry.calories, 0);
    const totalCarbohydratesConsumed = mealEntries.reduce((total,entry) => total + entry.carbohydrates,0);
    const totalFatConsumed = mealEntries.reduce((total,entry) => total + entry.totalFat, 0);
    const totlaProteinConsumed = mealEntries.reduce((total,entry) => total + entry.protein,0);   

    // Calculating percentages
    const calculateCaloriePercentage = () => {
        if (goalCalories > 0){
            return (totalCaloriesConsumed / goalCalories) * 100;
        }
        return 0;
    };

    const calculateCarbohydratePercentage = () => {
        if (goalCarbohydrates > 0){
            return (totalCarbohydratesConsumed / goalCarbohydrates) * 100;
        }
        return 0;
    };

    const calculateFatPercentage = () => {
        if (goalFat > 0){
            return (totalFatConsumed / goalFat) * 100;
        }
        return 0;
    };

    const calculateProteinPercentage = () => {
        if (goalProtein > 0){
            return (totlaProteinConsumed / goalProtein) * 100;
        }
        return 0;
    };

    // Calculate the percentages for the Circles
    const caloriePercantage = Math.min(calculateCaloriePercentage(), 100);
    const CarbohydratePercentage = Math.min(calculateCarbohydratePercentage(), 100);
    const FatPercentage = Math.min(calculateFatPercentage(), 100);
    const ProteinPercentage = Math.min(calculateProteinPercentage(), 100);
    const progressPercentage = Math.round((caloriePercantage + CarbohydratePercentage + FatPercentage + ProteinPercentage)/4);


   // Handles navigation to Community Page
    const onGetStartedPress = () => {
        console.log('Navigation object:', navigation);
        navigation.navigate('Community');
    };


    // Filter entries based on selected date
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const formatDate = (date) => {
        return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    };

    // Allows the component to interact with external system (Firestore database)
    useEffect(() => {
        fetchMealEntriesForDate(date); 
    }, [date]);


    const fetchMealEntriesForDate = async (date) => {
        try {
            const dateString = date.toISOString().split('T')[0]; 
            const entries = await getMealHistoryFromFirestore(dateString);
            setMealEntries(entries);
        } catch(error) {
            console.error('Error fetching meal entries', error);
        }
    }

    const [avatarUrl, setAvatarUrl] = useState();

    useEffect(() => {
        fetchProfileByEmail();
    }, []);

    const fetchProfileByEmail = async () => {
        try {
            const email = "haolun@gmail.com"; 
            const profiles = await getProfileByEmail(email); 
            if (profiles.length > 0) {
                const profile = profiles[0];
                // Handling avatarUrl
                if (profile.avatarUrl) {
                    setAvatarUrl(profile.avatarUrl); 
                } else {
                    console.log('Profile found but no avatar URL present.');
                }

                // Fetch and set goals details
                const goals = await fetchUserGoalDetails(email);
                setGoalsDetails(goals);
                console.log('Goal Details:', goals); 
            } else {
                console.log('No profile found for the given email:', email);
            }
        } catch (error) {
            console.error("Error fetching profile by email:", error);
        }
    };


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
            <Text style={{ position: 'absolute', fontWeight: 'bold', top: size * 0.35 }}>{Math.round(percentage)}%</Text>
            <Text style={{ marginTop: 4, fontWeight: 'bold' }}>{label}</Text> 
        </View>
        );
    };

    const CalorieProgressCircle = ({ percentage, calories }) => {
        const size = 180; 
        const strokeWidth = 12; 
        const radius = (size / 2) - (strokeWidth * 2); 
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 20 }}>
                <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <Circle
                        stroke="#eee"
                        fill="none"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                    />
                    <Circle
                        stroke="#FFA726"
                        fill="none"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform={`rotate(-90, ${size / 2}, ${size / 2})`}
                    />
                </Svg>
                <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 34, fontWeight: 'bold' }}>{calories}</Text>
                    <Text style={{ fontSize: 18, color: '#555' }}>KCAL</Text>
                </View>
            </View>
        );
    };

    const HeartRateTracker = ({ percentage, fillColor }) => {
        const size = 150; // Diameter
        const strokeWidth = 8; // Width 
        const radius = (size - strokeWidth) / 2; // Radius
        const circumference = Math.PI * radius;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        return (
            <View style = { {width: size, height: size/2, alignItems : 'center', justifyContent: 'center',}}>
                <Svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`}>
                    <Path
                        d={`M ${strokeWidth / 2}, ${size / 2}
                            A ${radius},${radius} 0 0 1 ${size - (strokeWidth / 2)},${size / 2}`}
                        fill="none"
                        stroke="#ddd"
                        strokeWidth={strokeWidth}
                    />
                    <Path
                        d={`M ${strokeWidth / 2}, ${size / 2}
                            A ${radius},${radius} 0 0 1 ${size - (strokeWidth / 2)},${size / 2}`}
                        fill="none"
                        stroke={fillColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </Svg>
                <View style={{ position: 'absolute', bottom: 0, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: fillColor }}>{`${percentage}%`}</Text>
                    <Text style={{ fontSize: 14, color: '#666' }}>My Progress</Text>
                </View>
            </View>
        );
    };



    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.topSection}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: avatarUrl }}
                            style={styles.avatar}
                        />
                    </View>
                    <View style={styles.titleAndDatePicker}>
                        <Text style={styles.headerText}>Home Page</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerRow}>
                            <FontAwesomeIcon name="calendar" size={24} color="#000" />
                            <Text style={styles.datePickerText}>{formatDate(date)}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onChange}
                            />
                        )}
                    </View>
                </View>


                <View style={styles.caloriesSection}>
                    <Text style={styles.caloriesTitle}>My Calories</Text>
                    <CalorieProgressCircle percentage={caloriePercantage} calories={totalCaloriesConsumed} />

                    {/* Nutritional information progress circles */}
                    <View style={styles.progressCirclesContainer}>
                        <ProgressCircle percentage={CarbohydratePercentage} fillColor="brown" label="Carbohydrates" />
                        <ProgressCircle percentage={FatPercentage} fillColor="yellow" label="Fats" />
                        <ProgressCircle percentage={ProteinPercentage} fillColor="blue" label="Proteins" />
                    </View>
                </View>

                <View style = {styles.divider} >

                </View>

                <View style={styles.targetSection}>
                    <Text style = {styles.targetTitle}>My Target</Text>
                    <HeartRateTracker
                        percentage = {progressPercentage}
                        fillColor="#FF4500" 
                        label = "Heart Rate"
                    />
                </View>

                <View style = {styles.recipe}>
                    <Text style = {styles.recipeTitle}>Recipes Recommendation</Text> 
                    <Text style = {styles.recipeDescription} >
                        Get started with our personalized recipe recommendations!
                    </Text>

                    <View style = {styles.recipeHighlight} >
                        <Image
                            source={require('../assets/images/ChickenRice.jpg')}
                            style={styles.recipeImage}
                        />
                        <View style = {styles.TextContainer}>
                            <Text style={styles.recipeName}>CHICKEN RICE</Text>
                            <Text style={styles.recipeTime}>20 Mins Preparation Time</Text>
                            <Text style = {styles.difficulty}>Difficulty Level: Easy</Text>
                        </View>
                    </View>
                    <View style = {styles.recipeButtons}>
                        <TouchableOpacity onPress = {onGetStartedPress} style = {styles.buttonGetStarted}>
                            <Text style = {styles.buttonText}>Get Started</Text>
                        </TouchableOpacity>
                    </View>
                </View>


            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f4e5c2',
    },
    
    container: {
        flex: 1,
        backgroundColor: '#f4e5c2',
    },

    topSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    avatarContainer: {
        marginRight: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    titleAndDatePicker: {
        flex: 1,
    },
    headerText: {
        fontSize: 33,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    datePickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    datePickerText: {
        marginLeft: 10,
        fontSize : 15,
        fontWeight : 'bold',
    },


    caloriesSection: {
        padding: 16,
        backgroundColor: '#FFF',
        alignItems: 'center',
    },

    caloriesTitle: {
        fontSize: 21,
        fontWeight: 'bold',
        textAlign : 'center',
    },

    progressCirclesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    

    targetSection: {
        padding: 16,
        backgroundColor: '#fff',
        textAlign : 'center',
        alignItems : 'center',
    },

    targetTitle: {
        fontSize: 21,
        fontWeight: 'bold',
    },

    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#fff',
    },

    divider: {
        height: 4,
        backgroundColor: '#f4e5c2',
        marginVertical: 3,
    },

    recipe: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 10,
        marginHorizontal: 25,
        marginTop: 20,
    },

    recipeTitle: {
        fontSize: 23,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },

    recipeDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop : -5,
    },

    recipeHighlight: {
        flexDirection : 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom : 5,
    },

    TextContainer: {
        flexDirection: 'column',
    },

    recipeImage: {
        width: 60,
        height: 60,
        marginRight: 40,
    },

    recipeButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around', 
    },

    recipeName: {
        fontSize : 20,
        fontWeight : 'bold',
        color: '#333333',
    },

    recipeButtons : {
        flexDirection : 'row',
        justifyContent : 'center',
        alignContent : 'center',
    },

    recipeTime: {
        fontSize : 15,
        color : '#555555',
        textAlign : 'center',
    },
    buttonGetStarted: {
        backgroundColor: '#FFA500',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },

    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

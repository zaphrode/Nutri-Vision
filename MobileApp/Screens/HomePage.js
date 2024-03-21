import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Platform, Button, Image, SafeAreaView, ScrollView, TouchableOpacity, Linking} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
//import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


export default function HomePage({navigation}) {

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
  
    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShowDatePicker(Platform.OS === 'ios');
      setDate(currentDate);
    };
  
    const formatDate = (date) => {
      return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    };


    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.topSection}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={require('../assets/hacker.png')}
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
                    <View style={styles.progressCircle}>
                        <Text>1500 KCAL</Text>
                    </View>
                    {/* Percentage indicators for macronutrients */}
                    <View style={styles.macros}>
                        <Text>46% Carbohydrates</Text>
                        <Text>74% Protein</Text>
                    <   Text>14% Fat</Text>
                    </View>
                </View>

                <View style={styles.targetSection}>
                    {/* Heart rate gauge component */}
                </View>

                <View style={styles.mealsSection}>
                    <Text style={styles.mealsTitle}>Today's Meals:</Text>
                    {/* List of meals */}
                    <View style={styles.mealItem}>
                        <Image style={styles.mealImage} source={require('../assets/icon.png')} />
                        <Text>Breakfast</Text>
                        <Text>230 Kcal</Text>
                        <FontAwesomeIcon name="chevron-right" type="font-awesome" size={24} />
                    </View>

                    {/* Repeat for lunch and dinner */}
                </View>

  
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#36622B', 
    },
    
    container: {
        flex: 1,
        backgroundColor: '#36622B',
    },

    topSection: {
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 10, // Add padding around the section
    },
    avatarContainer: {
        marginRight: 15, // Adds space between the avatar and the text/date picker
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
        color : 'white',
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

    // -----------------------------------------------------------------
    caloriesSection: {
        padding: 16,
        backgroundColor: '#A0A0A0',
    },
    



    // -----------------------------------------------------------------



    caloriesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    progressCircle: {
        // Placeholder for the progress circle component
        height: 200,
        width: 200,
        borderRadius: 100,
        borderWidth: 5,
        borderColor: '#FFEB3B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    macros: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    targetSection: {
        // Placeholder styles for the target section
    },
    mealsSection: {
        padding: 16,
    },
    mealsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    mealItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mealImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#fff',
    },
});

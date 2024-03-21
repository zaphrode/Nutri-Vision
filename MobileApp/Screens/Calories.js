import React, { useState } from 'react';
import { 
    View, 
    Text, 
    SafeAreaView, 
    ScrollView, 
    TouchableOpacity, 
    StyleSheet, 
    StatusBar
} from 'react-native';


import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
function Calories({navigation}) {

    // function to update calories count
    const updateCalories = (amount) => {
        const newCalories = caloriesConsumed + amount;
        setCaloriesConsumed(newCalories > 0 ? newCalories : 0); // Ensure calories consumed is not negative
    }

    // variables for adding meal entries
    const [entries, setEntries] = useState([]);

    // function to addFood entries
    const addFood = (food, calories) => {
        const newEntries = [...entries, {name: food, calories}];
        updateCalories(calories);
        setEntries(newEntries);
    }

    // variables
    const [caloriesConsumed, setCaloriesConsumed] = useState(0);
    const goalCalories = 2000; //set goal calories here
    const progress = caloriesConsumed / goalCalories;
    const breakfastCalories = entries.reduce((total, entry) => total + entry.calories, 0);
    const lunchCalories = entries.reduce((total, entry) => total + entry.calories, 0);
    const dinnerCalories = entries.reduce((total, entry) => total + entry.calories, 0);
    const totalCalories = breakfastCalories + lunchCalories + dinnerCalories;
    const caloriesRemaining = goalCalories - totalCalories; 

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#406132' barStyle='light-content'/>
            <SafeAreaView>
            <ScrollView style={styles.background}>
                <View style={styles.topContainer}>
                    <View style={styles.topContent}>
                        <Text style={styles.calorieText}> Calories </Text>
                    </View>
                    <View style={styles.topIcons}>
                        <TouchableOpacity>
                            <MaterialIcons name="fastfood" size={24} color='black' />
                        </TouchableOpacity>
                    </View>
                </View>
                

                <View style={styles.numberContainer}>
                    <Text style={styles.label}>Calories Remaining</Text>
                    <Text style={styles.number}>{caloriesRemaining}</Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progress, { width: `${progress * 100}%` }]} />
                    </View>
                </View>
                
                <View style={styles.header}>
                    <View style={styles.mealContainer}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.entryTitle}>Breakfast</Text>
                            <Text style={styles.totalCalories}>{totalCalories} cal</Text>
                        </View>
                        {entries.map((entry,index) => (
                            <View key ={index} style={styles.headerContainer}>
                                <Text style={styles.entryText}>{entry.name}</Text>
                                <Text style={styles.calories}> {entry.calories} cal</Text>
                            </View>
                        ))}
                    </View>      
                </View>
                <View style={styles.addEntry}>
                    <Text style={styles.entryNew} onPress={() => addFood(' New Food \n more details', 200)}> ADD FOOD </Text>
                </View>

                <View style={styles.header}>
                    <View style={styles.mealContainer}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.entryTitle}>Lunch</Text>
                            <Text style={styles.totalCalories}>{totalCalories} cal</Text>
                        </View>
                        {entries.map((entry,index) => (
                            <View key ={index} style={styles.headerContainer}>
                                <Text style={styles.entryText}>{entry.name}</Text>
                                <Text style={styles.calories}> {entry.calories} cal</Text>
                            </View>
                        ))}
                    </View>      
                </View>
                <View style={styles.addEntry}>
                    <Text style={styles.entryNew} onPress={() => addFood(' New Food \n more details', 200)}> ADD FOOD </Text>
                </View>

                <View style={styles.header}>
                    <View style={styles.mealContainer}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.entryTitle}>Dinner</Text>
                            <Text style={styles.totalCalories}>{totalCalories} cal</Text>
                        </View>
                        {entries.map((entry,index) => (
                            <View key ={index} style={styles.headerContainer}>
                                <Text style={styles.entryText}>{entry.name}</Text>
                                <Text style={styles.calories}> {entry.calories} cal</Text>
                            </View>
                        ))}
                    </View>      
                </View>
                <View style={styles.addEntry}>
                    <Text style={styles.entryNew} onPress={() => addFood(' New Food \n more details', 200)}> ADD FOOD </Text>
                </View>

            </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({

    addEntry: {
        backgroundColor: 'white'
    },

    background:{
        backgroundColor: '#406132'
    },

    calories: {
        fontSize: 16,
        color: 'black',
        paddingVertical: 5
    },

    calorieNumber:{
        fontSize: 30,
    },

    calorieText:{
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: -5
    },

    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    entryTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingTop: 20,
        paddingBottom: 10,
    },

    entryContainer: {
        flex: 1,
    },

    entryText: {
        fontSize: 16,
    },

    entryNew: {
        fontSize: 16,
        color: 'blue',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 3,
        borderTopWidth: 2,
        backgroundColor: 'white'
    },

    headerContainer: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        justifyContent: 'space-between',
        alignItems: 'center'

    },

    label: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold'
    },

    mealContainer: {
        flex: 1,
        flexDirection: 'column',
    },

    number: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
    },

    numberContainer: {
        alignItems: 'center',
        backgroundColor: '#ddf0dd',
        paddingBottom: 10,
        borderBottomWidth: 5,
    },

    progressBar: {
        width: '80%',
        height: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        overflow: 'hidden',
    },

    progress: {
        height: '100%',
        backgroundColor: 'blue',
    },

    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#406132',
        paddingBottom: 5,
    },

    topContent: {
        flex: 1,
        marginLeft: 18,
        marginTop: 10
    },

    topIcons: {
        flexDirection: 'row',
    },

    totalCalories: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
        paddingRight: 10
    },
})

export default Calories;
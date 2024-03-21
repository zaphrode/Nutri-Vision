import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    ImageBackground,
    StyleSheet,
    Image,
    Text,
    Dimensions,
    Button,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    TextInput,
    StatusBar,
} from 'react-native';

import { useNavigation } from "@react-navigation/native"
import Collapsible from 'react-native-collapsible'
import { getMealHistoryFromFirestore } from '../../MealHistory';

curveHeight = 100
screenWidth = 500


{/* This is the Entry element, which takes in title, description, and displays it all */}
function Entry({title, description, navigation}){
    return(
        <View style={styles.entry}>
            <View style={styles.entryContainer}> 
                <Text style={styles.entryTitle}> {title} </Text> 
                <Text style={styles.entryDescription}> {description}</Text>

            </View>
            <View>
                <TouchableOpacity>
                    <Image
                        style={styles.arrowlogo}
                        source={require('../assets/right_pointing_arrow.png')}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}


function History({ navigation }) {

    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    }

    return (

    <View style={styles.container}>
        <StatusBar backgroundColor="#406132" barStyle="light-content" />
        <SafeAreaView>
        <ScrollView>
            <View style={styles.topContainer}> 
                <View style={styles.topContent}>
                    <Text style={styles.pmText}>Past Meals</Text>
                    <Text style={styles.dateText}>Date1 - Date2</Text>
                </View>
                <View style={styles.topIcons}>
                    <TouchableOpacity>
                        <Image
                            style={styles.searchlogo}
                            source={require('../assets/magnifying-glass.png')}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>navigation.navigate("IndividualMeal")}>
                        <Image
                            style={styles.morelogo}
                            source={require('../assets/threedots.png')}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </View>
            </View>
           
            <View style={styles.header}>
                <View style={styles.headerContainer}>
                    {/* 1 Jan 2024 is a placeholder, should read the current date and be dynamic 
                        Work in progress
                    */}
                    <Text style={styles.headerText}> 1 JAN 2024</Text>
                </View>
                <View>
                    <TouchableOpacity 
                    onPress={toggleCollapse}
                    style={styles.buttonContainer}>
                        <Text style={styles.buttonCollapse}>View All</Text>
                    </TouchableOpacity>                                             
                </View> 
            </View>
            
            <Collapsible collapsed={isCollapsed}>
                {/* This is where we should read the database to display the meal entries
                I'm still trying to figure out how to get the description to show multiple lines
                The <Entry/> element is at the top
                */}
                <Entry title='Breakfast' description='Toast with egg\ncoffee\napple'/>
                <Entry title='Lunch' description='Chicken rice'/>
            </Collapsible>
            {!isCollapsed && (
                        <TouchableOpacity onPress={toggleCollapse} style={styles.viewLessButton}>
                            <Text style={styles.viewLessText}>View Less</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    arrowlogo: {
        height: 30,
        width: 30,
    },

    buttonCollapse: {
        fontSize: 15,
        alignSelf: 'center',
        color: 'black',
        fontWeight: '600'
    },

    buttonContainer: {
        width: 100,
        height: 50,
        paddingTop: 13,
        borderRadius: 100,
        alignSelf: 'center',
        backgroundColor: '#f0f0f0'
    },

    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    dateHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: '#f0f0f0',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 5,
    },

    dateText: {
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 10
    },

    entry: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },

    entryContainer: {
        flex: 1
    },

    entryDescription: {
        fontSize: 14,
        color: '#666',
    },

    entryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },

    headerContainer: {
        flex: 1
    },

    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    morelogo: {
        height: 30,
        width: 30,
    },

    pmText: {
        fontSize: 25,
        fontWeight: 'bold',
    },

    searchlogo: {
        height: 30,
        width: 30,
    },

    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ddf0dd',
    },

    topContent: {
        flex: 1,
        marginLeft: 18,
        marginTop: 10
    },

    topIcons: {
        flexDirection: 'row',
    },

    viewLessButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },

    viewLessText: {
        fontSize: 16,
        color: 'blue',
    },
})

export default History;

// KIV datetimepicker
/*

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';

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

    
*/

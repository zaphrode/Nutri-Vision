import React, { useMemo } from 'react';

import {
    View,
    StyleSheet,
    Text,
    Image,

} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import HomePage from '../Screens/HomePage';
import CaloriePage from '../Screens/Calories';
import ScannerPage from '../Screens/ScannerPage';
import ProfilePage from '../Screens/ProfilePage';
import HistoryPage from '../Screens/HistoryPage';
import NutritionalInfoPage from '../Screens/NutritionInfoPage2';


const homeName = 'Home';
const scannerName = 'Scanner';
const profileName = 'Profile';
const historyName = 'History';

const Tab = createBottomTabNavigator();


const Tabs = () => (
        <Tab.Navigator 
        screenOptions={{
            
            tabBarActiveTintColor: '#4CAF50',
            tabBarInactiveTintColor: 'grey',
        }}>
            <Tab.Screen 
            name='Home' 
            component={HomePage} 
            options={{
                tabBarIcon:({color,size})=>(
                    <MaterialIcons name="home" size={24} color={color} /> 
                )
            }}/>

            <Tab.Screen 
            name='Calories' 
            component={CaloriePage} 
            options={{
                tabBarIcon:({color,size})=>(
                    <MaterialIcons name="fastfood" size={24} color={color} />
                )
            }}/>

            <Tab.Screen 
            name=' '
            component={ScannerPage} 
            options={{
                tabBarIcon:({color,size})=>(
                    <View style={styles.scannerButton}>
                        <MaterialIcons name="center-focus-strong" size={40} color={color} />
                    </View>
                )
            }}/>
            
            <Tab.Screen 
            name='Profile' 
            component={ProfilePage} 
            options={{
                tabBarIcon:({color,size})=>(
                    <MaterialIcons name="person" size={24} color={color} />
                )
            }}/>
            <Tab.Screen 
            name='History' 
            component={HistoryPage} 
            options={{
                tabBarIcon:({color,size})=>(
                    <MaterialIcons name="manage-search" size={24} color={color} />
                )
            }}
            />

        </Tab.Navigator>
    );



const styles = StyleSheet.create({
    buttons: {
        alignItems: 'center',
        justifyContent: 'center',
        top: 10
    },

    icons: {
        width: 10,
        height: 10,
    },

    scannerButton: {
        backgroundColor: '#ccc', // Grey background
        height: 75, // Set height for the circle
        width: 75, // Set width for the circle
        borderRadius: 37.5, // Half the size of width to make it a circle
        alignItems: 'center',
        justifyContent: 'center',
        top: -10, // Half the size of the button to move it up above the tab bar
        elevation: 4, // Optional: adds shadow on Android
    },
    
    words: {
        fontSize: 12,
    }
})

export default Tabs;
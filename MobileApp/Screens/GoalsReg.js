import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Image, SafeAreaView, ScrollView, TouchableOpacity, Linking} from 'react-native';


const GoalsReg = ({navigation}) => {

    const handleCreateAccountPress = () => {
        console.log('Create goals/account pressed');
        navigation.navigate('Tabs');
    };

    const handleAvatarPress = () => {
        console.log('Avatar pressed in GoalsReg');
    };

 
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                    <View style = {styles.headerContainer}>


                    </View>

                    


                    <TouchableOpacity onPress={handleCreateAccountPress} style={styles.createAccountButton}>
                        <Text style={styles.createAccountButtonText}>Create Goals</Text>
                    </TouchableOpacity>
                
            </View>
        </ScrollView>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    //Safe Area for IOS devices
    safeArea: {
        flex: 1,
        backgroundColor: '#36622B', 
    },

    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position : 'relative',
        justifyContent: 'space-between', // Ensures alignment
        padding: 10,
    },
    
    header: {
        fontSize: 30, 
        fontWeight: 'bold',
        marginLeft : -98,
        marginBottom : -12,
    },

    container: {
        flex: 1,
        padding: 20,
    },

    label: {
        fontSize: 14, 
        color: '#000', 
    },

  });

  export default GoalsReg;

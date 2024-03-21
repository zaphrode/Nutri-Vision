import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Image, SafeAreaView, ScrollView, TouchableOpacity, Linking} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';


const EditProfilePage = ({ navigation }) => {

    const handleCreateAccountPress = () => {
        navigation.navigate('GoalsReg');
    };

    // Defining State for Gender Selection
    const [selectedGender, setSelectedGender] = useState(null);

    // Defining state for Date Picker Method
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isDateSelected, setIsDateSelected] = useState(false); // Track if a date has been selected
    
    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        setIsDateSelected(true); // Optionally hide picker after selection
        setShowDatePicker(false);
    };

    const [showAvatarSelection, setShowAvatarSelection] = useState(false);
    const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0); // Default to first avatar

    // Preloaded Avatar Icons
    const avatarImages = [
        require('../assets/hacker.png'),
        require('../assets/kitty.png'),
        require('../assets/splash.png'),

    ];

    const handleAvatarSelect = (index) => {
        setSelectedAvatarIndex(index);
        setShowAvatarSelection(false);
        console.log('Avatar pressed'); 
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Text style = {styles.chooseAvatar}>Choose Your Avatar</Text>

                    <TouchableOpacity onPress={() => setShowAvatarSelection(!showAvatarSelection)} style={styles.avatarSelectButton}>
                        <Image source={avatarImages[selectedAvatarIndex]} style={styles.avatar} />
                    </TouchableOpacity>

                    {showAvatarSelection && (
                        <View style={styles.avatarPicker}>
                            {avatarImages.map((avatar, index) => (
                                <TouchableOpacity key={index} onPress={() => handleAvatarSelect(index)} style={styles.avatarOption}>
                                    <Image source={avatar} style={styles.avatar} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}


                    {/* Gender Selection */}
                    <Text style={styles.genderLabel}>Gender: </Text>
                    <View style={styles.genderContainer}>
                        {['Male', 'Female', 'Prefer Not to Say'].map((gender) => (
                            <TouchableOpacity
                                key={gender}
                                style={[
                                    styles.genderButton,
                                    selectedGender === gender && styles.genderButtonSelected
                                ]}
                                onPress={() => setSelectedGender(gender)}
                            >
                                <Text style={[
                                    styles.genderButtonText,
                                    selectedGender === gender && styles.genderButtonTextSelected
                                ]}>
                                    {gender}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Name Input */}
                    <Text style={styles.label}>Your Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Your Name"
                    />

                    {/* DOB Selection */}
                    <Text style = {styles.label} >Date of Birth</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerToggle}>
                        <Text style={styles.datePickerText}>
                            {isDateSelected ? date.toLocaleDateString() : "DD/MM/YYYY"}
                        </Text>
                    </TouchableOpacity>

                    {/* Email Input */}
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style = {styles.input}
                        placeholder='Enter Your Email'
                        keyboardType="email-address"
                    />

                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onChangeDate}
                        />
                    )}
            
                    {/* Height and Weight */}
                    <Text style = {styles.label} >Height</Text>
                    <TextInput
                        style = {styles.input}
                        placeholder='Enter Your Height ( in cm )'
                        keyboardType='number-pad'
                    />

                    <Text style = {styles.label} >Weight</Text>
                    <TextInput
                        style = {styles.input}
                        placeholder='Enter Your Weight ( in kg )'
                        keyboardType='number-pad'
                    />


                    <TouchableOpacity onPress={handleCreateAccountPress} style={styles.createAccountButton}>
                        <Text style={styles.createAccountButtonText}>Edit Profile</Text>
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

    chooseAvatar : {
        fontSize : 22,
        marginBottom : 20,
        fontWeight : 'bold',
        textAlign : 'center',
    },
    avatarSelectButton: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarPicker: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    avatarOption: {
        marginHorizontal: 10,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    
    container: {
        flex: 1,
        padding: 20,
    },

    label: {
        fontSize: 14, 
        color: '#000', 
        fontWeight: 'bold', 
        marginBottom: 3, 
        marginTop: 8,
    },

    //--------------------------------------------------------------------------------
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 10,
    },
    genderButton: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 17,
        backgroundColor: '#fff',
    },
    genderButtonSelected: {
        backgroundColor: '#007bff', 
    },
    genderButtonText: {
        textAlign: 'center',
        color: '#000',
        fontWeight : 'bold',
    },
    genderButtonTextSelected: {
        color: '#fff', 
    },

    //--------------------------------------------------------------------------------

    photoContainer: {
        alignItems: 'center',
        marginVertical: 20, 
    },

    avatarContainer: {
      marginVertical: 20,
      height: 120, 
      width: 120, 
      borderRadius: 60, 
      borderWidth: 3, 
      borderColor: '#ffffff', // Adjust the border color
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden', // Ensures the image doesn't bleed outside the border
    },
    avatar: {
      width: 110,
      height: 110,
      borderRadius: 55,
    },
    //--------------------------------------------------------------------------------


    input: {
      flex: 1,
      paddingVertical: 10,
      paddingLeft : 10,
      backgroundColor: '#FFF',
      borderRadius : 10,
    },

    inputWrapper: {
        flexDirection: 'row', // Arrange items in a row
        alignItems: 'center', // Center items vertically
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: '#FFF',
        borderRadius : 10,
    },

    //--------------------------------------------------------------------------------

    datePickerToggle: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5, // Match input styles for consistency
        backgroundColor: '#FFF', // Keeping it white to resemble an input field
        alignItems: 'center', // Center the text horizontally
    },

    // Additional styling for the date display text
    datePickerText: {
        fontSize: 17,
        color: '#000', 
    },

    //--------------------------------------------------------------------------------

  
    createAccountButton: {
        marginTop: 20,
        backgroundColor: '#007bff', // Button background color
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center', 
        justifyContent: 'center', 
    },
    
    createAccountButtonText: {
        color: '#ffffff', 
        fontSize: 18,
        fontWeight: 'bold',
    },

  });

export default EditProfilePage;

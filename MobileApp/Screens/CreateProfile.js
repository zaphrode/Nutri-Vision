import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet,
        Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { differenceInYears, format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '../../firebase/config';
import { addDoc, collection } from 'firebase/firestore';

const CreateProfile = ({ navigation }) => {

    // Create connection to Firestore via collection reference
    const profileCollection = collection(firestore, 'profile');
    
    // State for form fields
    const [name, setName] = useState('');
    const [selectedGender, setSelectedGender] = useState(null);
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState('');


    // State for date picker
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const minDate = new Date('1900-01-01');
    const maxDate = new Date();

    const handleCreateProfile = async () => {

        // Check for empty or invalid fields
        if (!selectedGender) {
            Alert.alert("Missing Information", "Please select a gender.");
            return;
        }
        if (!name.trim()) {
            Alert.alert("Missing Information", "Please enter your name.");
            return;
        }
        // Check if the dateOfBirth is reasonable, e.g., not a future date or too old
        if (dateOfBirth > new Date() || dateOfBirth < new Date('1900-01-01')) {
            Alert.alert("Invalid Date", "Please enter a valid date of birth.");
            return;
        }
        if (!height || parseFloat(height) <= 0 || parseFloat(height) > 300) {
            Alert.alert("Invalid Input", "Please enter a valid height in cm.");
            return;
        }
        if (!weight || parseFloat(weight) <= 0 || parseFloat(weight) > 1000) {
            Alert.alert("Invalid Input", "Please enter a valid weight in kg.");
            return;
        }

        //calculate age from current date and dateOfBirth
        const age = differenceInYears(new Date(), dateOfBirth);
        
        // Create profile data object
        const profileData = {
            name,
            gender: selectedGender,
            height: parseFloat(height),
            weight: parseFloat(weight),
            phoneNumber: parseInt(phoneNumber, 8),
            dateOfBirth: dateOfBirth,
            age: age,
            avatarUrl: avatarUrls[selectedAvatarIndex],
        };
    
        try {
            const docRef = await addDoc(profileCollection, profileData);
            console.log('Profile created with ID:', docRef.id);
            navigation.navigate('GoalsReg');
        } catch (error) {
            console.error('Error creating profile:', error);
        }
    }

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowDatePicker(false);
        setDateOfBirth(currentDate);
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const [showAvatarSelection, setShowAvatarSelection] = useState(false);

    // Preloaded Avatar URLs that is stored in Firebase Storage
    const avatarUrls = [
        'https://firebasestorage.googleapis.com/v0/b/nutri-vision-78db7.appspot.com/o/Man1.png?alt=media&token=36480a3b-e065-4629-8703-771f5c7c1831',
        'https://firebasestorage.googleapis.com/v0/b/nutri-vision-78db7.appspot.com/o/Man2.png?alt=media&token=65310e0d-131f-4179-9e8a-d267b641d1e4',
        'https://firebasestorage.googleapis.com/v0/b/nutri-vision-78db7.appspot.com/o/hacker.png?alt=media&token=8691a89d-74d6-452b-ad90-6686e9806c72',
        'https://firebasestorage.googleapis.com/v0/b/nutri-vision-78db7.appspot.com/o/Woman1.png?alt=media&token=7ecd59d7-3335-4ad0-ad5d-3438ee1c13ff',
        'https://firebasestorage.googleapis.com/v0/b/nutri-vision-78db7.appspot.com/o/Woman2.png?alt=media&token=5920e6ee-0341-492c-a116-cd5450dfa15b',
        'https://firebasestorage.googleapis.com/v0/b/nutri-vision-78db7.appspot.com/o/Woman3.png?alt=media&token=2470a34c-1c9b-44b7-ba9a-5422f7a61873',
        
    ];


    // Preloaded Avatar Icons
    const avatarImages = [
        require('../assets/images/Man1.png'),
        require('../assets/images/Man2.png'),
        require('../assets/images/hacker.png'),
        require('../assets/images/Woman1.png'),
        require('../assets/images/Woman2.png'),
        require('../assets/images/Woman3.png'),

    ];

    const handleAvatarSelect = (index) => {
        setSelectedAvatarIndex(index);
        setShowAvatarSelection(false);
        console.log('Avatar pressed'); 
    };

    const handleHeightChange = (text) => {
        const heightNum = parseFloat(text);
        if (text === "") {
            setHeight(text);  
        } else if (heightNum > 0 && heightNum <= 300) {
            setHeight(text);
        } else if (heightNum == 0) {
            alert("Height cannot be 0");
        } else if (heightNum < 0) {
            alert("Height cannot be negative.");
        } else if (heightNum > 300) {
            alert("You can't be that tall!");
        }
    };
    
    const handleWeightChange = (text) => {
        const weightNum = parseFloat(text);
        if (text === "") {
            setWeight(text);  
        } else if (weightNum > 0 && weightNum <= 1000) {
            setWeight(text);
        } else if (weightNum == 0) {
            alert("Weight cannot be 0");
        } else if (weightNum < 0) {
            alert("Weight cannot be negative.");
        } else if (weightNum > 1000) {
            alert("That weight is too high!");
        }
    };


    const [bmi, setBmi] = useState(null);
    const [bmiCategory, setBmiCategory] = useState('');

    useEffect(() => {
        calculateBmi();
    }, [height, weight]);

    // Calculate BMI
    const calculateBmi = () => {
        console.log(`Input Height: ${height} cm`);
        const heightInMeters = parseFloat(height) / 100;
        const weightInKilograms = parseFloat(weight);
        console.log(`Height in meters: ${heightInMeters}, Weight in kilograms: ${weightInKilograms}`);

        if (heightInMeters > 0 && weightInKilograms > 0) {
          const calculatedBmi = weightInKilograms / (heightInMeters * heightInMeters);
          setBmi(calculatedBmi.toFixed(2)); 

          console.log(`Calculated BMI: ${calculatedBmi}`);

          // Determine BMI Category
          if (calculatedBmi < 18.5) {
            setBmiCategory('Underweight');
          } else if (calculatedBmi < 25) {
            setBmiCategory('Normal weight');
          } else if (calculatedBmi < 30) {
            setBmiCategory('Overweight');
          } else {
            setBmiCategory('Obesity');
          }
        } else {
          setBmi(null);
          setBmiCategory('');
        }
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
                             <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.avatarScrollView}>
                                {avatarImages.map((avatar, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => handleAvatarSelect(index)}
                                        style={styles.avatarOption}
                                    >
                                        <Image source={avatar} style={styles.avatar} />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
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

                    {/* Name input */}
                    <Text style={styles.label}>Your Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your name"
                        value={name}
                        onChangeText={setName}
                    />

                    {/* DOB Selection */}
                    <Text style={styles.label}>Date of Birth</Text>
                    <TouchableOpacity onPress={showDatepicker} style={styles.datePickerToggle}>
                        <Text style={styles.datePickerText}>
                            {format(dateOfBirth, 'dd/MM/yyyy')}
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={dateOfBirth}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeDate}
                            minimumDate={minDate}
                            maximumDate={maxDate}
                        />
                    )}

                    {/* Height input */}
                    <Text style={styles.label}>Height (cm)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your height"
                        keyboardType="numeric"
                        value={height}
                        onChangeText={handleHeightChange}
                    />

                    {/* Weight input */}
                    <Text style={styles.label}>Weight (kg)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your weight"
                        keyboardType="numeric"
                        value={weight}
                        onChangeText={handleWeightChange}
                    />

                    {bmi && (
                        <View style={styles.bmiContainer}>
                            <Text style={styles.bmiText}>Your BMI: {bmi}</Text>
                            <Text style={[
                                styles.bmiCategoryText,
                                bmiCategory === 'Normal weight' && styles.normalWeight,
                                bmiCategory === 'Underweight' && styles.underweight,
                                    (bmiCategory === 'Overweight' || bmiCategory === 'Obesity') && styles.overweight, // Combined overweight and obesity for the same color
                            ]}>
                                {bmiCategory}
                            </Text>
                            </View>
                    )}


                    <TouchableOpacity onPress={handleCreateProfile} style={styles.createAccountButton}>
                        <Text style={styles.createAccountButtonText}>Create Profile</Text>
                    </TouchableOpacity>
                
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
        borderColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
    },

    input: {
        flex: 1,
        paddingVertical: 10,
        paddingLeft : 10,
        backgroundColor: '#FFF',
        borderRadius : 10,
    },

    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: '#FFF',
        borderRadius : 10,
    },

    datePickerToggle: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#FFF',
        alignItems: 'center',
    },

    datePickerText: {
        fontSize: 17,
        color: '#000',
    },


    bmiContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    
    bmiText: {
        fontSize: 19,
        fontWeight: 'bold',
    },
    
    bmiCategoryText: {
        fontSize: 17,
    },
    normalWeight: {
        color: 'green',
    },
    underweight: {
        color: 'orange',
    },
    overweight: {
        color: 'red',
    },
    obesity: {
        color: 'red',
    },

    createAccountButton: {
        marginTop: 20,
        backgroundColor: '#007bff',
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

export default CreateProfile;

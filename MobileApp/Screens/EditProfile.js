import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, 
        SafeAreaView, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFirestore, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { getProfileByEmail } from '../../ProfileHistory';
import { differenceInYears, format } from 'date-fns';

/**
 * Provides UI for editing user profile information.
 */
const EditProfilePage = () => {
    const db = getFirestore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('haolun@gmail.com'); 
    const [selectedGender, setSelectedGender] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [profileId, setProfileId] = useState('');

    /**
     * Fetches profile data by email upon component mount.
     */
    useEffect(() => {
        const fetchProfileByEmail = async () => {
            try {
                const profiles = await getProfileByEmail("haolun@gmail.com");
                if (profiles.length > 0) {
                    const profile = profiles[0];
                    setName(profile.name);
                    setEmail(profile.email);
                    setSelectedGender(profile.gender);
                    setHeight(profile.height.toString());
                    setWeight(profile.weight.toString());
                    setDate(profile.dateOfBirth.toDate());
                    setProfileId(profile.id);
                } else {
                    console.log('No profile found');
                }
            } catch (error) {
                console.error("Error fetching profile by email:", error);
            }
        };

        fetchProfileByEmail();
    }, []);

    /**
     * Handles the selection of a date in the DatePicker.
     * @param {Object} event - The event object.
     * @param {Date} selectedDate - The date picked by the user.
     */
    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date; 
        setShowDatePicker(false); 
        setDate(currentDate); 
    };

    /**
     * Validates input fields and updates the profile document in Firestore.
     */
    const handleEditProfile = async () => {
        // Check for empty or invalid fields
        if (!name.trim()) {
            Alert.alert("Missing Information", "Please enter your name.");
            return;
        }
        if (!selectedGender) {
            Alert.alert("Missing Information", "Please select a gender.");
            return;
        }
        if (!(date instanceof Date && !isNaN(date))) {
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

        try {
            // Reference to the profiles collection
            const profilesRef = collection(db, "profile");

            // Query for the profile with the matching email
            const q = query(profilesRef, where("email", "==", email));

            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                Alert.alert("No profile found with the given email.");
                return;
            }

            const profileDoc = querySnapshot.docs[0];
            const profileRef = profileDoc.ref;
            const age = differenceInYears(new Date(), date);

            // Update the profile
            await updateDoc(profileRef, {
                name,
                gender: selectedGender,
                height: parseFloat(height), 
                weight: parseFloat(weight),
                dateOfBirth: date,
                age 
            });

            Alert.alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            Alert.alert("Error updating profile. Please try again.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Your Name"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.genderContainer}>
                        {['Male', 'Female', 'Other'].map((gender) => (
                            <TouchableOpacity
                                key={gender}
                                style={[
                                    styles.genderButton,
                                    selectedGender === gender && styles.genderButtonSelected,
                                ]}
                                onPress={() => setSelectedGender(gender)}
                            >
                                <Text
                                    style={[
                                        styles.genderButtonText,
                                        selectedGender === gender && styles.genderButtonTextSelected,
                                    ]}
                                >
                                    {gender}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Date of Birth</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                        <Text style={styles.textInput}>{format(date, 'dd/MM/yyyy')}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onChangeDate}
                        />
                    )}

                    <Text style={styles.label}>Height (cm)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Your Height"
                        value={height}
                        onChangeText={setHeight}
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Weight (kg)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Your Weight"
                        value={weight}
                        onChangeText={setWeight}
                        keyboardType="numeric"
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleEditProfile} style={styles.button}>
                            <Text style={styles.buttonText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

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
        borderWidth: 1,
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

    button: {
        borderRadius: 20,
        marginTop: 50,
        paddingVertical: 10,
        paddingHorizontal: 17,
        backgroundColor: '#007bff',
        width: 200,
        alignItems: 'center',
        justifyContent: 'center'
    },

    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: 'white'
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
    //--------------------------------------------------------------------------------


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

    //--------------------------------------------------------------------------------

    datePickerToggle: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5, 
        backgroundColor: '#FFF',
        alignItems: 'center', 
    },

    // Additional styling for the date display text
    datePickerText: {
        fontSize: 17,
        color: '#000', 
    },

    //--------------------------------------------------------------------------------

  
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

export default EditProfilePage;
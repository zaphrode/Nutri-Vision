import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';


const db = getFirestore();

const EditGoals = ({ navigation }) => {
    
    const [selectedGoal, setSelectedGoal] = useState(null);
    const goals = ['Gain Weight', 'Lose Weight', 'Get Fitter', 'Eat Healthier', "I don't know yet"];

    const handleGoalSelection = (goal) => {
        console.log(`Goal selected: ${goal}`);
        setSelectedGoal(goal);
    };

    const handleNextPress = async () => {

        // Check if a goal is selected
        if (selectedGoal) {
            const userEmail = "haolun@gmail.com"; 
            const profilesColRef = collection(db, 'profile');
            const q = query(profilesColRef, where("email", "==", userEmail));
            try {
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    // Assuming the first document is the user's profile
                    const userDoc = querySnapshot.docs[0];

                    // Update the profile with the selected goal
                    await updateDoc(userDoc.ref, { goals: selectedGoal });
                    
                    console.log('Goal updated successfully:', selectedGoal);
                    global.lastGoalUpdateTime = new Date();
                    navigation.navigate('Tabs'); 
                } else {
                    console.log('Profile not found.');
                    alert('Profile not found.');
                }
            } catch (error) {
                console.error('Error updating goal:', error);
                alert('Failed to update goal. Please try again.');
            }
        } else {
            alert('Please select a goal to continue.');
        }
    };

    // Function to fetch user profile by email
    async function fetchUserProfileByEmail(email) {
        const profilesRef = collection(db, 'profile');
        const q = query(profilesRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
      
        if (!querySnapshot.empty) {
          const userProfileDoc = querySnapshot.docs[0];
          const userProfile = userProfileDoc.data();
          fetchAndDisplayGoalDetails(userProfile.goals);
        } else {
          console.log("No matching user profile found!");
        }
      }
      
      // Function to fetch and display goal details given a goal ID
      async function fetchAndDisplayGoalDetails(goalId) {
        const goalRef = doc(db, 'goalsDetail', goalId); 
        const goalSnap = await getDoc(goalRef);
      
        if (goalSnap.exists()) {
          const goalDetails = goalSnap.data();
          displayGoalDetails(goalDetails);
        } else {
          console.log("No such goal document!");
        }
      }
      
      // Example function to display goal details
      function displayGoalDetails(goalDetails) {
        console.log("Goal Details:", goalDetails);
      }
      
      fetchUserProfileByEmail("haolun@gmail.com");

 
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Text style = {styles.header} >What Is Your Goal?</Text>

                    {/* Goal Options */}
                    {goals.map((goal) => (
                        <TouchableOpacity
                            key={goal}
                            style={[
                                styles.option,
                                selectedGoal === goal && styles.selectedOption,
                            ]}
                             onPress={() => handleGoalSelection(goal)}
                        >
                            <Text style={styles.optionText}>{goal}</Text>
                        </TouchableOpacity>
                    ))}              
        
                    {/* Navigation Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleNextPress} style={styles.createProfileButton}>
                            <Text style={styles.createProfileText}>Edit Goals</Text>
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
        padding: 20,
        alignItems : 'center',
    },

    header: {
        fontSize: 27, 
        fontWeight: 'bold',
        alignItems : 'center',
        justifyContent: 'center',
        color : '#070f4e',
        marginBottom : 20,
    },


    option : {
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#6db193',
        marginBottom: 10,
        alignItems: 'center',
        borderRadius: 10,
    },

    selectedOption : {
        backgroundColor : '#323232',
    },

    optionText : {
        fontSize : 18,
        color : '#000',
        fontWeight : 'bold',
    },
    
 // -----------------------------------------------------------------------

    createProfileButton: {
        marginTop: 50,
        backgroundColor: '#6db193', 
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 70,
        alignItems: 'center', 
        justifyContent: 'center', 
    },

    createProfileText: {
        color: '#ffffff', 
        fontSize: 18,
        fontWeight: 'bold',
    },
    
    skipButton: {
        marginTop: 10,
        backgroundColor: '#808080', 
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 70,
        alignItems: 'center', 
        justifyContent: 'center', 
    },

    skipText: {
        color: '#ffffff', 
        fontSize: 18,
        fontWeight: 'bold',
    },

  });

  export default EditGoals;
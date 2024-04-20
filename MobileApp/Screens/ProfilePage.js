import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, 
        StyleSheet, Modal, Switch } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { getProfileByEmail } from '../../ProfileHistory';

/**
 * Displays user profile information with options to edit and manage account settings.
 * @param {Object} navigation - Navigation prop passed from parent component for navigation between screens.
 */
function ProfileScreen({navigation}){

  // State for showing or hiding the notification modal
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  // State for managing notification toggle
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  /**
   * Toggles the state of notification enabling.
   */
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  // State to hold profile data
  const [profileData, setProfileData] = useState({
    name: 'Loading...', 
    height: '...',
    weight: '...',
    age: '...',
  });

  // State for managing the profile avatar URL
  const [avatarUrl, setAvatarUrl] = useState();

  /**
   * Fetches the user profile from Firestore by email upon component mount.
   */
  useEffect(() => {
    fetchProfileByEmail();
  }, []);

  /**
   * Fetches user profile data from Firestore using a specific email.
   */
  const fetchProfileByEmail = async () => {
      try {
          const email = "haolun@gmail.com"; 
          const profiles = await getProfileByEmail(email); 
          if (profiles.length > 0) {
              const profile = profiles[0];
              if (profile.avatarUrl) {
                  setAvatarUrl(profile.avatarUrl);  // Set avatar URL if available
              } else {
                  console.log('Profile found but no avatar URL present.');
              }
          } else {
              console.log('No profile found for the given email:', email);
          }
      } catch (error) {
          console.error("Error fetching profile by email:", error);
      }
  };

  /**
   * Initializes a real-time listener to Firestore to automatically update profile information when changes occur.
   */
  useEffect(() => {
    const db = getFirestore();
    const email = 'haolun@gmail.com';
    const profilesRef = collection(db, "profile");
    const q = query(profilesRef, where("email", "==", email));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const profiles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (profiles.length > 0) {
        setProfileData(profiles[0]);
        if (profiles[0].avatarUrl) {
          setAvatarUrl(profiles[0].avatarUrl);
        }
      } else {
        setProfileData({ name: 'No profile found' });
        console.log('No profile found for the given email: ', email);
      }
    }, error => {
      console.error("Error fetching profile by email:", error);
      setProfileData({ name: 'Error fetching profile' });
    });

    return () => unsubscribe();
  }, []);

  // Function to log button press actions (not part of the original snippet)
  const handlePress = (action) => {
    console.log(`Pressed ${action}`);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'rgb(64, 97, 50)'}}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContent}>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate('Login')}>
          <MaterialIcons name="logout" size={24} color="red" />
        </TouchableOpacity>
        <View style={styles.profileHeader}>

        {/* Profile Information Display */}
          <Image
            source={{ uri: avatarUrl }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{profileData.name}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Weight</Text>
              <Text style={styles.statValue}>{profileData.weight}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Height</Text>
              <Text style={styles.statValue}>{profileData.height}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Age</Text>
              <Text style={styles.statValue}>{profileData.age}</Text>
            </View>
          </View>
        </View>


        <Text style={styles.headerText}>Account</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Edit Profile')} style={styles.actionItem}>
            <MaterialIcons name="edit" size={20} color="#4CAF50" style={styles.iconStyle}/>
            <Text style={styles.actionText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowNotificationsModal(true)} style={styles.actionItem}>
            <MaterialIcons name="notifications" size={20} color="#4CAF50" style={styles.iconStyle} />
            <Text style={styles.actionText}>Notification</Text>
          </TouchableOpacity>
          <Modal
              animationType="slide"
              transparent={true}
              visible={showNotificationsModal}
              onRequestClose={() => {
                setShowNotificationsModal(false);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Notifications</Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#61b390" }}
                    thumbColor={notificationsEnabled ? "#dce775" : "#f4f3f4"}
                    android_backgroundColor="#fff59d"
                    onValueChange={toggleNotifications}
                    value={notificationsEnabled}
                  />
                  <TouchableOpacity
                    style={{ ...styles.openButton, backgroundColor: "#002f35" }}
                    onPress={() => {
                      setShowNotificationsModal(false);
                    }}>
                    <Text style={styles.textStyle}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          <TouchableOpacity onPress={() => navigation.navigate('Favourites')} style={styles.actionItem}>
            <MaterialIcons name="favorite" size={20} color="#4CAF50" style={styles.iconStyle} />
            <Text style={styles.actionText}>Favourites</Text>
            </TouchableOpacity>
        </View>

        <Text style={styles.headerText}>Statistics</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('EditGoals')} style={styles.actionItem}>
            <MaterialIcons name="edit-note" size={20} color="#4CAF50" style={styles.iconStyle} />
            <Text style={styles.actionText}>Edit Goals</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4e5c2',
  },
  bottomContainer: {
    position: 'absolute',  
    bottom: 5,             
    left: 0,
    right: 0,
    backgroundColor: 'white', 
    paddingVertical: 20, 
    paddingHorizontal: 10, 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  logoutButton: {
    position: 'absolute',
    top: 20, 
    right: 20, 
    zIndex: 10, 
  },

  profileHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  profileName: {
    fontSize: 24,
    fontWeight: '500', 
    color: 'black', 
    marginBottom: 8, 
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10, 
  },

  statItem: {
    alignItems: 'center',
    justifyContent: 'center', 
    marginHorizontal: 15, 
  },

  statLabel: {
    textAlign: 'center', 
    fontSize: 14, 
    color: 'black', 
    marginBottom: 4,
    fontWeight: '500'
  },

  statValue: {
    textAlign: 'center', 
    fontSize: 18, 
    fontWeight: '500',
    color: 'black', 
  },

  separator: {
    height: '80%', 
    width: 1,
    backgroundColor: '#ccc', 
    marginHorizontal: 10, 
  },

  statItem: {
    marginHorizontal: 15,
  },

  headerText: {
    fontSize: 22, 
    fontWeight: 'bold', 
    color: 'black', 
    marginTop: 20, 
    marginBottom: 10, 
    marginLeft: '5%', 
  },

  actionsContainer: {
    marginTop: 20,
    paddingHorizontal: 20
  },

  actionItem: {
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    backgroundColor: 'white', 
    borderRadius: 5, 
    paddingVertical: 15, 
    paddingHorizontal: 25, 
    borderRadius: 15, 
    marginTop: 10, 
    marginHorizontal: '5%', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginVertical: 10, 
    width: '90%', 
    alignSelf: 'center', 
  },

  iconStyle: {
    marginRight: 10, 
  },

  actionText: {
    color: 'black', 
    fontSize: 18, 
    fontWeight: 'normal', 

  },

  scrollViewContent: {
    paddingBottom: 40, 
  },
//--------------
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 200, 
    width: 300,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },

});

export default ProfileScreen;
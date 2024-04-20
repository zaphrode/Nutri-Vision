import { storage, collection, query, where, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, startOfDay, endOfDay } from 'firebase/firestore';
import firestore from './firebase/config';

const profileCollection = collection(firestore, 'profile');

export const saveProfileToFirestore = async (profileData) => {
    try {
        const newDocRef = await addDoc(profileCollection, profileData);
        console.log('Profile saved successfully with ID:', newDocRef.id);
        return newDocRef.id;
    } catch (error) {
        console.error('Error saving profile:', error);
        throw error;
    }
};

export const getProfileByEmail = async (email) => {
    try {
        const q = query(profileCollection, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        const profiles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Profile with email', email, ':', profiles);
        return profiles; 
    } catch (error) {
        console.error('Error fetching profile by email:', error);
        throw error;
    }
};

export const updateProfileDataInFirestore = (profileId, updatedData) => {
    const profileRef = doc(profileCollection, profileId);

    updateDoc(profileRef, updatedData)
        .then(() => {
            console.log('Profile data updated successfully');
        })
        .catch((error) => {
            console.error('Error updating profile data:', error);
        });
};

export const deleteProfileDataInFirestore = (profileId) => {
    const profileRef = doc(profileCollection, profileId);

    deleteDoc(profileRef)
        .then(() => {
            console.log('Profile data deleted successfully');
        })
        .catch((error) => {
            console.error('Error deleting profile data:', error);
        });
};




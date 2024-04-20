import { storage, collection, query, where, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, startOfDay, endOfDay } from 'firebase/firestore';
import firestore from './firebase/config';

// YY please continue. Creating user account, which is subsequently used for login authentication
const userCollection = collection(firestore, 'user');

export const saveUserToFirestore = async (userData) => {
    try{
        const newDocRef = await addDoc(userCollection, userData);
        console.log("User saved successfully with ID: ", newDocRef.id);
        return newDocRef.id;
    } catch (error){
        console.error("Error saving User: ", error);
        throw error;
    }
};

export const getUserByEmail = async (email) => {
    try {
        const q = query(userCollection, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc=> ({id: doc.id, ...doc.data()}));
        console.log("User with email", email, ":", users);
        return users;
    } catch (error) {
        console.error("Error fetching user by email: ", error);
        throw error;
    }
};


export const updateUserDataInFirestore = (userId, updatedData) => {
    const userRef = doc(userCollection, userId);

    updateDoc(userRef, updatedData)
        .then(() => {
            console.log('User data updated successfully');
        })
        .catch((error) => {
            console.error('Error updating user data:', error);
        });
};

export const deleteUserDataInFirestore = (userId) => {
    const userRef = doc(userCollection, userId);

    deleteDoc(userRef)
        .then(() => {
            console.log('User data deleted successfully');
        })
        .catch((error) => {
            console.error('Error deleting user data:', error);
        });
};
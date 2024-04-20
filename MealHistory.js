import { collection, query, where, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, startOfDay, endOfDay } from 'firebase/firestore';
import firestore from './firebase/config';

const mealHistoryCollection = collection(firestore, 'MealHistory');

//Function to write a record consisting of the meal entry details to Firebase Meal History Collection
//Randomly generates a unique meal Id for each record saved
export const saveMealToFirestore = async (mealData) => {
    try {
        // Add a new document to the 'MealHistory' collection
        const newDocRef = await addDoc(mealHistoryCollection, mealData);
        console.log('Meal data saved successfully with ID: ', newDocRef.id);
        return newDocRef.id;
    } catch (error) {
        console.error('Error saving meal data:', error);
        throw error;
    }
};

//Function to retrieve meal entry data from Firebase based on the creation date of meal entries 
export const getMealHistoryFromFirestore = async (date) => {
    try {
        // Convert the date string to a JavaScript Date object
        const selectedDate = new Date(date);

        // Get the year, month, and day of the selected date
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const day = selectedDate.getDate();

        // Create a new Date object for the start of the selected date
        const startOfDay = new Date(year, month, day);

        // Get the end of the selected date (one day later)
        const endOfDay = new Date(year, month, day + 1);

        // Query Firestore for documents within the selected date range
        const q = query(mealHistoryCollection,
            where('createdAt', '>=', startOfDay),
            where('createdAt', '<', endOfDay)
        );

        const querySnapshot = await getDocs(q);
        const mealHistory = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log('Meal history for', date, ':', mealHistory);
        return mealHistory;
    } catch (error) {
        console.error('Error fetching meal history:', error);
        throw error;
    }
};

//Function to retrieve meal entry data from Firebase based on a specific meal Id  
export const getMealEntryById = async (mealId) => {
    try {
        // Get the document reference for the specific meal entry
        const docRef = doc(mealHistoryCollection, mealId);

        // Get the snapshot of the document
        const docSnapshot = await getDoc(docRef);

        // Check if the document exists
        if (docSnapshot.exists()) {
            // Extract the data from the document
            const mealEntry = { id: docSnapshot.id, ...docSnapshot.data() };
            console.log('Meal entry:', mealEntry);
            return mealEntry;
        } else {
            console.log('Meal entry not found');
            return null; // Return null if the meal entry is not found
        }
    } catch (error) {
        console.error('Error fetching meal entry:', error);
        throw error;
    }
};

//Function to retrieve favourite meal entry data from Firebase based on the 'favourite' attribute.
//Data of meal entries where 'favourite' == true will be retrieved   
export const getFavouriteMealEntries = async () => {
    try {
  
      // Query to retrieve meal entries where the favorite attribute is true
      const q = query(mealHistoryCollection, where('favourite', '==', true));
  
      // Get the documents that match the query
      const querySnapshot = await getDocs(q);
  
      // Array to store the favorite meal entries
      const favoriteMealEntries = [];
  
      // Iterate over the documents and extract the data
      querySnapshot.forEach((doc) => {
        favoriteMealEntries.push({ id: doc.id, ...doc.data() });
      });
  
      return favoriteMealEntries;
    } catch (error) {
      console.error('Error retrieving favorite meal entries:', error);
      throw error;
    }
  };

  //Function to update meal entry data in Firebase for a specific meal entry based on its meal Id  
export const updateMealDataInFirestore = (mealId, updatedData) => {
    // Reference to the specific meal document using its ID
    const mealRef = doc(mealHistoryCollection, mealId);

    // Update the data
    updateDoc(mealRef, updatedData)
        .then(() => {
            console.log('Meal data updated successfully');
        })
        .catch((error) => {
            console.error('Error updating meal data:', error);
        });
};

//Function to delete a particular meal entry record from Firebase based on its meal Id  
export const deleteMealDataInFirestore = (mealId) => {
    // Reference to the specific meal document using its ID
    const mealRef = doc(mealHistoryCollection, mealId);

    // Delete the document
    deleteDoc(mealRef)
        .then(() => {
            console.log('Meal data deleted successfully');
        })
        .catch((error) => {
            console.error('Error deleting meal data:', error);
        });
};

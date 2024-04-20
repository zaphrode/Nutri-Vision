import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Image, Dimensions, ScrollView } from 'react-native';
import { getFavouriteMealEntries } from '../../MealHistory';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../Components/SearchBar';

/**
 * Displays a list of favorite meals and allows for navigation to detailed meal pages, as well as providing a search function to filter the displayed meals.
 */
function FavouritesPage() {
  const navigation = useNavigation();

  /** Placeholder image URI used for demonstration. */
  const headerImageUri = 'https://via.placeholder.com/150';

  /** Simulates a dynamic list of images using placeholders. */
  const images = new Array(8).fill(headerImageUri);

  /** State hooks for storing favorite meals and filtered entries. */
  const [favoriteMealEntries, setFavoriteMealEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);

  /** Calculates if the number of entries is odd for conditional rendering purposes. */
  const isOddNumberOfEntries = favoriteMealEntries.length % 2 !== 0;

  /**
   * Fetches favorite meals from Firestore on component mount.
   */
  useEffect(() => {
    fetchFavorites();
  }, []);

  /**
   * Logs the current favorites and filtered entries to the console for debugging purposes.
   */
  useEffect(() => {
    console.log('Current favorites:', favoriteMealEntries);
    console.log('Current filtered entries:', filteredEntries);
  }, [favoriteMealEntries, filteredEntries]);

  /**
   * Fetches favorite meal entries from Firebase.
   */
  const fetchFavorites = async () => {
    try {
      const favorites = await getFavouriteMealEntries();
      setFavoriteMealEntries(favorites);
      setFilteredEntries(favorites);
    } catch (error) {
      console.error('Error fetching favorite meal entries:', error);
    }
  };

  /**
   * Handles navigation to the individual meal page, displaying the meal's macronutrients.
   * @param {string} documentId - Document ID of the selected meal.
   */
  const handlePress = (documentId) => {
    navigation.navigate('IndividualMeal', { documentId });
    console.log('Navigating to documentId:', documentId);
  };

  /**
   * Filters the favorite meal entries based on the provided search query.
   * @param {string} query - The text input from the user used to filter the meal entries.
   */
  const handleSearch = (query) => {
    const filtered = favoriteMealEntries.filter(entry => entry.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredEntries(filtered);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(173, 219, 199, 1)' }}>
      <SearchBar onSearch={handleSearch} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.gridContainer}>
          {filteredEntries.map((entry, index) => (
            <TouchableOpacity
              key={`meal-${index}`}
              style={styles.imageContainer}
              onPress={() => handlePress(entry.id)}
            >
              <Image source={{ uri: `data:image/png;base64,${entry.picture}` }} style={styles.image} resizeMode="contain" />
              <Text style={styles.imageText}>{entry.name}</Text>
            </TouchableOpacity>
          ))}
          {/* Conditionally render an invisible view to align the last item to the left if odd number of entries */}
          {isOddNumberOfEntries && <View style={styles.imageContainer} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(173, 219, 199, 1)',
    paddingBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    justifyContent: 'space-around',
    paddingTop: 20,
  },
  imageContainer: {
    width: Dimensions.get('window').width / 2 - 20,
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    width: '100%', 
    height: 150, 
  },
  imageText: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
});

export default FavouritesPage;

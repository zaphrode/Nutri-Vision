import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SearchBar from '../Components/SearchBar';

const CommunityScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
  
    // Posts for Recipe
    const posts = [
      {
        id: 1,
        title: 'Chicken Rice',
        imageUri: require('../assets/images/ChickenRice.jpg'),
        duration: '<60 mins',
        profile: {
          name: 'Russell',
          imageUri: require('../assets/images/Man1.png'),
        },
      },
      
      {
        id: 2,
        title: 'Pancake',
        imageUri: require('../assets/images/Pancake.jpg'),
        duration: '<20 mins',
        profile: {
          name: 'Randy',
          imageUri: require('../assets/images/Woman1.png'),
        },
      },
      {
        id: 3,
        title: 'Spaghetti',
        imageUri: require('../assets/images/Spaghetti.jpg'),
        duration: '<30 mins',
        profile: {
          name: 'Bob',
          imageUri: require('../assets/images/Man2.png'),
        },
      },
    ];

    const filteredPosts = posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    return (
      <ScrollView style={styles.container}>
        <SearchBar onSearch={setSearchQuery}/>
        <View style={styles.postsContainer}>
          {filteredPosts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <Image
                source={post.profile.imageUri}
                style={styles.profileImage}
              />
              <Text style={styles.profileName}>{post.profile.name}</Text>
              <Image
                source={post.imageUri}
                style={styles.foodImage}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.duration}>{post.duration}</Text>
              </View>

              <TouchableOpacity
                style={styles.getStartedButton}
              >
                <Text style={styles.getStartedButtonText}>Get Started</Text>
              </TouchableOpacity>

            </View>
          ))}
        </View>
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f4e5c2',
    },
    searchBarContainer: {
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f2f2f2',
      borderRadius: 20,
      margin: 10,
    },
    searchInput: {
      flex: 1,
      padding: 10,
      fontSize: 16,
      color: '#000',
    },
    postsContainer: {
      padding: 10,
    },
    postCard: {
      backgroundColor: '#fff',
      borderRadius: 20,
      padding: 15,
      marginBottom: 20,
      alignItems: 'center',
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    foodImage: {
      width: '100%',
      height: 200,
      borderRadius: 15,
      marginVertical: 10,
    },
    textContainer: {
      alignItems: 'center',
      marginBottom: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    duration: {
      fontSize: 14,
      fontWeight: 'bold'
    },
    profileName: {
      fontSize: 16,
    },

    getStartedButton: {
      backgroundColor: '#FFA500',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    getStartedButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  
  export default CommunityScreen;
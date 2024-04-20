import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, SafeAreaView, TouchableOpacity, 
        StatusBar, FlatList, Modal, TextInput } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

/**
 * Displays a page where users can confirm their meal, add, update, or delete ingredients.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.navigation - Navigation object provided by React Navigation.
 * @param {Object} props.route - Route object provided by React Navigation, contains parameters passed from the previous screen.
 */
function ConfirmMealPage({ navigation, route }) {

  const { content } = route.params;
  const { base64Image } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientMass, setIngredientMass] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  /**
   * Parses a string of ingredients and returns an array of ingredient objects.
   *
   * @param {string} ingredientString - A comma-separated string of ingredients.
   * @returns {Object[]} An array of ingredient objects with properties id, name, and portion.
   */
  const parseIngredients = (ingredientString) => {
    const ingredientParts = ingredientString.split(', ');
    return ingredientParts.map((part, index) => {
      const [portion, ...nameParts] = part.split(' ');
      const name = nameParts.join(' ');
      return { id: String(index + 1), name, portion };
    });
  };

  const [ingredients, setIngredients] = useState(parseIngredients(content));
  console.log(content);

  /**
   * Renders a separator between ingredient items.
   *
   * @returns {JSX.Element} A View component styled as a separator.
   */
  const IngredientSeparator = () => (
    <View style={{
      height: 1,
      backgroundColor: 'grey',
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 60, 
      marginRight: 100, 
    }} />
  );

  /**
   * Adds a new ingredient to the list.
   */
  const handleAddIngredient = () => {
    console.log("Add button pressed with ingredient name:", ingredientName, "and mass:", ingredientMass);
    const newIngredient = {
      id: new Date().getTime().toString(),
      name: ingredientName,
      portion: ingredientMass + 'g',
    };
    setIngredients(currentIngredients => [...currentIngredients, newIngredient]);
    setIngredientName('');
    setIngredientMass('');
    setIsModalVisible(false);
  };

  /**
   * Modal component for editing ingredients.
   *
   * @returns {JSX.Element} A modal with form inputs and buttons for updating or deleting an ingredient.
   */
  const EditIngredientModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={selectedIngredient !== null}
      onRequestClose={() => setSelectedIngredient(null)}
    >
      <View style={styles.modalView}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setSelectedIngredient(null)}
        >
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <TextInput
          placeholder="Ingredient Name"
          style={styles.textInput}
          onChangeText={(text) => setIngredientName(text)}
          value={ingredientName}
        />
        <TextInput
          placeholder="Mass (g)"
          style={styles.textInput}
          onChangeText={(text) => setIngredientMass(text)}
          value={ingredientMass}
          keyboardType="numeric"
        />
        <Button title="Update" onPress={handleUpdateIngredient} />
        <Button title="Delete" onPress={handleDeleteIngredient} color="red" />
      </View>
    </Modal>
  );

  /**
   * Sets the selected ingredient for editing.
   *
   * @param {Object} item - The ingredient object selected for editing.
   */
  const handlePress = (item) => {
    setSelectedIngredient(item);
    setIngredientName(item.name);
    setIngredientMass(item.portion.replace('g', '')); 
  };

  /**
   * Updates the selected ingredient in the list.
   */
  const handleUpdateIngredient = () => {
    const updatedIngredients = ingredients.map(ing => {
      if (ing.id === selectedIngredient.id) {
        return { ...ing, name: ingredientName, portion: ingredientMass + 'g' };
      }
      return ing;
    });
    setIngredients(updatedIngredients);
    console.log("Update button pressed with ingredient name:", ingredientName, "and mass:", ingredientMass);
    setSelectedIngredient(null);
  };

  /**
   * Deletes the selected ingredient from the list.
   */
  const handleDeleteIngredient = () => {
    const filteredIngredients = ingredients.filter(ing => ing.id !== selectedIngredient.id);
    setIngredients(filteredIngredients);
    setSelectedIngredient(null);
  };

  /**
   * Renders an ingredient item.
   *
   * @param {Object} param0 - Item and index from the ingredient list.
   * @returns {JSX.Element} A View component representing an ingredient.
   */
  const renderIngredientItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <View style={styles.ingredientItem}>
        <Text style={styles.ingredientName}>{item.name}</Text>
        <Text style={styles.ingredientPortion}>{item.portion}</Text>
      </View>
    </TouchableOpacity >
  );

  /**
   * Button component for adding new ingredients.
   *
   * @returns {JSX.Element} A View component with a button to trigger adding a new ingredient.
   */
  const AddIngredientButton = () => (
    <View>
      <IngredientSeparator />
      <TouchableOpacity style={styles.addIngredientButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.addIngredientText}>Add Ingredients</Text>
        <MaterialIcons name="add-circle-outline" size={24} color="black" />
      </TouchableOpacity>
      <IngredientSeparator />
    </View>
  );

  /**
   * Handles confirmation of the meal and navigates to the Nutritional Info page.
   */
  const handleConfirmMeal = () => {
    const query = ingredients.map(ingredient => `${ingredient.portion} ${ingredient.name}`).join(' , ');
    navigation.navigate('Nutritional Info', { ingredients: query, base64Image });
  };

  /**
   * Button component to confirm the meal.
   *
   * @returns {JSX.Element} A button that triggers meal confirmation.
   */
  const ConfirmMealButton = () => (
    <TouchableOpacity style={styles.confirmMealButton} onPress={handleConfirmMeal}>
      <Text style={styles.confirmMealText}>Confirm Meal</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <EditIngredientModal />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Ingredient Name"
            style={styles.textInput}
            onChangeText={setIngredientName}
            value={ingredientName}
          />
          <TextInput
            placeholder="Mass (g)"
            style={styles.textInput}
            onChangeText={setIngredientMass}
            keyboardType="numeric"
            value={ingredientMass}
          />
          <Button title="Add" onPress={handleAddIngredient} />
        </View>
      </Modal>
      <StatusBar backgroundColor="white" barStyle="light-content" />
      <View style={styles.nutritionalInfoContainer}>
        <Text style={styles.ingredientsHeaderText}>Ingredients</Text>
        <FlatList
          data={ingredients}
          renderItem={renderIngredientItem}
          keyExtractor={item => item.id}
          ListFooterComponent={AddIngredientButton}
          ItemSeparatorComponent={IngredientSeparator} 
          style={styles.ingredientsList}
        />
        <ConfirmMealButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(173, 219, 199, 1)',
  },
  modalView: {
    marginTop: 200,
    marginHorizontal: 20,
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
    shadowRadius: 3.84,
    elevation: 5
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#000',
  },
  textInput: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  nutritionalInfoContainer: {
    backgroundColor: 'white',
    borderRadius: 40,
    margin: -50,
    marginLeft: 0,
    marginTop: 10,
    flex: 1,
    justifyContent: 'flex-start',
  },
  nutritionalInfoContainerText: {
    color: 'rgb(127, 127, 127)',
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'auto',
    margin: 16,
  },
  nutritionalDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 150,
  },
  nutritionalDetailsText: {
    fontSize: 18,
    color: 'rgb(127, 127, 127)',
  },
  ingredientsHeaderText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 16,
    marginLeft: 20,
    marginBottom: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  ingredientName: {
    fontSize: 16,
    color: 'rgb(127, 127, 127)',
    marginLeft: 80,
  },
  ingredientPortion: {
    fontSize: 16,
    color: 'rgb(127, 127, 127)',
    marginRight: 100,
    flex: 1,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: 'grey',
    alignSelf: 'stretch',
    marginTop: 8,
    marginLeft: 0,
    marginRight: 50,
  },
  addIngredientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginLeft: 65,
  },
  addIngredientText: {
    fontSize: 16,
    color: 'black',
    marginRight: 150,
  },
  confirmMealButton: {
    backgroundColor: 'grey',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginVertical: 20,
    marginHorizontal: 40,
    marginRight: 90,
    marginBottom: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmMealText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ConfirmMealPage;

import * as React from 'react';
import LandingUI from './MobileApp/Screens/LandingUI';
import Login from './MobileApp/Screens/Login';
import AccountReg from './MobileApp/Screens/AccountReg';
import CreateProfile from './MobileApp/Screens/CreateProfile';
import GoalsReg from './MobileApp/Screens/GoalsReg';
import NutritionalInfoPage from './MobileApp/Screens/NutritionInfoPage';
import ConfirmMealPage from './MobileApp/Screens/ConfirmMealPage';
import EditProfilePage from './MobileApp/Screens/EditProfile';
import FavouritesPage from './MobileApp/Screens/FavouritesPage';
import HistoryPage from './MobileApp/Screens/HistoryPage';
import IndividualMeal from './MobileApp/Screens/IndividualMeal';
import EditGoals from './MobileApp/Screens/EditGoals';

import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { NavigationContainer } from '@react-navigation/native'; 
import Tabs from './MobileApp/Navigation/Tabs';

const Stack = createNativeStackNavigator();

/**
 * The main application component that sets up the navigation stack.
 * 
 * This component defines the navigation stack for the application, specifying
 * the screens and their corresponding components. It uses the `NavigationContainer`
 * from `@react-navigation/native` to manage the navigation state and the
 * `createNativeStackNavigator` to create a stack navigator.
 * 
 * @returns {React.Component} The main application component with navigation configured.
 */

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>


      <Stack.Screen name='Landing' component={LandingUI} />
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='AccountRegistration' component={AccountReg}/>
      <Stack.Screen name='CreateProfile' component = { CreateProfile } />
      <Stack.Screen name='GoalsReg' component={GoalsReg} options={{ title: 'Goals Registration' }}/>
      <Stack.Screen name='Tabs' component={Tabs} options={{headerShown: false}}/>
      <Stack.Screen name='Nutritional Info' component={NutritionalInfoPage} />
      <Stack.Screen name='Confirm Meal' component={ConfirmMealPage} />
      <Stack.Screen name='Edit Profile' component={EditProfilePage} />
      <Stack.Screen name='Favourites' component={FavouritesPage} />
      <Stack.Screen name='IndividualMeal' component={IndividualMeal} />
      <Stack.Screen name ='EditGoals' component={EditGoals}/>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
  
}

/*  */  


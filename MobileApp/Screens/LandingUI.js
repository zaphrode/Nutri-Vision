import { View,  StyleSheet, Image, Text, TouchableOpacity } from 'react-native';

import { useNavigation } from "@react-navigation/native"

function LandingUI({navigation}) {

    return (
        <View style={styles.container}>  
            <View style={styles.logoContainer}>
                <Image
                style = {styles.logo}
                source = {require('../assets/appLogo.png')}
                resizeMode='contain'
                />
                <Text style={styles.words}> Nutri-Vision</Text>
            </View>
            <View>
                <Text style={styles.tagline}>Scan, Know, Nourish: Your Pocket Nutritionist!</Text>
            </View>
            <TouchableOpacity 
                onPress={()=>navigation.navigate("Login")}
                style={styles.buttonContainer}>
                <Text style = {{
                    fontSize: 20,
                    alignSelf: 'center'
                    }}>
                    Get Started
                </Text> 
            </TouchableOpacity>
        </View>
    
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 200,
        height: 50,
        marginLeft: 100,
        padding: 10,
        borderRadius: 100,
        backgroundColor: '#228b22'
    },

    container: {
        flex:1,
        backgroundColor: 'white',
        justifyContent: 'center'

    },

    logo: {
        height: 150,
        width: 150,
        alignItems: 'flex-start',
        alignSelf: 'center',
        
    },
    logoContainer: {
        marginBottom: 50,
        position: 'relative'
    },

    tagline: {
        fontSize: 17,
        fontWeight: '800',
        alignSelf: 'center',
        marginBottom: 70
    },

    words:{
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'center',
    }
})

export default LandingUI;
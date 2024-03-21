import React, { useRef, useState } from 'react';
import { 
    View, 
    ImageBackground, 
    StyleSheet, 
    Image, 
    Text, 
    Dimensions, 
    Button,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    TextInput,
} from 'react-native';

import Svg, { Path } from 'react-native-svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native"
// import { Stack, useRouter } from 'expo-router';
// import { COLORS, icons, images, SIZES } from ' ./constants';

// get screen width
const screenWidth = Dimensions.get('window').width;
// get 25% of screen height
const curveHeight = Dimensions.get('window').height * 0.4;

function Login({navigation}) {

    /*
    //Ke Yuan
    // State to check if user is new or not.

    const [isNewUser, setIsNewUser] = useState(false);

    const onSuccessfulLogin = (response) => {
        const userIsNew = response.isNewUser;
        setIsNewUser(userIsNew);

        if (userIsNew) {
            navigation.navigate('CreateProfile');
        } else {
            navigation.navigate('HomePage');
        }
    }*/

    const buttonClickHandler = () =>{
        console.log('Pressed create an account');
        // do something
    }

    // Logic when Email button is pressed
    const textInputRef = useRef(null);
    const [isEmailIconActive, setIsEmailIconActive] = useState(false);

    const onEmailIconPress = () =>{
        setIsEmailIconActive(!isEmailIconActive);
        textInputRef.current.focus();
    }

    // Logic when Password eye button is pressed
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const onEyeIconPress = () =>{
        setIsPasswordVisible(!isPasswordVisible);
    }

    return (
    <View style={styles.background}>
        <View style={{height: 0}}>
                <Svg height={curveHeight} width={screenWidth}>
                <Path d={`M-200 0 C ${screenWidth} 100 ${curveHeight/5} ${curveHeight} ${screenWidth*2.2} 0 Z`} fill="#afb281" />
                </Svg>
        </View>
        <SafeAreaView style={{flex:1}}>
        <ScrollView style={{paddingTop:50}}>
            <View style={styles.textcontainer}>
                <Text style={styles.titletext}> 
                    Hello, great to see you again!</Text>
            </View>
            <View>
                <Text style={styles.login}> Log in to</Text>
            </View>
            <View style={{marginTop: 60}}>
                <Text style={styles.textinputheader}>E-mail</Text>
            </View>
            <View style={styles.textinputcontainer}>
                <TextInput 
                    ref={textInputRef}
                    //styles={styles.textinput}
                    placeholder='*******@gmail.com'
                />
            </View>
                <TouchableOpacity onPress={onEmailIconPress}>
                    <Image 
                    source={isEmailIconActive ? require('../assets/email.png'):
                            require('../assets/email.png')} 
                    style={{width: 28, height: 28, position: 'absolute', 
                            right: 60, bottom: 5, alignSelf: 'center'}}
                    />
                </TouchableOpacity>
            <View> 
                <Text style={styles.textinputheader}> Password </Text>
            </View>
            <View style={styles.textinputcontainer}> 
                <TextInput 
                    //styles={styles.textinput}
                    placeholder='**********'
                    secureTextEntry={!isPasswordVisible}
                />
            </View>
                <TouchableOpacity onPress={onEyeIconPress}>
                <Image 
                source={isPasswordVisible ? require('../assets/open_eye.png'):
                        require('../assets/close_eye.png')} 
                style={{width: 30, height: 30, position: 'absolute', 
                        right: 60, bottom: 5, alignSelf: 'center'}} 
                />
                </TouchableOpacity>
            <View style={{marginTop: 50}}>
                <TouchableOpacity 
                    onPress={()=>navigation.navigate("CreateProfile")}
                    style={styles.buttonContainer}>
                    <Text style = {{
                        fontSize: 18,
                        alignSelf: 'center',
                        color: 'white'
                        }}>
                        Confirm and continue
                    </Text> 
                </TouchableOpacity>
            </View>
            <View style={{marginTop: 80}}>
                <Text style={{
                        alignSelf: 'center',
                        fontSize: 18,
                    }}> Don't have an account? </Text>
                    <TouchableOpacity 
                        onPress={()=>navigation.navigate("AccountRegistration")}
                        style={styles.buttonContainer}>
                        <Text style = {{
                            fontSize: 18,
                            alignSelf: 'center',
                            color: 'white'
                            }}>
                            Create an account
                        </Text> 
                    </TouchableOpacity>
            </View>

        </ScrollView>
        </SafeAreaView> 

    </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#406132',
    },

    buttonContainer: {
        width: 330,
        height: 50,
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: 'gray'
    },

    
    login: {       
        color: 'white',
        fontSize: 30,
        fontWeight: '400',
        alignSelf: 'flex-start',
        marginTop: 70,
        marginLeft: 5
    },
    
    textcontainer: {
        alignSelf: 'flex-end',
        width: 170,
        marginRight: 10
    },
        
    textinputcontainer: {
        borderWidth: 1,
        width: 330,
        height: 40,
        marginLeft: 35
    },
    
    textinputheader: {
        marginTop: 10,
        fontSize: 17,
        color: 'white',
        marginLeft: 35,
        alignSelf: 'flex-start'

    },

    titletext: {
        fontSize: 25,
        fontWeight: '600',
        color: 'white',
        flexWrap: 'wrap',
        textAlign: 'left',
    },



})

export default Login;
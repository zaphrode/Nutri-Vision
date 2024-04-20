import React, { useRef, useState } from 'react';
import {
    View, StyleSheet, Image, Text, Dimensions, TouchableOpacity,
    SafeAreaView, ScrollView, TextInput, Alert } from 'react-native';

import Svg, { Path } from 'react-native-svg';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";

// get screen width
const screenWidth = Dimensions.get('window').width;
// get 25% of screen height
const curveHeight = Dimensions.get('window').height * 0.4;

function Login({ navigation }) {

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const LoginFunction = async () => {
        // checks for empty email and password
        if(!email || !password) {
            Alert.alert(
                "Missing Information",
                "Please enter both an email and a password to log in",
                [{text: "OK"}]
            );
            return; 
        }
        
        try {
            // Attempt to sign in
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Login success!");
            if(email === 'haolun@gmail.com'){
                navigation.navigate('CreateProfile');
            }
            
        } catch (error) {
            Alert.alert(
                "Login Failed",
                "Please ensure your email and password are entered correctly or register if you are a new user"
            );
            navigation.navigate('Login');
            console.log("Login failed D:");
        }
    }

    // Logic when Email button is pressed
    const textInputRef = useRef(null);
    const [isEmailIconActive, setIsEmailIconActive] = useState(false);

    const onEmailIconPress = () => {
        setIsEmailIconActive(!isEmailIconActive);
        textInputRef.current.focus();
    }

    // Logic when Password eye button is pressed
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const onEyeIconPress = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }

    const forgetPassword = () => {
        Alert.alert("Please contact the SEITRAMS team!");
    }

    return (
        <View style={styles.background}>
            <View style={{ height: 0 }}>
                <Svg height={curveHeight} width={screenWidth}>
                    <Path d={`M-200 0 C ${screenWidth} 100 ${curveHeight / 5} ${curveHeight} ${screenWidth * 2.2} 0 Z`} fill="#afb281" />
                </Svg>
            </View>

            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ paddingTop: 50 }}>
                    <View style={styles.textcontainer}>
                        <Text style={styles.titletext}>
                            Hello, great to see you again!</Text>
                    </View>
                    <View>
                        <Text style={styles.login}> Log in to</Text>
                    </View>
                    <View style={{ marginTop: 60 }}>
                        <Text style={styles.textinputheader}>E-mail</Text>
                    </View>
                    <View style={styles.textinputcontainer}>
                        <TextInput
                            ref={textInputRef}
                            placeholder='*******@gmail.com'
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize='none'
                        />
                    </View>
                    <TouchableOpacity onPress={onEmailIconPress}>
                        <Image
                            source={isEmailIconActive ? require('../assets/email.png') :
                                require('../assets/email.png')}
                            style={{
                                width: 28, height: 28, position: 'absolute',
                                right: 60, bottom: 5, alignSelf: 'center'
                            }}
                        />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.textinputheader}> Password </Text>
                    </View>
                    <View style={styles.textinputcontainer}>
                        <TextInput
                            placeholder='**********'
                            secureTextEntry={!isPasswordVisible}
                            value={password}
                            onChangeText={setPassword}
                            autoCapitalize='none'
                        />
                    </View>
                    <TouchableOpacity onPress={onEyeIconPress}>
                        <Image
                            source={isPasswordVisible ? require('../assets/close_eye.png') :
                                    require('../assets/open_eye.png')}
                            style={{
                                width: 30, height: 30, position: 'absolute',
                                right: 60, bottom: 5, alignSelf: 'center'
                            }}
                        />
                    </TouchableOpacity>

                    <View style= {styles.forgetComponent}>
                        <TouchableOpacity
                            onPress={forgetPassword} 
                            style={styles.forgetPassword}>
                            <Text style={styles.forgetText}>
                                Forget Your Password?
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{ marginTop: 50 }}>
                        <TouchableOpacity
                            onPress={LoginFunction} 
                            style={styles.buttonContainer}>
                            <Text style={{
                                fontSize: 18,
                                alignSelf: 'center',
                                color: 'white'
                            }}>
                                Confirm and continue
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 80 }}>
                        <Text style={{
                            alignSelf: 'center',
                            fontSize: 18,
                        }}> Don't have an account? </Text>
                        <Text></Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("AccountRegistration")}
                            style={styles.buttonContainer}>
                            <Text style={{
                                fontSize: 18,
                                alignSelf: 'center',
                                color: 'white',

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
        marginLeft: 20
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

    forgetComponent: {
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center',
    },

    forgetText: {
        fontSize : 16,
        marginLeft : 10,
    }


})
export default Login;
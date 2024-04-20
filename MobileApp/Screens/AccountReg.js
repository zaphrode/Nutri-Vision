import React, { useState } from 'react';
import {
    Alert,
    Image,
    Linking, SafeAreaView, ScrollView, StyleSheet,
    Text, TextInput, TouchableOpacity, View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { auth } from '../../firebase/config';
import FacebookLogo from '../assets/images/facebook-logo.jpg';
import GoogleLogo from '../assets/images/google-logo.jpg';
import { createUserWithEmailAndPassword } from "firebase/auth";

const AccountReg = ({ navigation }) => {

    // Defining state for email
    const [email, setEmail] = useState('');

    // Defining state for Password Checker
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [passwordMismatchError, setPasswordMismatchError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({ message: '' });


    // Function to check password strength
    const checkPasswordStrength = (newPassword) => {
        const strength = {
            length: newPassword.length >= 8,
            hasUpper: /[A-Z]/.test(newPassword),
            hasLower: /[a-z]/.test(newPassword),
            hasNumber: /[0-9]/.test(newPassword),
            hasSpecial: /[^A-Za-z0-9]/.test(newPassword),
        };
    
        let strengthMessage = '';
        let strengthCount = 0;
    
        for (let check in strength) {
            if (strength[check]) {
                strengthCount++;
            }
        }
    
        switch (strengthCount) {
            case 0:
            case 1:
            case 2:
                strengthMessage = 'Weak';
                break;
            case 3:
            case 4:
                strengthMessage = 'Moderate';
                break;
            case 5:
                strengthMessage = 'Strong';
                break;
            default:
                strengthMessage = 'Weak';
        }
    
        setPasswordStrength({
            message: strengthMessage,
            ...strength,
        });
    };


    const checkPasswordsMatch = () => {
        if (password !== confirmPassword) {
            setPasswordMismatchError("Passwords do not match");
            return false;
        }
        setPasswordMismatchError(""); 
        return true;
    };

    const handleCreateAccountPress = async () => {
        // Check for empty fields
        if (!email.trim()) {
            Alert.alert('Missing Information', 'Please enter your email.');
            return;
        } else if (!password.trim()) {
            Alert.alert('Missing Information', 'Please enter a password.');
            return;
        } else if (!confirmPassword.trim()) {
            Alert.alert('Missing Information', 'Please confirm your password.');
            return;
        }

        const passwordsDoMatch = checkPasswordsMatch(); 
        const isPasswordStrong = passwordStrength && passwordStrength.message === 'Strong';
        
        if (!termsAccepted) {
            alert('Please read and accept the Terms and Conditions to proceed.');
            return;
        } else if (!isPasswordStrong) {
            alert('Please use a Stronger Password.');
            return;
        }
        else if (passwordsDoMatch) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
            } catch (error) {
                console.log("Account creation failed D:");
                console.log(error.message);
            }

            navigation.navigate('Login');
        } else {
            console.log("Passwords do not match.");
        }
    };


    const handlePressTerms = () => {
        // URL
        const url = 'https://www.google.com.sg/';
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    // Defining state for T&C Checker
    const [termsAccepted, setTermsAccepted] = useState(false);


    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>

                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>
                            Create Account
                        </Text>
                    </View>


                    {/* Email Input */}
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Enter Your Email'
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail} 
                    />


                    {/* Password Input */}
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder='Enter Your Password'
                            secureTextEntry={!passwordVisible} 
                            value={password} 
                            onChangeText={(newPassword) => {
                                setPassword(newPassword);
                                checkPasswordStrength(newPassword); 
                            }}
                        />
                        {/* Toggle Password Visibility Button for Password */}
                        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                            <Icon name={passwordVisible ? 'visibility-off' : 'visibility'} size={24} color="grey" />
                        </TouchableOpacity>
                    </View>

                    {passwordStrength.message && (
                        <Text style={[
                            styles.passwordStrength,
                            passwordStrength.message === 'Weak' && styles.weakPassword,
                            passwordStrength.message === 'Moderate' && styles.moderatePassword,
                            passwordStrength.message === 'Strong' && styles.strongPassword,
                        ]}>
                            Password strength: {passwordStrength.message}
                        </Text>
                    )}

                    {/* Confirm Password Input */}
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={styles.inputWrapper} >
                        <TextInput
                            style={styles.input}
                            placeholder='Re-Enter Your Password'
                            secureTextEntry={!confirmPasswordVisible} 
                            value={confirmPassword}
                            onChangeText={setConfirmPassword} 
                        />

                        {/* Toggle Password Visibility Button for Confirm Password */}
                        <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                            <Icon name={confirmPasswordVisible ? 'visibility-off' : 'visibility'} size={24} color="grey" />
                        </TouchableOpacity>
                    </View>

                    {/* Terms & Conditions */}
                    <View style={styles.termsRow}>
                        <TouchableOpacity
                            style={[styles.checkboxBase, termsAccepted && styles.checkboxChecked]}
                            onPress={() => setTermsAccepted(!termsAccepted)}
                        >
                            {termsAccepted && <Icon name="check" size={24} color="#fff" />}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlePressTerms}>
                            <Text style={styles.linkText}>Terms and Conditions**</Text>
                        </TouchableOpacity>
                    </View>


                    <TouchableOpacity onPress={handleCreateAccountPress} style={styles.createAccountButton}>
                        <Text style={styles.createAccountButtonText}>Create Account</Text>
                    </TouchableOpacity>


                    {/* Display password mismatch error */}
                    {passwordMismatchError ? <Text style={styles.error}>{passwordMismatchError}</Text> : null}

                    <Text style = {styles.orText}>OR</Text>

                    {/* Other Sign In Options */}
                    <View style={styles.signInButtonsContainer}>
                        <TouchableOpacity style={[styles.signInButton, styles.signInWithGoogle]}>
                            <Image source={GoogleLogo} style={styles.logo} />
                            <Text style={[styles.signInButtonText, styles.googleText]}>Sign in With Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.signInButton, styles.signInWithFacebook]}>
                            <Image source={FacebookLogo} style={styles.logo} />
                            <Text style={[styles.signInButtonText, styles.facebookText]}>Sign in With Facebook</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f4e5c2',
    },

    container: {
        flex: 1,
        padding: 20,
    },

    headerContainer: {
        flex: 1,
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'center',
        padding: 10,
    },

    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
    },


    label: {
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
        marginBottom: 3,
        marginTop: 8,
    },

    input: {
        flex: 1,
        paddingVertical: 10,
        paddingLeft: 10,
        backgroundColor: '#FFF',
        borderRadius: 15,
    },

    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: '#FFF',
        borderRadius: 15,
    },

    passwordStrength: {
        marginTop: 4,
    },
    
    weakPassword: {
        color: 'red',
    },
    moderatePassword: {
        color: 'orange',
    },
    strongPassword: {
        color: 'green',
    },


    linkText: {
        color: 'blue',
        textDecorationLine: 'underline',
    },

    termsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    checkboxBase: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'grey',
        marginRight: 8,
    },
    checkboxChecked: {
        backgroundColor: '#007bff',
    },


    createAccountButton: {
        marginTop: 20,
        backgroundColor: '#FFA500',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    createAccountButtonText: {
        color: '#000',
        fontSize: 19,
        fontWeight: 'bold',
    },

    signInButtonsContainer: {
        paddingBottom: 20,
    },
    
    signInButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 5,
        marginHorizontal: 20,
        marginBottom: 10,
    },
    
    orText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        textAlign: 'center',
        marginTop: 100,
        marginBottom : 15,
    
    },
    signInWithGoogle: {
        backgroundColor: '#fff',
    },

    signInWithFacebook: {
        backgroundColor: '#3b5998',
    },

    logo: {
        width: 27,
        height: 27,
        marginRight: 10,
    },
    
    signInButtonText: {
        fontSize: 16,
    },
    googleText: {
        color: '#4285F4',
    },

    facebookText: {
        color: '#fff',
    },
});

export default AccountReg;
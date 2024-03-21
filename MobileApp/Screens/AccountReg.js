import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Image, SafeAreaView, ScrollView, TouchableOpacity, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


const AccountReg = ({ navigation}) => {

    // Defining state for Password Checker
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [passwordMismatchError, setPasswordMismatchError] = useState('');

    const checkPasswordsMatch = () => {
        if (password !== confirmPassword) {
            setPasswordMismatchError("Passwords do not match");
            return false;
        }
        setPasswordMismatchError(""); // Clear any existing error message
        return true;
    };

    const handleCreateAccountPress = () => {
        const passwordsDoMatch = checkPasswordsMatch(); // Check if passwords match
        if (!termsAccepted) {
            alert('Please read and accept the Terms and Conditions to proceed.');
            return;
        } else if (passwordsDoMatch) {
            console.log("Creating account...");
            navigation.navigate('Login');
        } else {
            //the error message is set by checkPasswordsMatch,
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

                    <View style = {styles.headerContainer}>
                        <Text style={styles.headerText}>
                            Create Account
                        </Text>
                    </View>


                    {/* Email Input */}
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style = {styles.input}
                        placeholder='Enter Your Email'
                        keyboardType="email-address"
                    />


                    {/* Password Input */}
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style = {styles.input}
                            placeholder='Enter Your Password'
                            secureTextEntry={!passwordVisible} // Hide password by default
                            value={password} 
                            onChangeText={setPassword} // Update password state
                        />
                        {/* Toggle Password Visibility Button for Password */}
                        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                            <Icon name={passwordVisible ? 'visibility-off' : 'visibility'} size={24} color="grey" />
                        </TouchableOpacity>
                    </View>

                    {/* Confirm Password Input */}
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style = {styles.inputWrapper} >
                        <TextInput
                            style = {styles.input}
                            placeholder='Re-Enter Your Password'
                            secureTextEntry={!confirmPasswordVisible} // Hide confirm password by default
                            value={confirmPassword} 
                            onChangeText={setConfirmPassword} // Update confirm password state
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
            </View>
        </ScrollView>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#36622B', 
    },

    container: {
        flex: 1,
        padding: 20,
    },

    headerContainer: {
        flex : 1,
        alignItems: 'center',
        position : 'relative',
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

    //--------------------------------------------------------------------------------

    input: {
      flex: 1,
      paddingVertical: 10,
      paddingLeft : 10,
      backgroundColor: '#FFF',
      borderRadius : 15,
    },

    inputWrapper: {
        flexDirection: 'row', 
        alignItems: 'center', 
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: '#FFF',
        borderRadius : 15,
    },

    //--------------------------------------------------------------------------------


    linkText: {
        color: 'blue',
        textDecorationLine : 'underline',
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

    //--------------------------------------------------------------------------------

    createAccountButton: {
        marginTop: 20,
        backgroundColor: '#007bff', // Button background color
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center', 
        justifyContent: 'center', 
    },
    
    createAccountButtonText: {
        color: '#ffffff', 
        fontSize: 18,
        fontWeight: 'bold',
    },
  });

  export default AccountReg;
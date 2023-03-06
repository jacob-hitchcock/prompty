import React,{ useState } from 'react';
import { View,Text,TextInput,TouchableOpacity,ImageBackground,Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

// Defines the login components
const Login = () => {
    // Handles navigation
    const navigation = useNavigation();

    // Navigate to the Account page when the Login button is pressed
    // Probably change this to navigate somewhere else in the future
    const handleLoginPress = () => {
        navigation.navigate('Account');
    }

    // Navigate to the Register page when the register button is pressed
    const handleRegisterPress = () => {
        navigation.navigate('Register');
    };

    // Navigate to Forgot Password page when button is pressed
    const handleForgotPress = () => {
        navigation.navigate('Forgot');
    };

    // Tracks state of password visibility
    // Initial state: false, hiding password
    const [showPassword,setShowPassword] = useState(false);

    // Toggle password visibiility state when eyeball is pressed
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    // Component layout
    return (
        <View style={styles.formContainer}>
            <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
                <View style={styles.formWrapper}>
                    <Text style={styles.title}>Welcome to Prompty!</Text>
                    <Image style={styles.image} source={require('../../assets/prompty.png')} />
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder='Email'
                            placeholderTextColor='#878787'
                            keyboardType='email-address'
                        />
                        <View style={{ position: 'relative' }}>
                            {/* Need to edit as password is covered by keyboard */}
                            <TextInput
                                style={styles.input}
                                placeholder='Password'
                                placeholderTextColor='#878787'
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                style={{ position: 'absolute',right: 10,top: 20 }}
                                onPress={handleTogglePassword}
                            >
                                <Icon
                                    name={showPassword ? 'eye' : 'eye-slash'}
                                    size={20}
                                    color='#878787'
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={handleForgotPress}>
                            <Text style={styles.password}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.registerContainer} onPress={handleRegisterPress}>
                        <Text style={styles.register}>New to Prompty? <Text style={styles.registerLink}>Join Now</Text></Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

// Component styling
const styles = {
    formContainer: {
        flex: 1,
    },
    formWrapper: {
        width: '80%',
        alignItems: 'center',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#23356F',
        marginTop: 150,
    },
    image: {
        width: '70%',
        height: 300,
        resizeMode: 'contain',
        marginTop: -13,
    },
    inputContainer: {
        width: '100%',
    },
    input: {
        padding: 10,
        marginBottom: 20,
        width: '100%',
        height: 57,
        backgroundColor: 'white',
        borderRadius: 10,
        color: '#23356F',
    },
    password: {
        color: '#23356F',
        textAlign: 'right',
        marginTop: -10,
    },
    button: {
        backgroundColor: '#23356F',
        padding: 10,
        borderRadius: 5,
        marginTop: 75,
        width: '100%',
        height: 57,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
    },
    registerContainer: {
        marginTop: 100,
        marginBottom: 50,
    },
    register: {
        color: '#878787',
    },
    registerLink: {
        color: '#23356F',
        textDecorationLine: 'underline',
    },
};

export default Login;

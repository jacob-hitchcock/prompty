import React,{ useState } from 'react';
import { View,Text,TextInput,TouchableOpacity,ImageBackground,Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { authentication } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';


const Register = () => {
     // Handles login
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');

     const registerNewUser = () => {
       createUserWithEmailAndPassword(authentication, email, password)
       .then((res) => {
        console.log(res);
        //setSignedIn(true);
        navigation.navigate('Account')
       })
       .catch((res) => {
        console.log(res);
       })
     }


    const navigation = useNavigation();

    const handleLoginPress = () => {
        navigation.navigate('Login');
    };

    const [showPassword,setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <View style={styles.formContainer}>
            <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
                <View style={styles.formWrapper}>
                    <Text style={styles.title}>Start Connecting!</Text>
                    <Image style={styles.image} source={require('../../assets/prompty.png')} />
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder='Name'
                            placeholderTextColor='#878787'
                            onSubmitEditing={() => { this.Email.focus(); }}
                            blurOnSubmit={false}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Email'
                            placeholderTextColor='#878787'
                            keyboardType='email-address'
                            ref={(input) => { this.Email = input; }}
                            onSubmitEditing={() => { this.Password.focus(); }}
                            blurOnSubmit={false}
                            onChangeText={text => setEmail(text)} 
                        />
                        <View style={{ position: 'relative' }}>
                            <TextInput
                                style={styles.input}
                                placeholder='Password'
                                placeholderTextColor='#878787'
                                ref={(input) => { this.Password = input; }}
                                blurOnSubmit={true}
                                secureTextEntry={!showPassword}
                                onChangeText={text => setPassword(text)} 
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
                    </View>
                    <TouchableOpacity style={styles.button} onPress={registerNewUser}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.loginContainer} onPress={handleLoginPress}>
                        <Text style={styles.login}>Already have an account? <Text style={styles.loginLink}>Login</Text></Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = {
    formContainer: {
        flex: 1,
    },
    formWrapper: {
        width: '80%',
        alignItems: 'center',
        marginTop: -50,
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
        marginTop: 35,
        width: '100%',
        height: 57,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
    },
    loginContainer: {
        marginTop: 50,
        marginBottom: 50,
    },
    login: {
        color: '#878787',
    },
    loginLink: {
        color: '#23356F',
        textDecorationLine: 'underline',
    },
};

export default Register;

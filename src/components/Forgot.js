import React from 'react';
import { View,Text,TextInput,TouchableOpacity,ImageBackground,Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';


const Forgot = () => {
    const navigation = useNavigation();
    const backPress = () => {
        navigation.navigate('Login');
    };

    const handleResetPress = () => {
        navigation.navigate('Login')
    };

    return (
        <View style={styles.formContainer}>
            <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
                <View style={styles.formWrapper}>
                    <Icon
                        name={'user-lock'}
                        color={'#23356F'}
                        size={150}
                        style={styles.image}
                    />
                    <Text style={styles.instruct}>Enter the email that you registered with and we'll send you instructions on resetting your password.</Text>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} placeholder='Email' placeholderTextColor='#878787' />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleResetPress}>
                        <Text style={styles.buttonText}>Reset My Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.back} onPress={backPress}>
                        <Text style={styles.backText}>Cancel</Text>
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
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        alignItems: 'center',
    },
    image: {
        marginTop: 240,
        marginBottom: 100,
    },
    instruct: {
        fontSize: 16,
        color: '#23356F',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        width: '100%',
    },
    input: {
        padding: 10,
        marginBottom: 0,
        width: '100%',
        height: 57,
        backgroundColor: 'white',
        borderRadius: 10,
        color: '#23356F',
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
    back: {
        borderWidth: 2,
        borderColor: '#23356F',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        height: 57,
        justifyContent: 'center',
    },
    backText: {
        color: '#23356F',
        textAlign: 'center',
        fontSize: 18,
    },
};

export default Forgot;

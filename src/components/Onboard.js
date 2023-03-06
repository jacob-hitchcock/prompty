import React,{ useState } from 'react';
import { StyleSheet,View,Text,Image,TouchableOpacity,ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Lottie from 'lottie-react-native';

const Onboard = () => {
    const [slideIndex,setSlideIndex] = useState(0);

    const slides = [
        {
            image: require('../../assets/prompty.png'),
            title: 'Prompty',
            description: 'Conversation Starters Made for You',
        },
        {
            image: require('../../assets/prompty.png'),
            title: 'Prompty',
            description: 'With daily prompts you can get to know your family members past the surface',
        },
        {
            image: require('../../assets/prompty.png'),
            title: 'Prompty',
            description: 'Sign up to get started on building your relationships',
        },
    ];
    const navigation = useNavigation();

    const handleNextSlide = () => {
        if(slideIndex < slides.length - 1) {
            setSlideIndex(slideIndex + 1);
        } else {
            navigation.navigate('Login');
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
                <View style={styles.imageContainer}>
                    <Lottie source={require('../../assets/Speech_Bubble.json')} autoPlay loop />
                </View>
                <Text style={styles.title}>{slides[slideIndex].title}</Text>
                <Text style={styles.description}>{slides[slideIndex].description}</Text>
                <TouchableOpacity style={styles.button} onPress={handleNextSlide}>
                    <Text style={styles.buttonText}>{slideIndex === slides.length - 1 ? 'Begin' : 'Next'}</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
    },
    image: {
        width: '50%',
        height: 300,
    },
    title: {
        fontSize: 45,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#23356F',
        marginTop: -100,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginHorizontal: 40,
        marginTop: 30,
        marginBottom: 80,
        color: 'rgba(35, 53, 111, 0.76)',
        height: 50,
    },
    button: {
        backgroundColor: '#23356F',
        padding: 10,
        borderRadius: 5,
        marginTop: 'auto',
        marginBottom: 100,
        alignSelf: 'center',
        justifyContent: 'center',
        width: 285,
        height: 57,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        textAlignVertical: 'center',
    },
});

export default Onboard;

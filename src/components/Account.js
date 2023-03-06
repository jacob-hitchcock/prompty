import React,{ useState } from 'react';
import { StyleSheet,View,Text,ImageBackground,Image,TouchableOpacity,TextInput } from 'react-native';
import Navbar from './Navbar';

const Account = () => {
    const [name,setName] = useState("What's Your Name?");
    const [tempUsername,setTempUsername] = useState('Name');
    const [username,setUsername] = useState('');
    const [isEditingName,setIsEditingName] = useState(false);

    const handleNamePress = () => {
        setIsEditingName(true);
        setName('');
    };

    const handleNameChange = (newName) => {
        setName(newName);
        const newUsername = '@' + newName.trim().split(' ').join('_').toLowerCase();
        setTempUsername(newUsername);
    };

    const handleNameSubmit = () => {
        setUsername(tempUsername);
        setIsEditingName(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.accountContainer}>
                <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
                    <View style={styles.infoContainer}>
                        <Image source={require('../../assets/placeholder.png')} style={styles.profilePicture} />
                        {isEditingName ? (
                            <TextInput
                                style={styles.editableText}
                                onChangeText={handleNameChange}
                                value={name}
                                autoFocus={true}
                                onSubmitEditing={handleNameSubmit}
                            />
                        ) : (
                                <Text style={styles.info}>{name}</Text>
                            )}
                        <Text style={styles.info}>{username}</Text>

                        <TouchableOpacity onPress={handleNamePress}>
                            <Text style={styles.edit}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
            <Navbar />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6D7EB6',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    accountContainer: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '95%',
        borderWidth: 1,
        borderColor: '#6D7EB6',
        borderRadius: 50,
        overflow: 'hidden',
    },
    infoContainer: {
        flex: 1,
        marginTop: 150,
        alignItems: 'center',
    },
    info: {
        fontSize: 20,
        color: '#27292E',
        marginBottom: 5,
    },
    profilePicture: {
        height: 265,
        width: 265,
        borderWidth: 15,
        borderColor: '#E2E6F3',
        borderRadius: 40,
        marginBottom: 20,
    },
    editableText: {
        fontSize: 20,
        color: '#27292E',
        marginBottom: 5,
        width: '80%',
        textAlign: 'center',
    },
    edit: {
        color: '#23356F',
        textDecorationLine: 'underline',
    }
});

export default Account;

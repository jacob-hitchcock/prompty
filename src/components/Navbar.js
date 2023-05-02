import React from 'react';
import { StyleSheet,View,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icons from 'react-native-vector-icons/FontAwesome';
import { useNavigation,useRoute } from '@react-navigation/native';

const Navbar = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const handleAccountPress = () => {
        navigation.navigate('Account');
    };

    const handleChatsPress = () => {
        navigation.navigate('Chats');
    };

    const handleContactsPress = () => {
        navigation.navigate('Contacts');
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.icons} onPress={handleContactsPress}>
                    <Icon
                        name={'user-friends'}
                        color={route.name === 'Contacts' ? '#24366F' : '#C7C7C7'}
                        size={42}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.icons} onPress={handleChatsPress}>
                    <Icons
                        name={'commenting'}
                        color={route.name === 'Chats' ? '#24366F' : '#C7C7C7'}
                        size={42}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 90,
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    icons: {
        marginHorizontal: 40,
    },
    fillView: {
        position: 'absolute',
        width: 37,
        height: 33,
        top: 2,
        left: 2,
        borderRadius: 5,
        backgroundColor: '#C7C7C7'
    }
});

export default Navbar;

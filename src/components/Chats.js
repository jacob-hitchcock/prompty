import React from 'react';
import { StyleSheet,View,Text,ImageBackground,Image,TouchableOpacity,TextInput } from 'react-native';
import Navbar from './Navbar';

// Fake data for now
 const peopleChats = {
    "Person1": {},
    "Person2": {},
    "Person3": {},
    "Person4": {},
    "Person5": {},
    "Person6": {}
 };


 // fetch someone's friend list array, which should have each friend's user ID
 // using each user ID, render each person's name and profile pic
 // rows of two
 


 const chatViews = Object.keys(peopleChats).map((current) => {
    
 });


const Chats = () => {
    return (
        <View style={styles.container}>
            <Text>Chats</Text>

            <Navbar />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6D7EB6',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default Chats;

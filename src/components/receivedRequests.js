import React, { useState } from 'react';
import { StyleSheet,View,Text,ImageBackground,Image,TouchableOpacity,TextInput } from 'react-native';
import Navbar from './Navbar';
import { doc, getDoc, updateDoc, get, query, where, collection, getDocs, setDoc, addDoc } from "firebase/firestore";
import {getAuth, onAuthStateChanged} from "firebase/auth";

const Requests = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const userID = user.uid;
    console.log(userID);
    // query subcollection where recipient is current user
    // might have to import on snapshot or whatever it's called
    // get each request and display the sender's name and picture
    // maybe rows of 2, each with a button for deny or accept
    // when they deny or accept, change status or delete
    // if accept, add each person's uid into each other's friend array
    // delete request
    // IMPORTANT FOR CHAT:
    // when accepted friend request, create a new document? inside a collection called chats
    // this document should probably have each person's uid
    // and a collection of messages? 
    // collection of prompts??

    // or maybe, messages have an attribute called "messageType" which can either be of type "message" or type "prompt" and depending on which, we can render messages as normal and prompts as something special???
    async function getRequests() {

    }

    return (
        <View style={styles.container}>
            <Text>Requests Screen</Text>

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

export default Requests;

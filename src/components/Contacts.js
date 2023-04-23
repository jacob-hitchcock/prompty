import React, { useState } from 'react';
import { StyleSheet,View,Text,ImageBackground, Image,TouchableOpacity,TextInput } from 'react-native';
import Navbar from './Navbar';
import { SearchBar } from 'react-native-elements';
import { doc, getDoc, updateDoc, get, query, where, collection, getDocs, setDoc, addDoc } from "firebase/firestore";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { promptyDB } from '../../firebase';

const Contacts = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    async function sendFriendRequest(userID) {
        const auth = getAuth();
        const user = auth.currentUser;
        const currentID = user.uid;

        // gets reference to friend request collection
       
        const requestRef = doc(promptyDB, "friendRequests", userID, "receivedRequests", currentID);

        await setDoc(requestRef, {
            sender: currentID,
            recipient: userID,
            senderDisplayName: user.displayName,
            senderPhotoURL: user.photoURL,
            status: "pending"
        })
        console.log("friend request sent to user: " + userID + " by user: " + user.uid);
    }

    async function searchUsers(username) {
    console.log(username);
        setSearchTerm(username);
        const usersRef = collection(promptyDB, "users");
        const userQuery = query(usersRef, where("username", "==", username))
        const result = await getDocs(userQuery);
        const userDocuments = result.docs.map((doc) => doc.data());
        setSearchResults(userDocuments);
    }
   
    let resultView;
    console.log(searchResults);
    
    if (searchResults.length > 0) {
        resultView = <TouchableOpacity onPress={() => sendFriendRequest(searchResults[0].userId)}>
            <Image style={{ width: 200, height: 200, marginTop: 30 }} source={{uri: searchResults[0].profilePictureUrl}} />
            <Text>{searchResults[0].username}</Text>
        </TouchableOpacity>
    }
    
    return (
        <View style={styles.container}>
                <SearchBar style={styles.searchBar}platform='ios' placeholder='username' onChangeText={text => searchUsers(text)} value={searchTerm}></SearchBar>
                {resultView}
            <Image source={{uri: ''}}></Image>
        <Navbar />
        </View>
    );
};

const styles = StyleSheet.create({
    topContainer: {
        backgroundColor: 'E2E6F3'
    },
    container: {
        flex: 1,
        backgroundColor: '#6D7EB6',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 60
    },
    searchBar: {

    },
    userResult: {

    }
});

export default Contacts;

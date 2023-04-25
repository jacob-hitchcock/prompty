import React, { useState } from 'react';
import { StyleSheet,View,Text,ImageBackground, Image,TouchableOpacity,TextInput, Button, ScrollView } from 'react-native';
import Navbar from './Navbar';
import { SearchBar } from 'react-native-elements';
import { doc, getDoc, updateDoc, get, query, where, collection, getDocs, setDoc, addDoc } from "firebase/firestore";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { promptyDB } from '../../firebase';
import { LinearGradient }from 'expo-linear-gradient'

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
    //console.log(username);
        setSearchTerm(username);
        const usersRef = collection(promptyDB, "users");
        const userQuery = query(usersRef, where("username", "==", username))
        const result = await getDocs(userQuery);
        const userDocuments = result.docs.map((doc) => doc.data());
        setSearchResults(userDocuments);
    }
   
    let resultView;
    //console.log(searchResults);
    
    if (searchResults.length > 0) {
        resultView = 
        <View style={{alignItems: 'center', marginTop: 20}} >
            <View style={styles.searchResultView}>
            <Image style={{ width: '100%', height: '100%'}} source={{uri: searchResults[0].profilePictureUrl}} />
            </View>
            <Text style={styles.userResultText}>@{searchResults[0].username}</Text>
            <View style={styles.button}>
                <Button title='Send Request' onPress={() => sendFriendRequest(searchResults[0].userId)}></Button>
            </View>
            
        </View>
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.searchBarView}>
                <SearchBar containerStyle={styles.containerStyle}  cancelButtonProps={{color: 'white'}} platform='ios' placeholder='username' onChangeText={text => searchUsers(text)} value={searchTerm}></SearchBar>
                {resultView}
            <Image source={{uri: ''}}></Image>
            </View>


            <ScrollView style={styles.secondView}>
                <Text> Hello</Text>
            </ScrollView>
            <Navbar />
        </View>
    );
};

const styles = StyleSheet.create({
    topContainer: {
        backgroundColor: '#24366F'
    },
    container: {
        flex: 1,
        backgroundColor: '#24366F',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 60
    },
    searchBar: {
        borderWidth: 0,
        borderColor: 'transparent'
    },
    userResultText: {
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontSize: 20,
        marginTop: 15,
        color: 'white'
    },
    searchBarView: {
        flex: 1,
        backgroundColor: '#24366F'
    },
    containerStyle: {
        backgroundColor: 'transparent',
        width: '90%'
    },
    searchResultView : {
        alignItems: 'center',
        width: 200,
        height: 200,
        borderWidth: 15,
        borderColor: '#E2E6F3',
        borderRadius: 20
    },
    secondView : {
        flex: 1,
        backgroundColor: '#F3F3F3',
        width: '100%',
        height: '50%'
    },
    button: {
        borderRadius: 6,
        overflow: 'hidden',
        backgroundColor: '#000',
        marginTop: 15
    }
});

//E2E6F3
export default Contacts;

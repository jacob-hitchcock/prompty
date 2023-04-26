import React, { useState, useEffect} from 'react';
import Navbar from './Navbar';
import { StyleSheet,View,Text,ImageBackground,Image,TouchableOpacity,TextInput, ScrollView , Button} from 'react-native';
import { doc, getDoc, updateDoc, get, query, where, collection, getDocs, setDoc, addDoc, deleteDoc} from "firebase/firestore";
import { promptyDB } from '../../firebase';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icons from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from "firebase/auth";

 const fakeFriends = [{friend: "RuIDqCW1bbb3APY7oeBfpf3XVIy1", friendDisplayName: "Travondragon", friendPhotoUrl: "https//firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c"}];

 // fetch someone's friend list array, which should have each friend's user ID
 // using each user ID, render each person's name and profile pic
 // rows of two

const Chats = () => {
    const [chats, setChats] = useState([]);
    useEffect(async () => {
        const data = await getFriends();
        setChats(data);
        }, []);

    const navigation = useNavigation();

    function handleChat() {
    }

    const user = getAuth().currentUser;
    const userID = user.uid;

    async function getFriends() {
        const friendsListCollection = collection(promptyDB, 'users', userID, 'friends');
        const friendsList = await getDocs(friendsListCollection)
        let friendsArr = [];
        friendsList.forEach((friend) => {
            friendsArr.push(friend.data());
        });
        console.log(friendsArr)
        const friendCards = friendsArr.map((friend) => {
            return (
                <View key={friend.id} style={{alignItems: 'center', width: '50%', marginBottom: 5, marginTop: 10}} >
                    <View style={{ overflow: 'hidden', height: 170, width: 170, borderRadius: 15, position: 'relative'}}>
                            <ImageBackground style={styles.card}source={{uri: friend.friendPhotoURL}}>
                                <TouchableOpacity style={styles.chatButton} onPress={() => handleChat(friend)}>
                                    <Text style={styles.chatButtonText}>Chat</Text>
                                </TouchableOpacity>
                            </ImageBackground>
                        </View>
                        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white', marginTop: 5}}>@{friend.friendDisplayName}</Text>
                    </View>
            );
        });
        //console.log(friendCards);
        return friendCards;
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                
        <Text style={{ flex: 1, fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 25 }}>Chats</Text>

            </View>
            <ScrollView style={styles.scroll} contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {chats}
            </ScrollView>
            <Navbar />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#24366F'
    },
    header: {
        flexDirection: 'row', 
        alignItems: 'center', 
        height: 80, 
        backgroundColor: '#f0f0f0', 
        justifyContent: 'center' 
    },
    scroll: {
        marginTop: 10,
        marginBottom: 100
    },
    card: {
        width: '100%',
        height: '100%',
        flex: 1
    },
    chatButton: {
        backgroundColor: '#24366F',
        padding: 10,
        height: 39,
        width: 150,
        borderRadius: 10,
        top: 120,
        left: 10
    }, 
    chatButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});

export default Chats;

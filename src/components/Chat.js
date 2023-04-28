import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { StyleSheet,View,Text,ImageBackground,Image,TouchableOpacity,TextInput, ScrollView , Button} from 'react-native';
import Navbar from './Navbar';
import { doc, getDoc, updateDoc, get, query, where, collection, getDocs, setDoc, addDoc, deleteDoc, serverTimestamp, orderBy, limit, onSnapshot, QuerySnapshot} from "firebase/firestore";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { promptyDB } from '../../firebase';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icons from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Chat = ({route}) => {
    const {usersChatRef, messagesCollectionRef, usersChatData, currentUserID, friendID, friendImg, friendName} = route.params;
    //console.log(usersChatData);
    const navigation = useNavigation();
    const [messages, setMessages] = useState({});

    useEffect(async () => {
        const data = await getMessages();
        setMessages(data);
    }, []);

    // make onSnapshot event listener?
 
    async function getMessages() {
        // need ref to collection
        //await getDocs(messagesCollectionRef);
        const messagesQuery = query(messagesCollectionRef, orderBy("timeStamp", "desc"));
        let messages = [];
        onSnapshot(messagesQuery, (snapshot) => {
                console.log("refresh messages")
                snapshot.forEach((message) => {
                messages.push({id: message.id, ...message.data()});
            });
        });
        console.log("messages: " + messages)
        return messages;
    }

    // get friend data
    async function getFriendData() {
        const friendDocRef = doc(promptyDB, "users", friendID);
        const friendDoc = await getDoc(friendDocRef);
        let friendData;
        if (friendDoc.exists()) {
            friendData = friendDoc.data();
        }
       return friendData;
    }


    // will probably need to take a message object or something
    // sender, recipient, timestamp, content, text? or is text within content
    async function sendMessage(newMessages = []) {
        const newMessage = newMessages[0];
        //console.log(newMessages[0]);

        //await addDoc(messagesCollectionRef, newMessage);
        
        await addDoc(messagesCollectionRef, 
            // newMessages[0] has:
                // _id
                // createdAt
                // text
                // also has a user object which is empty if not set
            {
            senderID: currentUserID,
            recipientID: friendID,
            timeStamp: serverTimestamp(),
            content: '',
            type: 'non-prompt',
            ...newMessage
            }); 
        console.log("message sent!");
    }

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                    
                    <Image style={styles.friendPic}source={{uri: friendImg}} />
                    <Text style={styles.friendUsername}>@{friendName}</Text>
        
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}><Text style={styles.back}>Back</Text></TouchableOpacity>
            </View>
                <View style={styles.chat}>
                
                    <GiftedChat 
                        messages={messages} 
                        onSend={sendMessage} 
                        user={{_id: currentUserID,
                        }}
                        />
                </View>
            <Navbar></Navbar>
      </View>
    
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6D7EB6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: { 
        flex: 1, 
        backgroundColor: '#E2E6F3', 
        height: 1, 
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    chat: {
        flex: 3,
        marginBottom: 100,
        width: "100%",
        backgroundColor: '#F3F3F3'
    },
    friendPic: {
        height: 100,
        width: 100,
        marginBottom: 5,
        marginTop: 30,
        borderRadius: 100
    },
    friendUsername: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#24366F'
    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: 55,
        borderWidth: 2,
        borderColor: '#23356F',
        borderRadius: 5,
        padding: 5,
    },
    back: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#23356F'
    }
    
});

export default Chat;
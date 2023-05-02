import React,{ useState,useEffect } from 'react';
import Account from './Account';
import Contacts from './Contacts';
import { StyleSheet,View,Text,ImageBackground,Image,TouchableOpacity,TextInput,ScrollView,Button } from 'react-native';
import { doc,getDoc,updateDoc,get,query,where,collection,getDocs,setDoc,addDoc,deleteDoc } from "firebase/firestore";
import { promptyDB } from '../../firebase';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icons from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from "firebase/auth";

const fakeFriends = [{ friend: "RuIDqCW1bbb3APY7oeBfpf3XVIy1",friendDisplayName: "Travondragon",friendPhotoUrl: "https//firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c" }];

// fetch someone's friend list array, which should have each friend's user ID
// using each user ID, render each person's name and profile pic
// rows of two
const Chats = () => {

    const handleThisPress = () => {
        navigation.navigate('Account');
    }
    const [chats,setChats] = useState([]);
    useEffect(async () => {
        const data = await getFriends();
        setChats(data);
    },[]);

    const navigation = useNavigation();

    async function handleChat(friend) {
        const friendID = friend.friend;
        const userID = getAuth().currentUser.uid;
        const chatsCollectionRef = collection(promptyDB,"chats");

        const chatQuery = query(chatsCollectionRef,where("participant1","in",[userID,friendID]),where("participant2","in",[userID,friendID]));

        const queryDoc = await getDocs(chatQuery);

        const usersChatRef = queryDoc.docs.map((doc) => doc)[0].ref;
        const usersChatData = queryDoc.docs.map((doc) => doc)[0].data();
        //console.log(usersChatData)
        //await updateDoc(usersChatRef, {text: "Travvy you did it!"})
        const messagesCollectionRef = collection(usersChatRef,"messages");

        // for adding new messages
        //await addDoc(messagesCollectionRef, {test: "travvy u did it again!"})
        // important variables to send to chat component as prop
        // data = userschatdata, sender = userID, recipient= friendID
        // send ref?
        navigation.navigate("Chat",{
            usersChatRef: usersChatRef,
            messagesCollectionRef: messagesCollectionRef,
            usersChatData: usersChatData,
            currentUserID: userID,
            friendID: friendID,
            friendImg: friend.friendPhotoURL,
            friendName: friend.friendDisplayName
        });
    }

    const user = getAuth().currentUser;
    const userID = user.uid;
    async function getFriends() {
        const friendsListCollection = collection(promptyDB,'users',userID,'friends');
        const friendsList = await getDocs(friendsListCollection)
        let friendsArr = [];
        friendsList.forEach((friend) => {
            friendsArr.push(friend.data());
        });
        const friendCards = friendsArr.map((friend) => {
            return (
                <View key={friend.id} style={{ alignItems: 'center',width: '50%',marginBottom: 5,marginTop: 10 }} >
                    <View style={{ overflow: 'hidden',height: 170,width: 170,borderRadius: 15,position: 'relative' }}>
                        <ImageBackground style={styles.card} source={{ uri: friend.friendPhotoURL }}>
                            <TouchableOpacity style={styles.chatButton} onPress={() => handleChat(friend)}>
                                <Text style={styles.chatButtonText}>Chat</Text>
                            </TouchableOpacity>
                        </ImageBackground>
                    </View>
                    <Text style={{ fontSize: 20,fontWeight: 'bold',textAlign: 'center',color: '#24366F',marginTop: 5 }}>@{friend.friendDisplayName}</Text>
                </View>
            );
        });
        //console.log(friendCards);
        if(friendsArr.length < 1) {
            return (
                <View style={{ flex: 1,width: '100%',alignItems: 'center' }}>
                    <Text style={{ fontSize: 15,color: '#23356F',textAlign: 'center',marginTop: 15 }}>No Current Chats, Add Contacts to Get Started!</Text>
                </View>
            )
        } else {
            return friendCards;
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.appContainer}>
                <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
                    <View style={styles.profile}>
                        <Account />
                    </View>
                    <Text style={{ marginTop: -5,marginLeft: 15,fontWeight: 'bold',fontSize: 35,color: '#24366F' }}>Chats</Text>
                    <ScrollView style={styles.scroll} contentContainerStyle={{ flexDirection: 'row',flexWrap: 'wrap' }}>
                        {chats}
                    </ScrollView>
                </ImageBackground>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6D7EB6',
        height: '100%'
    },
    appContainer: {
        flex: 1,
        height: '100%',
    },
    background: {
        height: '100%',
        marginTop: 50,
        borderRadius: 40,
        overflow: 'hidden',
    },
    scroll: {
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
    },
    profile: {
        marginTop: 20,
    }
});

export default Chats;

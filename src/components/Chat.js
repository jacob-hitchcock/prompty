import React, { useState, useEffect } from 'react';
import { GiftedChat, InputToolbar, ChatInput, SendButton, Bubble, Send} from 'react-native-gifted-chat';
import { StyleSheet,View,Text,ImageBackground,Image,TouchableOpacity,TextInput, ScrollView , Button} from 'react-native';
import Navbar from './Navbar';
import { doc, getDoc, updateDoc, get, query, where, collection, getDocs, setDoc, addDoc, deleteDoc, serverTimestamp, orderBy, limit, onSnapshot, QuerySnapshot} from "firebase/firestore";
import {getAuth } from "firebase/auth";
import { promptyDB, promptyStorage} from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Input } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { Alert } from 'react-native';


const Chat = ({route}) => {
    const user = getAuth().currentUser;
    const userProfile = user.photoURL;
    const username = user.displayName;
 
    const {usersChatRef, messagesCollectionRef, usersChatData, currentUserID, friendID, friendImg, friendName} = route.params;

    const navigation = useNavigation();
    const [messages, setMessages] = useState({});
    const [chatMedia, setChatMedia] = useState('');

    // I wrote this effect hook myself and chatGPT helped me debug an undetected error with setMessages
    useEffect(() => {
        const messagesQuery = query(messagesCollectionRef, orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
          const messages = snapshot.docs.map(doc => {
            const messageToBePushed = {id: doc.id, ...doc.data()};
            // Remove the extra quotes around date and namestring
            messageToBePushed.createdAt = messageToBePushed.createdAt.slice(1, -1);
            return messageToBePushed;
          });
          setMessages(messages);
        });
        return unsubscribe;
      }, []);
    
    async function sendMessage(newMessages = []) {
        const newMessage = newMessages[0];
        console.log(newMessage)
        let messageDoc = {
            senderID: currentUserID,
            recipientID: friendID,
            content: '',
            type: 'non-prompt',
            ...newMessage
        }
        
        // ChatGPT helped with this block
        let mediaURL = '';
        if (chatMedia) { // result.assets[0].uri
            const blob = await chatMedia.blob();
            const mediaCollectionRef = ref(promptyStorage, "chatMedia");
            const mediaRef = ref(mediaCollectionRef, `${newMessage._id}`);
            uploadBytes(mediaRef, blob).then(async (snapshot) => {
                mediaURL = await getDownloadURL(mediaRef);
                console.log(messageDoc)
                console.log(mediaURL)
            }).catch((error) => {
                console.log("Error: " + error);
            });
        }
        //console.log(messageDoc);
        const dateAsString = JSON.stringify(messageDoc.createdAt);
        messageDoc.createdAt = dateAsString;
        messageDoc.mediaURL = mediaURL;
        await addDoc(messagesCollectionRef, messageDoc); 
    }

    async function handlePrompts() {
        const promptCollectionRef = collection(promptyDB, "prompts");
        const promptDocs = await getDocs(promptCollectionRef).then((snapshot) => {
            let prompts = [];
            snapshot.forEach((currentPrompt) => {
                prompts.push({
                    id: currentPrompt.id,
                    ...currentPrompt.data()
                });
            });
            return prompts;
        });

        // consulted ChatGPT for random number generation
        const randomPromptIndex = Math.floor(Math.random() * promptDocs.length);
        const randomPrompt = promptDocs[randomPromptIndex];
        const randomPromptText = randomPrompt.prompt;
        const randomPromptId = randomPrompt.id;
        console.log(randomPromptId + ": " + randomPromptText);
        Alert.alert(
            'Send Prompt?',
            `${randomPromptText}`,
        [{ text: 'Cancel', onPress: () => console.log('Cancel Pressed') },
        { text: 'Send', onPress: () => sendPrompt(randomPromptId, randomPromptText)}
        ],
        );
    }

    async function sendPrompt(randomPromptId, randomPromptText) {
        const user = {_id: currentUserID, 
            avatar: userProfile,
            name: username
        }
        // chatGPT helped with generating randomID with timestamp
            // and random number
        const timestamp = new Date().getTime();
        const randomNumber = Math.floor(Math.random() * 1000000);
        const uniqueId = `${timestamp}-${randomNumber}`;
        const promptDoc = {
            _id: uniqueId,
            createdAt: JSON.stringify(timestamp),
            text: randomPromptText,
            type: 'prompt',
            user: user
        }
        await addDoc(messagesCollectionRef, promptDoc); 
    }

    // ChatGPT helped with this function
    async function handleImages() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync().catch((error) => {
            console.log("Error: " + error);
           });
        if (status !== 'granted') {
          alert('Permission to access media library is required!');
          return;
        }
        // Opens camera roll library, allows user to select image
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          }).catch((error) => {
            console.log("Error: " + error);
           });
          if (!result.canceled) {
            const res = await fetch(result.assets[0].uri).catch((error) => {
                console.log("Error: " + error);
            });
            setChatMedia(res);
        }
    }
    //ChatGPT helped with styling
    function renderBubble(props) {
        if (props.currentMessage.type === "prompt") {
            return (
                <Bubble {...props}
                wrapperStyle={{
                    right: {
                      backgroundColor: '#23356F',
                      borderRadius: 15,
                      marginBottom: 5,
                      borderTopRightRadius: 15,
                      borderTopLeftRadius: 15,
                      borderBottomRightRadius: 15,
                      height: 100,
                      justifyContent: 'center'
                    },
                    left: {
                      backgroundColor: '#0084ff',
                      borderRadius: 15,
                      marginBottom: 5,
                      borderTopRightRadius: 15,
                      borderTopLeftRadius: 15,
                      borderBottomLeftRadius: 15,
                      height: 100,
                      justifyContent: 'center'
                    },
                  }}
                  textStyle={{
                    right: {
                      color: 'white',
                      fontFamily: 'Helvetica',
                      fontWeight: 'bold',
                    },
                    left: {
                      color: 'white',
                      fontFamily: 'Helvetica',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    },
                  }}
                />
            );
        } else {
            return (
                <Bubble {...props}
                wrapperStyle={{
                    right: {
                      backgroundColor: '#6D7EB6',
                      borderRadius: 15,
                      marginBottom: 5,
                      borderTopRightRadius: 15,
                      borderTopLeftRadius: 15,
                      borderBottomRightRadius: 15,
                      justifyContent: 'center'
                    },
                    left: {
                      backgroundColor: '#E2E6F3',
                      borderRadius: 15,
                      marginBottom: 5,
                      borderTopRightRadius: 15,
                      borderTopLeftRadius: 15,
                      borderBottomLeftRadius: 15,
                      justifyContent: 'center'
                    },
                  }}
                  textStyle={{
                    right: {
                      color: 'white',
                      fontFamily: 'Helvetica',
                    },
                    left: {
                      color: '#23356F',
                      fontFamily: 'Helvetica',
                    },
                  }}
                />
            );
        }
    }   

    function renderSend(props) {
        return (
            <Send { ...props}>
                <View>
                    <MaterialCommunityIcons style={{marginBottom: 2, marginRight: 5}}color='#24366F' name="send-circle" size={40}/>
                </View>
            </Send>
        );
    }

    function renderScrolltoBottom() {
        return(
            <FontAwesome5Icon name="angle-double-down" size={22} color= '#24366F'></FontAwesome5Icon>
        );
    }
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.friendPic}source={{uri: friendImg}} />
                <Text style={styles.friendUsername}>@{friendName}</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}><FontAwesome name="chevron-left" size={30} color='#23356F' /></TouchableOpacity>
            </View>
                <View style={styles.chat}>
                    <GiftedChat 
                        messages={messages} 
                        onSend={sendMessage} 
                        renderBubble={renderBubble}
                        alwaysShowSend
                        scrollToBottom
                        scrollToBottomComponent={renderScrolltoBottom}
                        renderSend={renderSend}
                        user={{_id: currentUserID, 
                            avatar: userProfile,
                            name: username
                        }} 
                    />
                <View style={styles.bottomOptions}>
                <TouchableOpacity style={styles.imagePicker} onPress={handleImages}>
                    <MaterialCommunityIcons name="image-multiple" color="#24366F" size={70} />
                    <Text style={styles.buttonText}>Media</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.prompts} onPress={handlePrompts}>
                    <MaterialCommunityIcons name="message-text-outline" color="#24366F" size={70} />
                    <Text style={styles.buttonText}>Prompts</Text>
                    </TouchableOpacity>
                </View>  
                </View>
         
      </View>
    
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2E6F3',
        justifyContent: 'center',
        alignItems: 'center'
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
        padding: 5,
    },
    button: {
        position: 'absolute',
        left: 10,
        top: 55,
        borderWidth: 2,
        borderColor: '#23356F',
        borderRadius: 5,
        padding: 5,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#23356F',
        textAlign: 'center'
    },
    imagePicker: {
        marginRight: 100
    },
    bottomOptions: {
        height: 100,
        backgroundColor: '#E2E6F3',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 15
    }
    
});

export default Chat;
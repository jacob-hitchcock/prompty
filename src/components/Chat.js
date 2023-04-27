import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { StyleSheet,View,Text,ImageBackground,Image,TouchableOpacity,TextInput, ScrollView , Button} from 'react-native';
import Navbar from './Navbar';
import { doc, getDoc, updateDoc, get, query, where, collection, getDocs, setDoc, addDoc, deleteDoc} from "firebase/firestore";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { promptyDB } from '../../firebase';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icons from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


const Chat = () => {
    const [messages, setMessages] = useState([]);
    function sendMessage() {
        console.log("message sent!");
    }


    async function getMessages() {

    }

    return(
        <View style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: '#E2E6F3' }}>
          {/* Any other components can be added here */}
        </View>
        <View style={styles.chat}>
          <GiftedChat messages={messages} onSend={sendMessage} />
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
    chat: {
        flex: 3,
        marginBottom: 100,
        backgroundColor: '#F3F3F3'
    }
});

export default Chat;
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

}

export default Chat;
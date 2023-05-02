import React,{ useState } from 'react';
import { StyleSheet,View,Text,ImageBackground,Image,TouchableOpacity,TextInput,Button,ScrollView } from 'react-native';
import Navbar from './Navbar';
import { SearchBar } from 'react-native-elements';
import { doc,getDoc,updateDoc,get,query,where,collection,getDocs,setDoc,addDoc } from "firebase/firestore";
import { getAuth,onAuthStateChanged } from "firebase/auth";
import { promptyDB } from '../../firebase';
import { LinearGradient } from 'expo-linear-gradient'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const Contacts = () => {
    const [searchTerm,setSearchTerm] = useState('');
    const [searchResults,setSearchResults] = useState([]);
    const navigation = useNavigation()

    async function sendFriendRequest(userID) {
        const auth = getAuth();
        const user = auth.currentUser;
        const currentID = user.uid;
        const requestRef = doc(promptyDB,"friendRequests",userID,"receivedRequests",currentID);

        await setDoc(requestRef,{
            sender: currentID,
            recipient: userID,
            senderDisplayName: user.displayName,
            senderPhotoURL: user.photoURL,
            status: "pending"
        })
        console.log("friend request sent to user: " + userID + " by user: " + user.uid);
    }

    async function searchUsers(username) {
        setSearchTerm(username);
        const usersRef = collection(promptyDB,"users");
        const userQuery = query(usersRef,where("username","==",username))
        const result = await getDocs(userQuery);
        const userDocuments = result.docs.map((doc) => doc.data());
        setSearchResults(userDocuments);
    }

    let resultView;

    if(searchResults.length > 0) {
        resultView =
            <View style={{ alignItems: 'center',marginTop: 20 }} >
                <View style={styles.searchResultView}>
                    <Image style={{ width: '100%',height: '100%' }} source={{ uri: searchResults[0].profilePictureUrl }} />
                </View>
                <Text style={styles.userResultText}>@{searchResults[0].username}</Text>
                <View style={styles.button}>
                    <Button title='Send Request' onPress={() => sendFriendRequest(searchResults[0].userId)} color='white'></Button>
                </View>
            </View>
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}><FontAwesome name="chevron-left" size={30} color='#23356F' /></TouchableOpacity>
                <View style={styles.searchBarView}>
                    <SearchBar containerStyle={styles.containerStyle} cancelButtonProps={{ color: '#24366F' }} platform='ios' placeholder='username' onChangeText={text => searchUsers(text)} value={searchTerm}></SearchBar>
                    {resultView}
                    <Image source={{ uri: '' }}></Image>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6D7EB6',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        marginTop: 50,
        borderRadius: 40,
        overflow: 'hidden'
    },
    searchBar: {
        borderWidth: 0,
        borderColor: 'transparent'
    },
    userResultText: {
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontSize: 20,
        marginTop: 5,
        color: '#24366F',
        fontWeight: 'bold'
    },
    searchBarView: {
        flex: 1,
    },
    containerStyle: {
        backgroundColor: 'transparent',
        width: '80%',
        left: 10
    },
    searchResultView: {
        alignItems: 'center',
        width: 200,
        height: 200,
        borderWidth: 15,
        borderColor: '#E2E6F3',
        borderRadius: 20
    },
    button: {
        borderRadius: 6,
        overflow: 'hidden',
        backgroundColor: '#24366F',
        marginTop: 15,
        color: 'white'
    },
    backButton: {
        position: 'absolute',
        top: 22,
        left: 17
    },
});

export default Contacts;

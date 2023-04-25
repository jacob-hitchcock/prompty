import React, { useState } from 'react';
import { StyleSheet,View,Text,ImageBackground,Image,TouchableOpacity,TextInput, ScrollView , Button} from 'react-native';
import Navbar from './Navbar';
import { doc, getDoc, updateDoc, get, query, where, collection, getDocs, setDoc, addDoc } from "firebase/firestore";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { promptyDB } from '../../firebase';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icons from 'react-native-vector-icons/FontAwesome';



// render images
// Fake data for styling
const data =[{"recipient": "ZQnULref6rSM1diYiamSQLMwjLc2", "sender": "RuIDqCW1bbb3APY7oeBfpf3XVIy1", "senderDisplayName": "Travondragon", "senderPhotoURL": "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c", "status": "pending"}, {"recipient": "ZQnULref6rSM1diYiamSQLMwjLc2", "sender": "RuIDqCW1bbb3APY7oeBfpf3XVIy1", "senderDisplayName": "Travondragon", "senderPhotoURL": "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c", "status": "pending"}, {"recipient": "ZQnULref6rSM1diYiamSQLMwjLc2", "sender": "RuIDqCW1bbb3APY7oeBfpf3XVIy1", "senderDisplayName": "Travondragon", "senderPhotoURL": "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c", "status": "pending"}, {"recipient": "ZQnULref6rSM1diYiamSQLMwjLc2", "sender": "RuIDqCW1bbb3APY7oeBfpf3XVIy1", "senderDisplayName": "Travondragon", "senderPhotoURL": "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c", "status": "pending"}, {"recipient": "ZQnULref6rSM1diYiamSQLMwjLc2", "sender": "RuIDqCW1bbb3APY7oeBfpf3XVIy1", "senderDisplayName": "Travondragon", "senderPhotoURL": "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c", "status": "pending"}, {"recipient": "ZQnULref6rSM1diYiamSQLMwjLc2", "sender": "RuIDqCW1bbb3APY7oeBfpf3XVIy1", "senderDisplayName": "Travondragon", "senderPhotoURL": "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c", "status": "pending"}, {"recipient": "ZQnULref6rSM1diYiamSQLMwjLc2", "sender": "RuIDqCW1bbb3APY7oeBfpf3XVIy1", "senderDisplayName": "Travondragon", "senderPhotoURL": "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c", "status": "pending"}, {"recipient": "ZQnULref6rSM1diYiamSQLMwjLc2", "sender": "RuIDqCW1bbb3APY7oeBfpf3XVIy1", "senderDisplayName": "Travondragon", "senderPhotoURL": "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c", "status": "pending"}]

const singleData = {"recipient": "ZQnULref6rSM1diYiamSQLMwjLc2", "sender": "RuIDqCW1bbb3APY7oeBfpf3XVIy1", "senderDisplayName": "Travondragon", "senderPhotoURL": "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c", "status": "pending"}


const Requests = () => {
    // so maybe find requests and initialize it in usestate
    // when accept and reject, remove from view?
    const requestCard = '1'

    const [requests, setRequests] = useState('test');
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
        const userID = getAuth().currentUser.uid;
        //console.log(userID);
        const requestsCollectionRef = collection(promptyDB, "friendRequests", userID, "receivedRequests");
        const receivedRequests = await getDocs(requestsCollectionRef);
        
        receivedRequests.forEach((request) => {
            console.log(request.data());
        });
    }
    getRequests();
    // ChatGpt helped with the header formatting
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 80, backgroundColor: '#f0f0f0', justifyContent: 'center' }}>

        <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={{ flex: 1, fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 25 }}>Requests</Text>

    </View>
        <ScrollView style={styles.scroll} contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}
            >
                <View style={{alignItems: 'center', width: '50%', marginBottom: 10, marginTop: 10}} >
                    <View style={{ overflow: 'hidden', height: 170, width: 170, borderRadius: 15, position: 'relative'}}>
                            <ImageBackground style={styles.card}source={{uri: "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c"} }>

                            <TouchableOpacity >
                            <Icon name={'check'} size={42} color={'green'} style={{position: 'absolute', bottom: -170, left: 100}}/>
                            </TouchableOpacity>
                            <TouchableOpacity > 
                            <Icon
                                name={'frown'} size={42} color={'red'}
                                style={{position: 'absolute', bottom: -170, right: 100}}/>
                            </TouchableOpacity>
                            </ImageBackground>
                        </View>
                        <Text style={{fontSize: 20, fontWeight: 'Bold', textAlign: 'center'}}>@travondragon</Text>
                    </View>

                    <View style={{alignItems: 'center', width: '50%', marginBottom: 10, marginTop: 10}} >
                    <View style={{ overflow: 'hidden', height: 170, width: 170, borderRadius: 15, position: 'relative'}}>
                            <ImageBackground style={styles.card}source={{uri: "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c"} }>

                            <TouchableOpacity >
                            <Icon name={'check'} size={42} color={'green'} style={{position: 'absolute', bottom: -170, left: 100}}/>
                            </TouchableOpacity>
                            <TouchableOpacity > 
                            <Icon
                                name={'frown'} size={42} color={'red'}
                                style={{position: 'absolute', bottom: -170, right: 100}}/>
                            </TouchableOpacity>
                            </ImageBackground>
                        </View>
                        <Text style={{fontSize: 20, fontWeight: 'Bold', textAlign: 'center'}}>@travondragon</Text>
                    </View>

                    <View style={{alignItems: 'center', width: '50%', marginBottom: 10, marginTop: 10}} >
                    <View style={{ overflow: 'hidden', height: 170, width: 170, borderRadius: 15, position: 'relative'}}>
                            <ImageBackground style={styles.card}source={{uri: "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c"} }>

                            <TouchableOpacity >
                            <Icon name={'check'} size={42} color={'green'} style={{position: 'absolute', bottom: -170, left: 100}}/>
                            </TouchableOpacity>
                            <TouchableOpacity > 
                            <Icon
                                name={'frown'} size={42} color={'red'}
                                style={{position: 'absolute', bottom: -170, right: 100}}/>
                            </TouchableOpacity>
                            </ImageBackground>
                        </View>
                        <Text style={{fontSize: 20, fontWeight: 'Bold', textAlign: 'center'}}>@travondragon</Text>
                    </View>

                    <View style={{alignItems: 'center', width: '50%'}} >
                    <View style={{ overflow: 'hidden', height: 170, width: 170, borderRadius: 15, position: 'relative',}}>
                            <ImageBackground style={styles.card}source={{uri: "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c"} }>

                            <TouchableOpacity >
                            <Icon name={'check'} size={42} color={'green'} style={{position: 'absolute', bottom: -170, left: 100}}/>
                            </TouchableOpacity>
                            <TouchableOpacity > 
                            <Icon
                                name={'frown'} size={42} color={'red'}
                                style={{position: 'absolute', bottom: -170, right: 100}}/>
                            </TouchableOpacity>
                            </ImageBackground>
                        </View>
                        <Text style={{fontSize: 20, fontWeight: 'Bold', textAlign: 'center'}}>@travondragon</Text>
                    </View>

                    <View style={{alignItems: 'center', width: '50%', marginBottom: 10, marginTop: 10}} >
                    <View style={{ overflow: 'hidden', height: 170, width: 170, borderRadius: 15, position: 'relative'}}>
                            <ImageBackground style={styles.card}source={{uri: "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c"} }>

                            <TouchableOpacity >
                            <Icon name={'check'} size={42} color={'green'} style={{position: 'absolute', bottom: -170, left: 100}}/>
                            </TouchableOpacity>
                            <TouchableOpacity > 
                            <Icon
                                name={'frown'} size={42} color={'red'}
                                style={{position: 'absolute', bottom: -170, right: 100}}/>
                            </TouchableOpacity>
                            </ImageBackground>
                        </View>
                        <Text style={{fontSize: 20, fontWeight: 'Bold', textAlign: 'center'}}>@travondragon</Text>
                    </View>

                    <View style={{alignItems: 'center', width: '50%', marginBottom: 10, marginTop: 10}} >
                    <View style={{ overflow: 'hidden', height: 170, width: 170, borderRadius: 15, position: 'relative'}}>
                            <ImageBackground style={styles.card}source={{uri: "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c"} }>

                            <TouchableOpacity >
                            <Icon name={'check'} size={42} color={'green'} style={{position: 'absolute', bottom: -170, left: 100}}/>
                            </TouchableOpacity>
                            <TouchableOpacity > 
                            <Icon
                                name={'frown'} size={42} color={'red'}
                                style={{position: 'absolute', bottom: -170, right: 100}}/>
                            </TouchableOpacity>
                            </ImageBackground>
                        </View>
                        <Text style={{fontSize: 20, fontWeight: 'Bold', textAlign: 'center'}}>@travondragon</Text>
                    </View>
            
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
    scroll: {
        marginTop: 10,
       
       
    },
      title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      ImageBackground: {
        flex: 1
      },
      card: {
        width: '100%',
        height: '100%',
        flex: 1
      }
});

export default Requests;

/*
<View style={{flex: 1, alignItems: 'center'}} >
                <View style={{ overflow: 'hidden', height: 170, width: 170, borderRadius: 15, position: 'relative'}}>
                    <ImageBackground style={styles.card}source={{uri: "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c"} }>

                    <TouchableOpacity >
                    <Icon name={'check'} size={42} color={'green'} style={{position: 'absolute', bottom: -170, left: 100}}/>
                    </TouchableOpacity>
                    <TouchableOpacity > 
                    <Icon
                        name={'frown'} size={42} color={'red'}
                        style={{position: 'absolute', bottom: -170, right: 100}}/>
                    </TouchableOpacity>
                    </ImageBackground>
                </View>
                <Text style={{fontSize: 20, fontWeight: 'Bold', textAlign: 'center'}}>@travondragon</Text>
            </View>

            <View style={{flex: 1}} >
                <View style={{ overflow: 'hidden', height: 170, width: 170, borderRadius: 15, position: 'relative'}}>
                    <ImageBackground style={styles.card}source={{uri: "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c"} }>

                    <TouchableOpacity >
                    <Icon name={'check'} size={42} color={'green'} style={{position: 'absolute', bottom: -170, left: 100}}/>
                    </TouchableOpacity>
                    <TouchableOpacity > 
                    <Icon
                        name={'frown'} size={42} color={'red'}
                        style={{position: 'absolute', bottom: -170, right: 100}}/>
                    </TouchableOpacity>
                    </ImageBackground>
                </View>
                <Text style={{fontSize: 20, fontWeight: 'Bold', textAlign: 'center'}}>@travondragon</Text>
            </View>

            <View style={{flex: 1}} >
                <View style={{ overflow: 'hidden', height: 170, width: 170, borderRadius: 15, position: 'relative'}}>
                    <ImageBackground style={styles.card}source={{uri: "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c"} }>

                    <TouchableOpacity >
                    <Icon name={'check'} size={42} color={'green'} style={{position: 'absolute', bottom: -170, left: 100}}/>
                    </TouchableOpacity>
                    <TouchableOpacity > 
                    <Icon
                        name={'frown'} size={42} color={'red'}
                        style={{position: 'absolute', bottom: -170, right: 100}}/>
                    </TouchableOpacity>
                    </ImageBackground>
                </View>
                <Text style={{fontSize: 20, fontWeight: 'Bold', textAlign: 'center'}}>@travondragon</Text>
            </View>
            */

// GOOD

/*
<View style={{overflow: 'hidden', borderRadius: 15, width: '45%', flexDirection: 'row', margin: 9.7}}>
                        <View style={{width: 175, height: 175}}>
                            <ImageBackground style={styles.card} source={{uri: "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c"} }>
                            <TouchableOpacity >
                        <Icon name={'check'} size={42} color={'green'} style={{position: 'absolute', bottom: -170, left: 100}}/>
                        </TouchableOpacity>
                        <TouchableOpacity > 
                        <Icon
                            name={'frown'} size={42} color={'red'}
                            style={{position: 'absolute', bottom: -170, right: 100}}/>
                        </TouchableOpacity>
                            </ImageBackground>
                            
                        </View>
                        <Text style={{fontSize: 20, fontWeight: 'Bold', textAlign: 'center'}}>@travondragon</Text>
                    </View>
        
                <View style={{overflow: 'hidden', borderRadius: 15, width: '45%', flexDirection: 'row', margin: 9.7}}>
                    <View style={{width: 175, height: 175}}>
                        <ImageBackground style={styles.card} source={{uri: "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c"} }>
                        <TouchableOpacity >
                    <Icon name={'check'} size={42} color={'green'} style={{position: 'absolute', bottom: -170, left: 100}}/>
                    </TouchableOpacity>
                    <TouchableOpacity > 
                    <Icon
                        name={'frown'} size={42} color={'red'}
                        style={{position: 'absolute', bottom: -170, right: 100}}/>
                    </TouchableOpacity>
                        </ImageBackground>
                        
                    </View>
                </View>

                <View style={{overflow: 'hidden', borderRadius: 15, width: '45%', flexDirection: 'row', margin: 9.7}}>
                    <View style={{width: 175, height: 175}}>
                        <ImageBackground style={styles.card} source={{uri: "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c"} }>
                        <TouchableOpacity >
                    <Icon name={'check'} size={42} color={'green'} style={{position: 'absolute', bottom: -170, left: 100}}/>
                    </TouchableOpacity>
                    <TouchableOpacity > 
                    <Icon
                        name={'frown'} size={42} color={'red'}
                        style={{position: 'absolute', bottom: -170, right: 100}}/>
                    </TouchableOpacity>
                        </ImageBackground>
                        
                    </View>
                </View>


                <View style={{overflow: 'hidden', borderRadius: 15, width: '45%', flexDirection: 'row', margin: 9.7}}>
                    <View style={{width: 175, height: 175}}>
                        <ImageBackground style={styles.card} source={{uri: "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c"} }>
                        <TouchableOpacity >
                    <Icon name={'check'} size={42} color={'green'} style={{position: 'absolute', bottom: -170, left: 100}}/>
                    </TouchableOpacity>
                    <TouchableOpacity > 
                    <Icon
                        name={'frown'} size={42} color={'red'}
                        style={{position: 'absolute', bottom: -170, right: 100}}/>
                    </TouchableOpacity>
                        </ImageBackground>
                        
                    </View>
                </View>

                <View style={{overflow: 'hidden', borderRadius: 15, width: '45%', flexDirection: 'row', margin: 9.7}}>
                    <View style={{width: 175, height: 175}}>
                        <ImageBackground style={styles.card} source={{uri: "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c"} }>
                        <TouchableOpacity >
                    <Icon name={'check'} size={42} color={'green'} style={{position: 'absolute', bottom: -170, left: 100}}/>
                    </TouchableOpacity>
                    <TouchableOpacity > 
                    <Icon
                        name={'frown'} size={42} color={'red'}
                        style={{position: 'absolute', bottom: -170, right: 100}}/>
                    </TouchableOpacity>
                        </ImageBackground>
                        
                    </View>
                </View>

                <View style={{overflow: 'hidden', borderRadius: 15, width: '45%', flexDirection: 'row', margin: 9.7}}>
                    <View style={{width: 175, height: 175}}>
                        <ImageBackground style={styles.card} source={{uri: "https://firebasestorage.googleapis.com/v0/b/prompty-7a544.appspot.com/o/profilePictures%2FRuIDqCW1bbb3APY7oeBfpf3XVIy1?alt=media&token=c22b3520-4797-4bd9-af6c-cb7a5275587c"} }>
                        <TouchableOpacity >
                    <Icon name={'check'} size={42} color={'green'} style={{position: 'absolute', bottom: -170, left: 100}}/>
                    </TouchableOpacity>
                    <TouchableOpacity > 
                    <Icon
                        name={'frown'} size={42} color={'red'}
                        style={{position: 'absolute', bottom: -170, right: 100}}/>
                    </TouchableOpacity>
                        </ImageBackground>
                        
                    </View>
                </View>
                
                */
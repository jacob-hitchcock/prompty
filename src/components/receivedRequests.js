import React, { useState, useEffect } from 'react';
import { StyleSheet,View,Text,ImageBackground,Image,TouchableOpacity,TextInput, ScrollView , Button} from 'react-native';
import Navbar from './Navbar';
import { doc, getDoc, updateDoc, get, query, where, collection, getDocs, setDoc, addDoc, deleteDoc} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { promptyDB } from '../../firebase';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icons from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Requests = () => {
    const navigation = useNavigation()
    const [requestState, setRequests] = useState([]);
    
    useEffect(async () => {
       
    const data = await getRequests();
    setRequests(data);
    }, []);

    async function getRequests() {
        const userID = getAuth().currentUser.uid;
        const requestsCollectionRef = collection(promptyDB, "friendRequests", userID, "receivedRequests");
        const receivedRequests = await getDocs(requestsCollectionRef);
        
        let requestsArr = [];
        receivedRequests.forEach((request) => {
            requestsArr.push(request.data());
        });
        const requestCards = requestsArr.map((currentReq) => {
            return (
                <View data={currentReq} key={currentReq.id} style={{alignItems: 'center', width: '50%', marginBottom: 5, marginTop: 10}} >
                    <View style={{ overflow: 'hidden', height: 170, width: 170, borderRadius: 15, position: 'relative'}}>
                        <ImageBackground style={styles.card}source={{uri: currentReq.senderPhotoURL} }>
                            <TouchableOpacity activeOpacity={1} onPress={() => handleAccept(currentReq)}>
                                <Icon name={'check'} size={42} color={'green'} style={{position: 'absolute', bottom: -170, left: 100}}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeny(currentReq)}> 
                            <Icon
                                name={'frown'} size={42} color={'red'}
                                style={{position: 'absolute', bottom: -170, right: 100}}/>
                            </TouchableOpacity>
                        </ImageBackground>
                    </View>
                    <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>@{currentReq.senderDisplayName}</Text>
                </View>
            );
        });
        return requestCards;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    const userID = user.uid;

    async function handleAccept(requestData) {
        const currentUser = requestData.recipient;
        const sender = requestData.sender;
        
        // add sender to current's list
        const currentsFriends = doc(promptyDB, 'users', currentUser, 'friends', sender);
        await setDoc(currentsFriends, 
            {friend: sender,
            friendDisplayName: requestData.senderDisplayName,
            friendPhotoURL: requestData.senderPhotoURL});

        // add current to sender's list
        const sendersFriends = doc(promptyDB, 'users', sender, 'friends', currentUser);
        await setDoc(sendersFriends, 
            {friend: currentUser,
            friendDisplayName: user.displayName,
            friendPhotoURL: user.photoURL});

           // make a new chat
            // chat should have an array of participants: [userid1, userid2]
                // order shouldn't matter
            // chat should have a collection of messages
                // message should have:
                    // senderID, recipientID, timestamp, type of message or prompt
                    // text
                    // or instead of text, have it called content and it can be either text or image
        const chats= collection(promptyDB, 'chats');
        await addDoc(chats, {
            participants: [currentUser, sender],
        });

        // deletes request because it was accepted
        const request = doc(promptyDB, 'friendRequests', userID, 'receivedRequests', requestData.sender);
        await deleteDoc(request);

        // refreshes request state
        const usersRequests = collection(promptyDB, 'friendRequests', userID, 'receivedRequests');
        const data = await getRequests();
        setRequests(data);
        console.log("accepted: " + requestData.senderDisplayName) 
    }

    async function handleDeny(requestData) {
        // get to current user's request collection
        // query for the request where sender = request.data sender
        //delete the document
        const usersRequests = collection(promptyDB, 'friendRequests', userID, 'receivedRequests');

        // delete request because it was denied
        const request = doc(promptyDB, 'friendRequests', userID, 'receivedRequests', requestData.sender);
        await deleteDoc(request);
        // refreshes request state
        const data = await getRequests();
        setRequests(data);
        console.log("denied: " + requestData.senderDisplayName)
    }
    // ChatGpt helped with the header formatting
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 80, backgroundColor: '#f0f0f0', justifyContent: 'center' }}>
                <TouchableOpacity style={{ paddingHorizontal: 6 }} onPress={() => navigation.goBack()}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={{ flex: 1, fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 25 }}>Requests</Text>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {requestState}
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
        marginBottom: 100
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

// GOOD USE THIS FORMAT BELOW:

/* <View style={{alignItems: 'center', width: '50%', marginBottom: 5, marginTop: 10}} >
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
                        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>@travondragon</Text>
                    </View>

                    <View style={{alignItems: 'center', width: '50%', marginBottom: 5, marginTop: 10}} >
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
                        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>@travondragon</Text>
                    </View>

                    <View style={{alignItems: 'center', width: '50%', marginBottom: 5, marginTop: 10}} >
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
                        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>@travondragon</Text>
                    </View>

                    <View style={{alignItems: 'center', width: '50%', marginBottom: 5, marginTop: 10}} >
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
                        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>@travondragon</Text>
                    </View>


                    <View style={{alignItems: 'center', width: '50%', marginBottom: 5, marginTop: 10}} >
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
                        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>@travondragon</Text>
                    </View>
           

                    <View style={{alignItems: 'center', width: '50%', marginBottom: 5, marginTop: 10}} >
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
                        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>@travondragon</Text>
                    </View>


                    <View style={{alignItems: 'center', width: '50%', marginBottom: 5, marginTop: 10}} >
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
                        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>@travondragon</Text>
                    </View>
        
                    <View style={{alignItems: 'center', width: '50%', marginBottom: 5, marginTop: 10}} >
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
                        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>@travondragon</Text>
                    </View>

                    <View style={{alignItems: 'center', width: '50%', marginBottom: 5, marginTop: 10}} >
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
                        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>@travondragon</Text>
                    </View>


                    <View style={{alignItems: 'center', width: '50%', marginBottom: 5, marginTop: 10}} >
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
                        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>@travondragon</Text>
                    </View>

                    <View style={{alignItems: 'center', width: '50%', marginBottom: 5, marginTop: 10}} >
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
                        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>@travondragon</Text>
                    </View>

                    <View style={{alignItems: 'center', width: '50%', marginBottom: 5, marginTop: 10}} >
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
                        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'white'}}>@travondragon</Text>
                    </View>
                    */


    //console.log(userID);

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
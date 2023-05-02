import React,{ useState,useEffect } from 'react';
import { StyleSheet,View,Text,ImageBackground,Image,TouchableOpacity,TextInput,ScrollView,Button } from 'react-native';
import Navbar from './Navbar';
import { doc,getDoc,updateDoc,get,query,where,collection,getDocs,setDoc,addDoc,deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { promptyDB } from '../../firebase';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icons from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Requests = () => {
    const navigation = useNavigation()
    const [requestState,setRequests] = useState([]);

    useEffect(async () => {

        const data = await getRequests();
        setRequests(data);
    },[]);

    async function getRequests() {
        const userID = getAuth().currentUser.uid;
        const requestsCollectionRef = collection(promptyDB,"friendRequests",userID,"receivedRequests");
        const receivedRequests = await getDocs(requestsCollectionRef);

        let requestsArr = [];
        receivedRequests.forEach((request) => {
            requestsArr.push(request.data());
        });
        const requestCards = requestsArr.map((currentReq) => {
            return (
                <View data={currentReq} key={currentReq.id} style={{ width: '100%',marginBottom: 5,marginTop: 15,flexDirection: 'row',alignItems: 'center' }} >
                    <View style={{ position: 'relative',marginLeft: 15 }}>
                        <ImageBackground style={styles.card} source={{ uri: currentReq.senderPhotoURL }}>
                        </ImageBackground>
                        <Text style={{ marginTop: 5,marginLeft: 15,fontSize: 20,fontWeight: 'bold',color: '#23356F' }}>@{currentReq.senderDisplayName}</Text>
                    </View>
                    <View style={{ marginTop: -30,flex: 1,alignItems: 'center' }}>
                        <TouchableOpacity style={{ backgroundColor: '#23356F',padding: 10,borderRadius: 5,width: '80%',height: 57,justifyContent: 'center' }} onPress={() => handleAccept(currentReq)}>
                            <Text style={{ color: '#fff',textAlign: 'center',fontSize: 18 }}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: '#23356F',padding: 10,borderRadius: 5,marginTop: 26,width: '80%',height: 57,justifyContent: 'center' }} onPress={() => handleDeny(currentReq)}>
                            <Text style={{ color: '#fff',textAlign: 'center',fontSize: 18 }}>
                                Decline
                        </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 20,fontWeight: 'bold',textAlign: 'center',color: '#24366F' }}>@{currentReq.senderDisplayName}</Text>
                </View>
            );
        });
        if(requestsArr.length < 1) {
            return (
                <View style={{ flex: 1,width: '100%',alignItems: 'center',marginTop: 50 }}>
                    <Text style={{ fontSize: 20,fontWeight: 'bold',color: '#23356F' }}>No Current Requests</Text>
                </View>
            )
        } else {
            return requestCards;
        }
    }

    const auth = getAuth();
    const user = auth.currentUser;
    const userID = user.uid;

    async function handleAccept(requestData) {
        const currentUser = requestData.recipient;
        const sender = requestData.sender;

        // add sender to current's list
        const currentsFriends = doc(promptyDB,'users',currentUser,'friends',sender);
        await setDoc(currentsFriends,
            {
                friend: sender,
                friendDisplayName: requestData.senderDisplayName,
                friendPhotoURL: requestData.senderPhotoURL
            });

        // add current to sender's list
        const sendersFriends = doc(promptyDB,'users',sender,'friends',currentUser);
        await setDoc(sendersFriends,
            {
                friend: currentUser,
                friendDisplayName: user.displayName,
                friendPhotoURL: user.photoURL
            });

        // make a new chat
        // chat should have an array of participants: [userid1, userid2]
        // order shouldn't matter
        // chat should have a collection of messages
        // message should have:
        // senderID, recipientID, timestamp, type of message or prompt
        // text
        // or instead of text, have it called content and it can be either text or image
        const chats = collection(promptyDB,'chats');
        await addDoc(chats,{
            participant1: currentUser,
            participant2: sender,
            prompts: []
        });

        // deletes request because it was accepted
        const request = doc(promptyDB,'friendRequests',userID,'receivedRequests',requestData.sender);
        await deleteDoc(request);

        // refreshes request state
        const usersRequests = collection(promptyDB,'friendRequests',userID,'receivedRequests');
        const data = await getRequests();
        setRequests(data);
        console.log("accepted: " + requestData.senderDisplayName)
    }

    async function handleDeny(requestData) {
        // get to current user's request collection
        // query for the request where sender = request.data sender
        //delete the document
        const usersRequests = collection(promptyDB,'friendRequests',userID,'receivedRequests');

        // delete request because it was denied
        const request = doc(promptyDB,'friendRequests',userID,'receivedRequests',requestData.sender);
        await deleteDoc(request);
        // refreshes request state
        const data = await getRequests();
        setRequests(data);
        console.log("denied: " + requestData.senderDisplayName)
    }
    // ChatGpt helped with the header formatting
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <FontAwesome name="chevron-left" size={30} color='#23356F' />
                </TouchableOpacity>

                <ScrollView style={styles.scroll} contentContainerStyle={{ flexDirection: 'row',flexWrap: 'wrap' }}>
                    {requestState}
                </ScrollView>
            </ImageBackground>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6D7EB6',
    },
    background: {
        flex: 1,
        width: '100%',
        marginTop: 50,
        borderRadius: 40,
        overflow: 'hidden'
    },
    scroll: {
        marginTop: 10,
        marginBottom: 100
    },
    ImageBackground: {
        flex: 1
    },
    card: {
        width: 180,
        height: 180,
        flex: 1,
        borderWidth: 5,
        borderColor: '#E2E6F3',
        borderRadius: 40,
        overflow: 'hidden'
    },
    backButton: {
        position: 'relative',
        top: 22,
        left: 17,
        marginBottom: 5
    },
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
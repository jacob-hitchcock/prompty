import React,{ useState } from 'react';
import { StyleSheet,View,Text,ImageBackground,Image,TouchableOpacity,TextInput } from 'react-native';
import Navbar from './Navbar';
import { getAuth, updateProfile } from 'firebase/auth';
import { authentication, promptyDB, promptyStorage } from "../../firebase";
import { doc, getDoc, updateDoc, get } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
//import storage from '@react-native-firebase/storage';


const Account = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    let displayName;
    if (user) {
        displayName = user.displayName;
    }
   
    const [image, setImage] = useState(null);

    async function pickImage() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync().catch((error) => {
            console.log("Error: " + error);
           });
        if (status !== 'granted') {
          alert('Permission to access media library is required!');
          return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
            const blob = await res.blob();
           // create storage reference
           const profilePictureRef = ref(promptyStorage, `profilePictures/${user.uid}`);

           uploadBytes(profilePictureRef, blob).then((snapshot) => {
            //console.log('uploaded image');
           }).catch((error) => {
            console.log("Error: " + error);
           });
           getDownloadURL(profilePictureRef).then((url) => {
            
            updateProfile(user, {
                photoURL: url
            }).then(() => {
                //console.log("photo updated");
            }).catch((error) => {
                console.error("Error updating profile url: " + error);
            });
           
           }).catch((error) => {
            console.log("error: " + error);
           })
        const userDoc = doc(promptyDB, "users", user.uid);
        await updateDoc(userDoc, {
            profilePictureUrl: user.photoURL
        })
        setImage(user.photoURL);
        }
    }
  
    const handleNameSubmit = () => {
        setUsername(tempUsername);
        setIsEditingName(false);
    };

    let imgSrc;
    if (user) {
        console.log(user.photoURL);
        imgSrc = user.photoURL;
    } else {
        imgSrc = '../../assets/placeholder.png'
    }
    
   //  <Image source={require('../../assets/placeholder.png')} style={styles.profilePicture} />
    return (
        <View style={styles.container}>
            <View style={styles.accountContainer}>
                <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
                    <View style={styles.infoContainer}>

                    <TouchableOpacity onPress={pickImage}>
                    <Image source={{uri: user.photoURL}} style={styles.profilePicture} />
                    </TouchableOpacity>
                        

                        <Text style={styles.info}>{"@" + displayName}</Text>
                    </View>
                </ImageBackground>
            </View>
            <Navbar />
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
        height: '100%',
        resizeMode: 'cover',
    },
    accountContainer: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '95%',
        borderWidth: 1,
        borderColor: '#6D7EB6',
        borderRadius: 50,
        overflow: 'hidden',
    },
    infoContainer: {
        flex: 1,
        marginTop: 150,
        alignItems: 'center',
    },
    info: {
        fontSize: 20,
        color: '#27292E',
        marginBottom: 5,
    },
    profilePicture: {
        height: 265,
        width: 265,
        borderWidth: 15,
        borderColor: '#E2E6F3',
        borderRadius: 40,
        marginBottom: 20,
    },
    editableText: {
        fontSize: 20,
        color: '#27292E',
        marginBottom: 5,
        width: '80%',
        textAlign: 'center',
    },
    edit: {
        color: '#23356F',
        textDecorationLine: 'underline',
    }
});

export default Account;

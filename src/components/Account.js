import React,{ useState } from 'react';
import { StyleSheet,View,Text,ImageBackground,Image,TouchableOpacity,TextInput } from 'react-native';
import Navbar from './Navbar';
import { getAuth, updateProfile } from 'firebase/auth';
import { authentication, promptyDB, promptyStorage } from "../../firebase";
import { doc, getDoc, updateDoc, get } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';


const Account = () => {
   
    // May want to set a condition for whether user has a profile
    // pic or not
    // if not, set the image to the blank image
    // if do, initialize it to the profile pic they have 
    // in the returned component, have the image's source be the variable for image
    const [image, setImage] = useState(null);
    const auth = getAuth();
    const user = auth.currentUser;
    let displayName;
    if (user) {
        displayName = user.displayName;
    }
   
    
    // ChatGPT to help with getting image from camera roll
    async function pickImage() {
        // Asking for permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync().catch((error) => {
            console.log("Error: " + error);
           });
        if (status !== 'granted') {
          alert('Permission to access media library is required!');
          return;
        }
        // Opens camera roll library, allows user to select image
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          }).catch((error) => {
            console.log("Error: " + error);
           });
        
           // If they didn't cancel (if they chose a picture)
          if (!result.canceled) {

            // Take the uri of selected image 
            // (accessed through result.asset's value, which is an array containing a single object, which has a uri attribute)
            const res = await fetch(result.assets[0].uri).catch((error) => {
                console.log("Error: " + error);
            });
            // make a blob of that (file)
            const blob = await res.blob();

           // create storage reference (this is where you WANT to store the image)
           /* I decided to store it inside a folder called 'profilePictures' and 
           name each image after the unique userID of that person */
           const profilePictureRef = ref(promptyStorage, `profilePictures/${user.uid}`);

           uploadBytes(profilePictureRef, blob).then((snapshot) => {
            //console.log('uploaded image');
           }).catch((error) => {
            console.log("Error: " + error);
           });
           // Want to save the URL of the newly uploaded image
           getDownloadURL(profilePictureRef).then((url) => {
                // saves it in user's photoURL attribute
                updateProfile(user, {
                    photoURL: url
                }).then(() => {
                    //console.log("photo updated");
                }).catch((error) => {
                    console.error("Error updating profile url: " + error);
                });
           }).catch((error) => {
            console.log("error: " + error);
           });

        /* Save it in document representing user, to render their profile 
           picture for other users when they search and view their profile */
        const userDoc = doc(promptyDB, "users", user.uid);
        await updateDoc(userDoc, {
            profilePictureUrl: user.photoURL
        })
        // Re-renders photo component on account page
        setImage(user.photoURL);
        }
    }
  
    let imgSrc;
    if (user) {
        //(user.photoURL);
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
                        

                        <Text style={styles.info}>{"@" + user.displayName}</Text>
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

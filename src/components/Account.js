import React,{ useState } from 'react';
import { StyleSheet,View,Text,ImageBackground,Image,TouchableOpacity,TextInput } from 'react-native';
import { getAuth,updateProfile } from 'firebase/auth';
import { authentication,promptyDB,promptyStorage } from "../../firebase";
import { doc,getDoc,updateDoc,get,addDoc,collection,getDocs } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL,ref,uploadBytes } from 'firebase/storage';
import { useNavigation,useRoute } from '@react-navigation/native';

const Account = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const auth = getAuth();
    const user = auth.currentUser;
    if(user) {
        displayName = user.displayName;
    }

    const [image,setImage] = useState(user.photoURL);
    /*async function getPrompts() {
        const promptSnapshot = await getDocs(collection(promptyDB, "prompts"));
   
    promptSnapshot.forEach((prompt) => {
        //prompt.data()
        //console.log(prompt.data().prompt);
    })
    console.log(promptSnapshot.size)
    }
    getPrompts(); */


    /* prompts.forEach(async (currentPrompt)=> {
          await addDoc(collection(promptyDB, "prompts"), {
              prompt: currentPrompt
          })
      }); */

    function handleRequests() {
        navigation.navigate('Requests');
    }

    function handleContact() {
        navigation.navigate('Contacts')
    }

    // ChatGPT to help with getting image from camera roll
    async function pickImage() {
        // Asking for permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync().catch((error) => {
            console.log("Error: " + error);
        });
        if(status !== 'granted') {
            alert('Permission to access media library is required!');
            return;
        }
        // Opens camera roll library, allows user to select image
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1,1],
            quality: 1,
        }).catch((error) => {
            console.log("Error: " + error);
        });

        // If they didn't cancel (if they chose a picture)
        if(!result.canceled) {

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
            const profilePictureCollectionRef = ref(promptyStorage,"profilePictures");
            const profilePictureRef = ref(profilePictureCollectionRef,user.uid);

            uploadBytes(profilePictureRef,blob).then((snapshot) => {
                //console.log('uploaded image');
            }).catch((error) => {
                console.log("Error: " + error);
            });
            // Want to save the URL of the newly uploaded image
            getDownloadURL(profilePictureRef).then((url) => {
                // saves it in user's photoURL attribute
                updateProfile(user,{
                    photoURL: url
                }).then(() => {
                    //console.log("photo updated");
                }).catch((error) => {
                    console.error("Error updating profile url: " + error);
                });
            }).catch((error) => {
                console.log("error: " + error);
            });
            /* 
            const mediaCollectionRef = ref(promptyStorage, "chatMedia");
                        const mediaRef = ref(mediaCollectionRef, `${newMessage._id}`);
            
            */
            /* Save it in document representing user, to render their profile 
               picture for other users when they search and view their profile */
            const userDoc = doc(promptyDB,"users",user.uid);
            await updateDoc(userDoc,{
                profilePictureUrl: user.photoURL
            })
            // Re-renders photo component on account page
            //console.log("user.photoURL: ", user.photoURL);
            setImage(user.photoURL);
        }
    }

    let imgSrc;
    if(user) {
        //(user.photoURL);
        imgSrc = user.photoURL;
    } else {
        imgSrc = '../../assets/placeholder.png'
    }

    //  <Image source={require('../../assets/placeholder.png')} style={styles.profilePicture} />
    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <TouchableOpacity onPress={pickImage}>
                    <Image source={{ uri: image }} style={styles.profilePicture} />
                </TouchableOpacity>
                <Text style={styles.info}>{"@" + user.displayName}</Text>
            </View>
            <View style={styles.rightContainer}>
                <View style={styles.separate} />
                <TouchableOpacity style={styles.option} onPress={handleContact}>
                    <Text style={styles.optionFont}>Add Contact</Text>
                </TouchableOpacity>
                <View style={styles.separate} />
                <TouchableOpacity style={styles.option} onPress={handleRequests}>
                    <Text style={styles.optionFont}>Friend Requests</Text>
                </TouchableOpacity>
                <View style={styles.separate} />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 20
    },
    leftContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    rightContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20
    },
    info: {
        fontSize: 20,
        color: '#24366F',
        marginBottom: 30,
        fontWeight: 'bold'
    },
    profilePicture: {
        height: 150,
        width: 150,
        borderWidth: 10,
        borderColor: '#E2E6F3',
        borderRadius: 40,
        marginBottom: 10,
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
    },
    separate: {
        width: '85%',
        height: 2,
        backgroundColor: '#CCCCCC'
    },
    option: {
        paddingTop: 25,
        paddingBottom: 25,
    },
    optionFont: {
        fontFamily: 'Arial',
        fontSize: 20,
        color: '#27292E99',
        fontWeight: 'bold'
    }
});

export default Account;

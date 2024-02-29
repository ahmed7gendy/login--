import React, { useState, useEffect } from 'react';
import { View, Image, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useFirebase } from './FirebaseContext';

const AddProductScreen = ({ navigation }) => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [image, setImage] = useState(null);

  const { storage, user } = useFirebase();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error.message);
    }
  };

  const handleAddProduct = async () => {
    try {
      if (!user) {
        alert('User not authenticated.');
        return;
      }

      if (!image) {
        alert('Please pick an image for the product.');
        return;
      }

      const storageRef = ref(storage, `images/${user.uid}/${Date.now()}.jpg`);

      // Fetch the image as a Blob
      const response = await fetch(image);
      const blob = await response.blob();

      // Upload the Blob to Firebase Storage
      const snapshot = await uploadBytes(storageRef, blob);

      if (snapshot) {
        // Get download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        // You can use the downloadURL to add the product to Firebase Realtime Database
        console.log('Product Image URL:', downloadURL);

        // After adding the product, you can navigate to another screen or the home page
        navigation.goBack();
      } else {
        console.error('Snapshot is undefined');
      }
    } catch (error) {
      console.error('Error adding product:', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add Product</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
        <Text style={styles.imagePickerText}>Pick an image from gallery</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} style={styles.imagePreview} resizeMode="contain" />
      )}

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={productName}
        onChangeText={(text) => setProductName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Price"
        value={productPrice}
        onChangeText={(text) => setProductPrice(text)}
        keyboardType="numeric"
      />
      <Button title="Add Product" onPress={handleAddProduct} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  imagePreview: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  imagePickerButton: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  imagePickerText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default AddProductScreen;

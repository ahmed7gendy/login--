// RegistrationScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { app, auth } from './firebase';

const RegistrationScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegistration = async () => {
    try {
      // إنشاء مستخدم باستخدام البريد الإلكتروني وكلمة المرور
      await createUserWithEmailAndPassword(auth, email, password);

      // حفظ بيانات المستخدم في قاعدة البيانات
      const user = auth.currentUser;
      const database = getDatabase(); // Get a reference to the database
      const userRef = ref(database, 'users/' + user.uid);
      await set(userRef, {
        fullName: fullName,
        email: user.email,
        phoneNumber: phoneNumber,
        uid: user.uid,
      });

      navigation.replace('Login');
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  const loginWithGoogle = async () => {
    // ... existing code ...
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Registration Screen</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={loginWithGoogle} style={styles.googleButton}>
        <Text style={styles.googleButtonText}>Register with Google</Text>
        <View style={styles.googleImageContainer}>
          <Image source={require('./assets/Rectangle.png')} style={styles.googleImage} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegistration}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333333',
  },
  input: {
    height: 50,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  registerButton: {
    width: 343,
    height: 60,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4285F4',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  googleButton: {
    flexDirection: 'row',
    width: 343,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  googleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    flex: 1,
  },
  googleImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
    marginLeft: 10,
  },
  googleImage: {
    flex: 1,
    width: null,
    height: null,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default RegistrationScreen;

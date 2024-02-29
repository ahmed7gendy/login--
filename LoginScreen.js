// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { signInWithEmailAndPassword, GoogleAuthProvider } from 'firebase/auth';
import { auth, database, ref, set } from './firebase';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      const user = auth.currentUser;

      const userRef = ref(database, 'users/' + user.uid);
      await set(userRef, {
        email: user.email,
        displayName: user.displayName,
        uid: user.uid,
      });

      console.log('User data from authentication:', user);

      navigation.replace('Index');
    } catch (error) {
      console.error(error.message);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;

      const userRef = ref(database, 'users/' + user.uid);
      await set(userRef, {
        email: user.email,
        displayName: user.displayName,
        uid: user.uid,
      });

      console.log(user);
      navigation.replace('Index');
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Customers Login Form</Text>

      {/* Updated styles for input elements */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
{/* Google Login button with image */}
      <TouchableOpacity onPress={loginWithGoogle} style={styles.googleButton}>
        <Text style={styles.googleButtonText}>Login with Google</Text>
        <View style={styles.googleImageContainer}>
          <Image source={require('./assets/Rectangle.png')} style={styles.googleImage} />
        </View>
      </TouchableOpacity>
      
      {/* Customized button for login */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
        <Text style={styles.registrationLink}>If you don't have an account, register here</Text>
      </TouchableOpacity>
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
    borderRadius: 8, // Added borderRadius
    backgroundColor: '#f2f2f2', // Added backgroundColor
  },
  loginButton: {
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
  registrationLink: {
    marginTop: 10,
    color: 'blue',
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
});

export default LoginScreen;

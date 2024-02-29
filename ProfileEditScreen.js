import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ref, get, set } from 'firebase/database';
import { useFirebase } from './FirebaseContext';
import { updatePassword } from 'firebase/auth';
import { database, auth } from './firebase';

const ProfileEditScreen = ({ navigation }) => {
  const { user } = useFirebase();
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        if (userData) {
          setDisplayName(userData.displayName || '');
          setPhoneNumber(userData.phoneNumber || '');
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const userRef = ref(database, `users/${user.uid}`);

      // إزالة المرجع الذاتي لتجنب الدورة في البيانات
      const userData = {
        displayName: displayName,
        phoneNumber: phoneNumber,
      };

      await set(userRef, userData);

      if (password) {
        await updatePassword(auth.currentUser, password);
      }

      navigation.goBack();
    } catch (error) {
      console.error(error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {/* يمكنك إضافة رمز التحميل هنا */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
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
        placeholder="New Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
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
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  saveButton: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileEditScreen;

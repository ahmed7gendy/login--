import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const navigateToLogin = (userType) => {
    if (userType === 'employee') {
      navigation.navigate('EmployeeLogin');
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home Screen</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToLogin('employee')}
      >
        <Text style={styles.buttonText}>Employee Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToLogin('customer')}
      >
        <Text style={styles.buttonText}>Customer Login</Text>
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
  button: {
    width: 200,
    height: 60,
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4285F4',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default HomeScreen;

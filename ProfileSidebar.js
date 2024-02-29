// ProfileSidebar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfileSidebar = ({ onEditProfilePress, onSignOutPress, onAddProductPress }) => {
  const navigation = useNavigation();

  const handleAddProductPress = () => {
    // تنفيذ التنقل إلى شاشة AddProductScreen
    navigation.navigate('AddProduct');
  };

  return (
    <View style={styles.sidebarContainer}>
      <TouchableOpacity style={styles.sidebarItem} onPress={onEditProfilePress}>
        <Text style={styles.sidebarText}>تعديل الملف الشخصي</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={handleAddProductPress}>
        <Text style={styles.sidebarText}>إضافة خدمة</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={onSignOutPress}>
        <Text style={styles.sidebarText}>تسجيل الخروج</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  sidebarItem: {
    marginBottom: 20,
  },
  sidebarText: {
    fontSize: 18,
    color: '#333333',
  },
});

export default ProfileSidebar;

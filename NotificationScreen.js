import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FlashMessage, { showMessage } from 'react-native-flash-message';

const NotificationScreen = ({ notifications }) => {
  const showNotification = (message) => {
    showMessage({
      message: message,
      type: 'info',
    });
  };

  return (
    <View style={styles.container}>
      <Text>Notification Screen</Text>
      {notifications.map((notification, index) => (
        <View key={index} style={styles.notificationItem}>
          <Text
            style={styles.notificationText}
            onPress={() => showNotification(notification.message)}
          >
            {notification.message}
          </Text>
        </View>
      ))}

      <FlashMessage position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  notificationItem: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
  },
  notificationText: {
    fontSize: 16,
    color: '#333333',
    textDecorationLine: 'underline',
  },
});

export default NotificationScreen;

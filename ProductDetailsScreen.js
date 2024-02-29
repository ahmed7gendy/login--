import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getDatabase, ref, push, set, get } from 'firebase/database';

const ProductDetailsScreen = ({ route }) => {
  const { product } = route.params;
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const userId = 's6T40rMO82Pcwc5sMAtSAFWweAf1'; // استبدل بمعرف المستخدم الفعلي
    const database = getDatabase();
    const userRef = ref(database, `users/${userId}`);

    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserDetails(userData);
        } else {
          console.log('لم يتم العثور على معلومات المستخدم');
        }
      })
      .catch((error) => {
        console.error('Error fetching user details:', error.message);
      });
  }, []);

  const handleOrderPress = async () => {
    const database = getDatabase();
    const ordersRef = ref(database, 'orders');
    const newOrderRef = push(ordersRef);

    try {
      if (newOrderRef) {
        const productId = newOrderRef.key;

        await set(ref(database, `orders/${productId}`), {
          productId: productId,
          productName: product.name,
          productPrice: product.price,
          quantity: product.quantity,
          timestamp: new Date().toISOString(),
          name: userDetails?.displayName || '',
          phoneNumber: userDetails?.phoneNumber || '',
        });

        console.log('تم إرسال طلب الشراء بنجاح!');
        setOrderPlaced(true);
      } else {
        setError('فشل في إنشاء مفتاح للطلب');
      }
    } catch (error) {
      setError('حدث خطأ أثناء معالجة الطلب');
      console.error('Error adding order:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>{`السعر: ${product.price} جنيه`}</Text>

      <TouchableOpacity
        style={styles.orderButton}
        onPress={handleOrderPress}
        disabled={orderPlaced}
      >
        <Text style={styles.orderButtonText}>طلب شراء</Text>
      </TouchableOpacity>

      {orderPlaced && (
        <Text style={styles.orderPlacedText}>تم استلام طلبك بنجاح!</Text>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '80%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    color: 'green',
    marginBottom: 8,
  },
  orderButton: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  orderButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  orderPlacedText: {
    marginTop: 16,
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 16,
  },
});

export default ProductDetailsScreen;

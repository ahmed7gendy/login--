import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ref, onValue, get } from 'firebase/database';
import { useFirebase } from './FirebaseContext';
import { useNavigation } from '@react-navigation/native';
import { getDatabase } from 'firebase/database';
import ProfileSidebar from './ProfileSidebar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProductListScreenComponent = ({ products, handlePrevPage, handleNextPage, handleProductPress }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    setTotalPages(Math.ceil(products.length / itemsPerPage));
  }, [products]);

  const handlePrevPageLocal = () => {
    const prevPage = Math.max(pageNumber - 1, 1);
    handlePrevPage(prevPage);
    setPageNumber(prevPage);
  };

  const handleNextPageLocal = () => {
    const nextPage = Math.min(pageNumber + 1, totalPages);
    handleNextPage(nextPage);
    setPageNumber(nextPage);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productContainer}
      onPress={() => handleProductPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        numColumns={2}
        columnWrapperStyle={styles.productList}
      />

      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={styles.paginationButton}
          onPress={handlePrevPageLocal}
          disabled={pageNumber === 1}
        >
          <Text style={styles.buttonText}>{`<`}</Text>
        </TouchableOpacity>
        <Text style={styles.paginationText}>{`الصفحة ${pageNumber} من ${totalPages}`}</Text>
        <TouchableOpacity
          style={styles.paginationButton}
          onPress={handleNextPageLocal}
          disabled={pageNumber === totalPages}
        >
          <Text style={styles.buttonText}>{`>`}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Navbar = ({ onSidebarPress, onNotificationsPress }) => (
  <View style={styles.navbarContainer}>
    <TouchableOpacity style={styles.navbarIcon} onPress={onSidebarPress}>
      <MaterialCommunityIcons name="menu" size={30} color="#ffffff" />
    </TouchableOpacity>
    <Text style={styles.navbarTitle}>قائمة المنتجات</Text>
    {onNotificationsPress && (
      <TouchableOpacity style={styles.navbarIcon} onPress={onNotificationsPress}>
        <MaterialCommunityIcons name="bell" size={30} color="#ffffff" />
      </TouchableOpacity>
    )}
  </View>
);

const ProductListScreen = () => {
  const navigation = useNavigation();
  const { signOut, user } = useFirebase();
  const [products, setProducts] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const itemsPerPage = 20;

  useEffect(() => {
    const productsRef = ref(getDatabase(), 'products');

    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const productList = data ? Object.values(data) : [];
      setProducts(productList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handlePrevPage = (prevPage) => {
    const startIndex = (prevPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const prevPageProducts = products.slice(startIndex, endIndex);
    setProducts(prevPageProducts);
  };

  const handleNextPage = (nextPage) => {
    const startIndex = (nextPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const nextPageProducts = products.slice(startIndex, endIndex);
    setProducts(nextPageProducts);
  };

  const handleEditProfile = () => {
    navigation.navigate('ProfileEdit');
  };

  const handleSignOut = async () => {
    await signOut();
    setProducts([]);
    navigation.navigate('Login');
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { product });
  };

  return (
    <View style={styles.container}>
      <Navbar
        onSidebarPress={() => setShowSidebar(!showSidebar)}
        onNotificationsPress={user ? () => console.log('Notifications Pressed') : undefined}
      />

      {showSidebar && user && (
        <ProfileSidebar
          onEditProfilePress={handleEditProfile}
          onSignOutPress={handleSignOut}
        />
      )}

      <View style={styles.mainContainer}>
        <ProductListScreenComponent
          products={products}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
          handleProductPress={handleProductPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#ffffff',
    paddingTop: 40,
  },
  mainContainer: {
    flex: 1,
  },
  productList: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  productContainer: {
    width: '50%',
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 14,
    color: 'green',
    marginTop: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  paginationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationText: {
    fontSize: 16,
  },
  navbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
  },
  navbarIcon: {
    padding: 5,
  },
  navbarTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sidebarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sidebarButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#4285F4',
  },
});

export default ProductListScreen;

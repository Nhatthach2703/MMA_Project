import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CandleList from "../components/CandleList";
import DetailCandle from "../components/DetailCandle";
import CartScreen from "../screens/CartScreen";
import Login from "../components/Login";
import HomeScreen from "../components/HomePage";
import { CartProvider } from "../context/CartContext";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import CheckoutScreen from "../screens/CheckoutScreen";
import { PaymentConfirmationScreen } from "../screens/PaymentConfirmationScreen";

// Định nghĩa kiểu cho dữ liệu người dùng
interface UserData {
  name: string;
  email: string;
  phone: string;
  dob: string;
  avatar?: string;
}

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  DetailCandle: undefined;
  CartScreen: undefined;
  CheckoutScreen: undefined;
  PaymentConfirmation: undefined;
};

type DrawerParamList = {
  Home: undefined;
  CandleList: undefined;
  DetailCandle: undefined;
  CartScreen: undefined;
  CheckoutScreen: undefined;
  PaymentConfirmation: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

// Custom Drawer Content
const CustomDrawerContent = (props: any) => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData: UserData = JSON.parse(userData);
          setUserName(parsedData.name);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={drawerStyles.header}>
        <Text style={drawerStyles.userName}>
          {userName ? `Xin chào, ${userName}` : 'Đang tải...'}
        </Text>
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity style={drawerStyles.logoutButton} onPress={handleLogout}>
        <Text style={drawerStyles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

// Drawer Navigator
const MainDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: "Trang chủ" }} />
      <Drawer.Screen name="CandleList" component={CandleList} options={{ title: "Danh sách nến" }} />
      <Drawer.Screen name="CartScreen" component={CartScreen} options={{ title: "Giỏ hàng" }} />
      <Drawer.Screen name="CheckoutScreen" component={CheckoutScreen} options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="PaymentConfirmation" component={PaymentConfirmationScreen} options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="DetailCandle" component={DetailCandle} options={{ drawerItemStyle: { display: 'none' } }} />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        console.log('User data from AsyncStorage:', userData);
        setIsLoggedIn(!!userData);
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLoginSuccess = (data: UserData) => {
    console.log('Login success with data:', data);
    setIsLoggedIn(true);
  };

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={isLoggedIn ? "Main" : "Login"}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Login">
              {(props) => <Login {...props} onLoginSuccess={handleLoginSuccess} />}
            </Stack.Screen>
            <Stack.Screen name="Main" component={MainDrawer} />
            <Stack.Screen name="DetailCandle" component={DetailCandle} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
            <Stack.Screen name="PaymentConfirmation" component={PaymentConfirmationScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </GestureHandlerRootView>
  );
};

// Styles cho Drawer
const drawerStyles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    padding: 15, // Sửa lỗi cú pháp: xóa "x``"
    backgroundColor: '#ff9800',
    margin: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppNavigator;
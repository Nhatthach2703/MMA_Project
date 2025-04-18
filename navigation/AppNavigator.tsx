import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CandleList from "../components/CandleList";
import DetailCandle from "../components/DetailCandle";
import CartScreen from "../screens/CartScreen";
import Login from "../components/Login";
import Register from "../components/Register";
import ProfileScreen from "../components/ProfileScreen";
import HomeScreen from "../components/HomePage";
import { CartProvider, useCart } from "../context/CartContext";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import CheckoutScreen from "../screens/CheckoutScreen";
import { PaymentConfirmationScreen } from "../screens/PaymentConfirmationScreen";
import { Ionicons } from "@expo/vector-icons";
import MapScreen from "../screens/MapScreen";
import { ChatScreen } from "../screens/ChatScreen";
import ForgotPassword from "../components/ForgotPassword";

interface UserData {
  name: string;
  email: string;
  phone: string;
  dob: string;
  adress?: string;
  avatar?: string;
}

type RootStackParamList = {
  Login: { email?: string };
  Main: undefined;
  DetailCandle: undefined;
  CartScreen: undefined;
  CheckoutScreen: undefined;
  PaymentConfirmation: undefined;
  Profile: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

type DrawerParamList = {
  Home: undefined;
  CandleList: undefined;
  DetailCandle: undefined;
  CartScreen: undefined;
  CheckoutScreen: undefined;
  PaymentConfirmation: undefined;
  Profile: undefined;
  MapScreen: undefined; // Added MapScreen to the DrawerParamList
  ChatScreen: undefined; // Added ChatScreen to the DrawerParamList
};

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

const CustomDrawerContent = (props: any) => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedData: UserData = JSON.parse(userData);
          setUserName(parsedData.name);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      props.navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={drawerStyles.header}>
        <Text style={drawerStyles.userName}>
          {userName ? `Xin chào, ${userName}` : "Đang tải..."}
        </Text>
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity
        style={drawerStyles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={drawerStyles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const MainDrawer = () => {
  const { cart } = useCart(); // Lấy cart từ CartContext
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userData");
        if (storedUserId) {
          const parsedUser = JSON.parse(storedUserId);
          setUserId(parsedUser._id); // Lấy ID người dùng từ UserData
        }
      } catch (error) {
        console.error("Lỗi khi lấy UserData từ AsyncStorage:", error);
      }
    };
    getUserId();
  }, []);

  // const cartItemCount = cart.length; // Số lượng sản phẩm trong giỏ hàng
  const cartItemCount = cart.filter((item) => item.userId === userId).length; // Số lượng sản phẩm trong giỏ hàng
  // console.log('cartItemCount:', cartItemCount);

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerIcon: ({ color, size }) => (
          <Ionicons name="menu" size={size} color={color} />
        ),
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Trang chủ",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Hồ sơ cá nhân",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="CandleList"
        component={CandleList}
        options={{
          title: "Danh sách nến",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="flame-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="CartScreen"
        component={CartScreen}
        options={{
          title: "Giỏ hàng",
          drawerIcon: ({ color, size }) => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="cart-outline" size={size} color={color} />
              <View style={drawerStyles.badge}>
                <Text style={drawerStyles.badgeText}>{cartItemCount}</Text>
              </View>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="CheckoutScreen"
        component={CheckoutScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="PaymentConfirmation"
        component={PaymentConfirmationScreen}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="DetailCandle"
        component={DetailCandle}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          title: "Bản đồ",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          title: "Chat",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        console.log("User data from AsyncStorage:", userData);
        setIsLoggedIn(!!userData);
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLoginSuccess = (data: UserData) => {
    console.log("Login success with data:", data);
    setIsLoggedIn(true);
  };

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
            <Stack.Screen
              name="Login"
              component={(props) => (
                <Login {...props} onLoginSuccess={handleLoginSuccess} />
              )}
            />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Main" component={MainDrawer} />
            <Stack.Screen name="DetailCandle" component={DetailCandle} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
            <Stack.Screen
              name="PaymentConfirmation"
              component={PaymentConfirmationScreen}
            />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </GestureHandlerRootView>
  );
};

const drawerStyles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  logoutButton: {
    padding: 15,
    backgroundColor: "#ff9800",
    margin: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  badge: {
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default AppNavigator;

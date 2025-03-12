import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CandleList from "../components/CandleList";
import DetailCandle from "../components/DetailCandle";
import CartScreen from "../screens/CartScreen"; // Import the new CartScreen
import { CartProvider } from "../context/CartContext"; // Import CartProvider

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="CandleList">
            <Stack.Screen name="CandleList" component={CandleList} />
            <Stack.Screen name="DetailCandle" component={DetailCandle} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </GestureHandlerRootView>
  );
};

export default AppNavigator;

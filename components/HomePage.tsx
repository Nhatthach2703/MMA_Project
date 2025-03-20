import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import Config from './config';
interface Candle {
  id: number;
  name: string;
  scent: string;
  size: string;
  price: number;
  stock: number;
  quantity: number;
  image: string;
  ingredients: string;
  description: string;
  burningTime: string;
  material: string;
  madeIn: string;
  manufacturer: string;
  safetyInstructions: string;
}

const HomeScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(3);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(true);
  const animatedValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fetchCandles = async () => {
      try {
        const response = await fetch(`${Config.API_BASE_URL}/api/product`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Không thể lấy danh sách sản phẩm');
        }

        const data: Candle[] = await response.json();
        setCandles(data);
      } catch (error: any) {
        console.error('Lỗi khi gọi API:', error);
        Alert.alert('Lỗi', 'Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchCandles();

    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [100, -100],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Ionicons name="person" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Candle Store</Text>
        <TouchableOpacity onPress={() => Alert.alert("Notifications", "You have new messages!")}>
          <Ionicons name="notifications" size={28} color="black" />
          {notifications > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{notifications}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView>
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaqzfFN4me8DRRjCcAo7t2yAX4m1MZlBd4rg&s" }}
            style={styles.banner}
          />
          <Text style={styles.bannerText}>Welcome to the Candle Store</Text>
        </View>

        <View style={styles.featuredContainer}>
          <Text style={styles.featuredTitle}>Featured Products</Text>
          {loading ? (
            <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
          ) : candles.length === 0 ? (
            <Text style={styles.loadingText}>Không có sản phẩm nào</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {candles.map((candle) => (
                <View key={candle.id} style={styles.productCard}>
                  <Image source={{ uri: candle.image }} style={styles.productImage} />
                  <Text style={styles.productName}>{candle.name}</Text>
                  <Text style={styles.productPrice}>
                    {candle.price.toLocaleString('vi-VN')} VND
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CandleList")}>
        <Text style={styles.buttonText}>Explore Products</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Candle Store. All rights reserved.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bannerContainer: {
    width: "100%",
    alignItems: "center",
    position: "relative",
  },
  banner: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  bannerText: {
    position: "absolute",
    top: "30%",
    left: "25%",
    transform: [{ translateX: -50 }, { translateY: -10 }],
    fontSize: 26,
    fontWeight: "bold",
    color: "#8B4513",
    backgroundColor: "rgba(0, 0, 0, 0)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    textAlign: "center",
  },
  notificationBadge: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#ff9800",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  featuredContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    width: 150,
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: "#ff9800",
  },
  footer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
    elevation: 3,
  },
  footerText: {
    fontSize: 14,
    color: "#888",
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
  },
});

export default HomeScreen;
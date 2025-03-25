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
import { DrawerActions, RouteProp, useRoute } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import Config from './config';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "../context/CartContext";

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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bannerTextFadeAnim = useRef(new Animated.Value(0)).current; // Animation mới cho chữ banner
  const productSlideAnim = useRef(new Animated.Value(0)).current;

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const quoteFadeAnim = useRef(new Animated.Value(1)).current;
  const quoteSlideAnim = useRef(new Animated.Value(0)).current;
  const quotes = [
    "Ánh sáng là sự bình yên trong tâm hồn.",
    "Mỗi ngọn nến kể một câu chuyện riêng.",
    "Thư giãn cùng hương thơm dịu nhẹ.",
    "Tạo không gian ấm áp với nến thơm.",
    "Nến thơm - Đánh thức giác quan.",
  ];

  useEffect(() => {
    const fetchCandles = async () => {
      try {
        const response = await fetch(`${Config.API_BASE_URL}/api/product`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Không thể lấy danh sách sản phẩm');
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

    // Animation cho tiêu đề
    Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();

    // Animation cho chữ banner
    Animated.timing(bannerTextFadeAnim, {
      toValue: 1,
      duration: 1500,
      delay: 500,
      useNativeDriver: true,
    }).start();

    // Animation cho carousel trích dẫn
    const quoteInterval = setInterval(() => {
      Animated.parallel([
        Animated.timing(quoteFadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.spring(quoteSlideAnim, { toValue: 20, tension: 40, friction: 7, useNativeDriver: true }),
      ]).start(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
        quoteSlideAnim.setValue(-20);
        Animated.parallel([
          Animated.timing(quoteFadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.spring(quoteSlideAnim, { toValue: 0, tension: 40, friction: 7, useNativeDriver: true }),
        ]).start();
      });
    }, 4000);

    // Animation cho sản phẩm
    Animated.loop(
      Animated.sequence([
        Animated.timing(productSlideAnim, {
          toValue: -150 * Math.min(candles.length, 3),
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(productSlideAnim, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => clearInterval(quoteInterval);
  }, [animatedValue, fadeAnim, bannerTextFadeAnim, productSlideAnim, candles.length]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [100, -100],
  });

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  // Thêm sp vao giỏ hàng
  const { addToCart } = useCart();
  const handleAddToCart = async (candle: Candle) => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        Alert.alert("Thông báo", "Bạn cần đăng nhập để thêm vào giỏ hàng!");
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData._id;
      // console.log("userid: " + userId);

      addToCart({
        id: candle.id,
        userId: userId,
        name: candle.name,
        image: candle.image,
        price: candle.price,
        stock: candle.stock,
        quantity: 1,
      });
      // console.log("Adding to cart:", {
      //   id: candle.id,
      //   userId,
      //   name: candle.name,
      //   image: candle.image,
      //   price: candle.price,
      //   stock: candle.stock,
      //   quantity: 1,
      // });

      Alert.alert("Thông báo", `${candle.name} đã được thêm vào giỏ hàng!`);
    } catch (error) {
      console.error("Lỗi khi lấy UserData từ AsyncStorage:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Ionicons name="person" size={28} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Ionicons name="flame" size={24} color="#ff9800" style={{ marginRight: 5 }} />
          <Text style={styles.headerTitle}>Candle Store</Text>
        </View>
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
        {/* Banner cải tiến */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: "https://muskokalifestyle.online/cdn/shop/files/muskoka-lifestyle-multi-candle-banner.jpg?v=1727163884&width=3840" }} // Ảnh nến đẹp hơn
            style={styles.banner}
          />
          <LinearGradient
            colors={['rgba(50,30,20,0.6)', 'rgba(200,134,66,0.3)', 'transparent']}
            style={styles.gradientOverlay}
          />
          <Animated.Text style={[styles.bannerText, { opacity: bannerTextFadeAnim }]}>
            Welcome to Candle Store
          </Animated.Text>
          
        </View>

        <View style={styles.featuredContainer}>
          <Animated.Text style={[styles.featuredTitle, { opacity: fadeAnim }]}>
            Featured Products
          </Animated.Text>
          {loading ? (
            <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
          ) : candles.length === 0 ? (
            <Text style={styles.loadingText}>Không có sản phẩm nào</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Animated.View
                style={{
                  flexDirection: 'row',
                  transform: [{ translateX: productSlideAnim }],
                }}
              >
                {candles.map((candle) => (
                    <View key={candle.id} style={styles.productCard}>
                    <Image source={{ uri: candle.image }} style={styles.productImage} />
                    <Text style={styles.productName}>{candle.name}</Text>
                    <Text style={styles.productPrice}>
                      {candle.price.toLocaleString('vi-VN')} VND
                    </Text>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handleAddToCart(candle)}
                    >
                      <Ionicons name="cart-outline" size={20} color="#ff9800" />
                    </TouchableOpacity>
                    </View>
                ))}
              </Animated.View>
            </ScrollView>
          )}
          <LinearGradient
            colors={['#fdf6e3', '#f5e6cc']}
            style={styles.quoteContainer}
          >
            <Animated.Text
              style={[
                styles.quoteText,
                {
                  opacity: quoteFadeAnim,
                  transform: [{ translateX: quoteSlideAnim }],
                },
              ]}
            >
              {quotes[currentQuoteIndex]}
            </Animated.Text>
            <Ionicons name="flame-outline" size={20} color="#c68642" style={styles.quoteIcon} />
          </LinearGradient>
        </View>
      </ScrollView>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("CandleList")}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.buttonText}>Explore Products</Text>
        </TouchableOpacity>
      </Animated.View>

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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bannerContainer: {
    width: "100%",
    alignItems: "center",
    position: "relative",
    marginBottom: 20,
  },
  banner: {
    width: "100%",
    height: 240, // Tăng chiều cao cho sang trọng hơn
    resizeMode: "cover",
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '80%', // Gradient phủ rộng hơn
    borderRadius: 20,
  },
  bannerText: {
    position: "absolute",
    top: "35%",
    left: "25%",
    transform: [{ translateX: -50 }],
    fontSize: 32,
    fontWeight: "700",
    color: "#f5e6cc",
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
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
  addButton: {
    marginTop: 5,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#fff3e0",
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
  quoteContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: '500',
    color: '#8d5524',
    textAlign: 'center',
  },
  quoteIcon: {
    marginTop: 8,
  },
});

export default HomeScreen;
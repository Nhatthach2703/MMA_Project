import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { useCart } from "../context/CartContext"; // Import the useCart hook
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define type for params
type DetailParamList = {
  DetailCandle: {
    item: {
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
    };
  };
};

type DetailCandleRouteProp = RouteProp<DetailParamList, "DetailCandle">;

const DetailCandle: React.FC = () => {
  const route = useRoute<DetailCandleRouteProp>();
  const navigation = useNavigation();
  const { item } = route.params;
  const { addToCart } = useCart(); // Use the cart context

  const [quantity, setQuantity] = useState(item.quantity);

  const increaseQuantity = () => {
    if (quantity < item.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Handle "Add to Cart" button press
  // const handleAddToCart = () => {
  //   addToCart({
  //     id: item.id,
  //     name: item.name,
  //     image: item.image,
  //     price: item.price,
  //     stock: item.stock,
  //     quantity: quantity,
  //   });
  //   alert(`${item.name} has been added to your cart!`); // Optional: Show a confirmation
  // };
  const handleAddToCart = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
        return;
      }
  
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData._id; // Lấy ID người dùng từ AsyncStorage
  
      addToCart({
        id: item.id,
        userId: userId, // Thêm userId vào cart item
        name: item.name,
        image: item.image,
        price: item.price,
        stock: item.stock,
        quantity: quantity,
      });
      // console.log("name: " + item.name);
  
      alert(`${item.name} đã được thêm vào giỏ hàng!`);
    } catch (error) {
      console.error("Lỗi khi lấy UserData từ AsyncStorage:", error);
    }
  };

  // Handle "View Cart" button press
  const handleViewCart = () => {
    navigation.navigate("CartScreen");
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price.toLocaleString()} VND</Text>
      </View>

      <View style={styles.quantityContainer}>
        <Text style={styles.quantityLabel}>Số lượng</Text>
        <View style={styles.quantityControl}>
          <TouchableOpacity
            onPress={decreaseQuantity}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.quantityInput}
            value={quantity.toString()}
            keyboardType="numeric"
            editable={false}
          />
          <TouchableOpacity
            onPress={increaseQuantity}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>

        {/* View Cart Button */}
        <TouchableOpacity
          style={styles.viewCartButton}
          onPress={handleViewCart}
        >
          <Text style={styles.viewCartText}>Xem giỏ hàng</Text>
        </TouchableOpacity>

        {/* Buy Now Button */}
        <TouchableOpacity style={styles.buyNowButton}>
          <Text style={styles.buyNowText}>Mua ngay với Shop Pay</Text>
        </TouchableOpacity>

        <Text style={styles.moreOptions}>Các phương thức thanh toán khác</Text>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>{item.name}</Text>
        <Text style={styles.descriptionText}>{item.description}</Text>
        <View style={styles.features}>
          <Text style={styles.featureItem}>• Kích thước: {item.size}</Text>
          <Text style={styles.featureItem}>
            • Thời gian cháy: {item.burningTime}
          </Text>
          <Text style={styles.featureItem}>• Chất liệu: {item.material}</Text>
          <Text style={styles.featureItem}>• Sản xuất tại: {item.madeIn}</Text>
          <Text style={styles.featureItem}>• Cam kết 100% chất lượng</Text>
        </View>
        <Text style={styles.manufacturer}>{item.manufacturer}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  infoContainer: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF0000",
    marginBottom: 8,
  },
  quantityContainer: {
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  quantityInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    marginHorizontal: 10,
    fontSize: 18,
  },
  addToCartButton: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  addToCartText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  viewCartButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  viewCartText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  buyNowButton: {
    backgroundColor: "#4a00e0",
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  buyNowText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  moreOptions: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
  },
  descriptionContainer: {
    marginTop: 20,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
    lineHeight: 24,
  },
  features: {
    marginBottom: 15,
  },
  featureItem: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    lineHeight: 24,
  },
  manufacturer: {
    fontSize: 18,
    color: "#444",
    paddingBottom: 50,
  },
});

export default DetailCandle;

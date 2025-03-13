import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useCart } from "../context/CartContext"; // Import context

const CheckoutScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { removeSelectedItems } = useCart(); // Lấy hàm từ context

  // Lấy danh sách sản phẩm đã chọn từ route.params
  const { selectedProducts } = route.params as { selectedProducts: any[] };

  const shippingFee = 20000; // 20k VND
  const voucherDiscount = 5000; // 5k VND

  // Tính tổng số tiền
  const calculateTotal = () => {
    const productTotal = selectedProducts.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return (
      (productTotal + shippingFee - voucherDiscount).toLocaleString() + " VND"
    );
  };

  const handleConfirmPayment = () => {
    Alert.alert(
      "Xác nhận thanh toán",
      "Bạn có chắc chắn muốn thanh toán không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đồng ý",
          onPress: () => {
            removeSelectedItems(selectedProducts); // Xóa sản phẩm đã chọn
            navigation.navigate("PaymentConfirmation", { totalAmount: calculateTotal() });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.cartContainer}>
          {selectedProducts.map((item) => (
            <View style={styles.cartItem} key={item.id}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.price}>
                  {item.price.toLocaleString()} VND
                </Text>
              </View>
              <Text style={styles.quantityText}>Số lượng: {item.quantity}</Text>
            </View>
          ))}
        </View>

        
      </ScrollView>
      <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Tổng cộng:</Text>
          <Text style={styles.totalPrice}>{calculateTotal()}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleConfirmPayment}
        >
          <Text style={styles.checkoutText}>Xác nhận thanh toán</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8", padding: 20 },
  scrollContainer: {  },
  cartContainer: { marginBottom: 20 },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
  details: { flex: 1 },
  productName: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  price: { fontSize: 16, color: "#888" },
  quantityText: { fontSize: 16, fontWeight: "bold" },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  totalText: { fontSize: 16, fontWeight: "bold" },
  totalPrice: { fontSize: 16, fontWeight: "bold", color: "#e74c3c" },
  checkoutButton: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default CheckoutScreen;

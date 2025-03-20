import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useCart } from "../context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CheckoutScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { removeSelectedItems } = useCart();
  
  const { selectedProducts = [] } = route.params as { selectedProducts?: any[] };
  const [shippingAddress, setShippingAddress] = useState<string>("");
  const [selectedVoucher, setSelectedVoucher] = useState<number>(0);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedData = JSON.parse(userData);
          setShippingAddress(parsedData.address || "Chưa có địa chỉ, vui lòng cập nhật!");
        } else {
          setShippingAddress("Không tìm thấy dữ liệu người dùng!");
        }
      } catch (error) {
        setShippingAddress("Lỗi khi lấy địa chỉ!");
      }
    };
    fetchAddress();
  }, []);

  const shippingFee = 20000;
  const mockVouchers = [
    { id: 1, code: "DISCOUNT10", value: 10000, description: "Giảm 10.000 VND" },
    { id: 2, code: "SALE20", value: 20000, description: "Giảm 20.000 VND" },
    { id: 3, code: "FREESHIP", value: 15000, description: "Giảm 15.000 VND" },
  ];

  const calculateTotal = () => {
    const productTotal = selectedProducts.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return productTotal + shippingFee - selectedVoucher;
  };

  const handleConfirmPayment = () => {
    Alert.alert("Xác nhận thanh toán", "Bạn có chắc chắn muốn thanh toán không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đồng ý",
        onPress: () => {
          removeSelectedItems(selectedProducts);
          navigation.navigate("PaymentConfirmation", { totalAmount: calculateTotal() });
        },
      },
    ]);
  };

  const productTotal = selectedProducts.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#343a40" />
        </TouchableOpacity>
        {/* <Text style={styles.headerTitle}>Xác nhận đơn hàng</Text> */}
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm đã chọn</Text>
          {selectedProducts.map((item) => (
            <View style={styles.cartItem} key={item.id}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.price}>{item.price.toLocaleString()} VND</Text>
                <Text style={styles.quantityText}>Số lượng: {item.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>{shippingAddress}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.changeAddressButton}>
              <Text style={styles.changeAddressText}>Thay đổi</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chọn mã giảm giá */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mã giảm giá</Text>
          <TouchableOpacity style={styles.voucherButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.voucherText}>
              {selectedVoucher > 0
                ? `Giảm ${selectedVoucher.toLocaleString()} VND`
                : "Chọn mã giảm giá"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#3498db" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>
          <View style={styles.summaryRow}> <Text>Tổng giá trị sản phẩm:</Text><Text>{productTotal.toLocaleString()} VND</Text></View>
          {/* <View style={styles.summaryRow}><Text>Tổng sản phẩm:</Text><Text>{selectedProducts.length}</Text></View> */}
          <View style={styles.summaryRow}><Text>Phí vận chuyển:</Text><Text>{shippingFee.toLocaleString()} VND</Text></View>
          <View style={styles.summaryRow}><Text>Giảm giá:</Text><Text>-{selectedVoucher.toLocaleString()} VND</Text></View>
          <View style={styles.totalContainer}><Text style={styles.totalText}>Tổng cộng:</Text><Text style={styles.totalPrice}>{calculateTotal().toLocaleString()} VND</Text></View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.checkoutButton} onPress={handleConfirmPayment}>
        <Text style={styles.checkoutText}>Xác nhận thanh toán</Text>
      </TouchableOpacity>

      {/* Modal chọn voucher */}
      <Modal transparent={true} visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn mã giảm giá</Text>
            {mockVouchers.map((voucher) => (
              <TouchableOpacity
                key={voucher.id}
                style={styles.voucherItem}
                onPress={() => {
                  setSelectedVoucher(voucher.value);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.voucherCode}>{voucher.code}</Text>
                <Text>{voucher.description || "Không có mô tả"}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  scrollContainer: { paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    elevation: 3,
  },
  backButton: { marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },

  section: { backgroundColor: "#fff", padding: 15, borderRadius: 8, marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },

  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  details: { flex: 1 },
  productName: { fontSize: 16, fontWeight: "bold" },
  price: { fontSize: 14, color: "#888" },
  quantityText: { fontSize: 14 },

  addressContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  addressText: { fontSize: 14, flex: 1 },
  changeAddressButton: { backgroundColor: "#3498db", padding: 5, borderRadius: 5 },
  changeAddressText: { color: "#fff", fontSize: 14 },

  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  totalContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  totalText: { fontSize: 16, fontWeight: "bold" },
  totalPrice: { fontSize: 16, fontWeight: "bold", color: "#e74c3c" },

  checkoutButton: {
    backgroundColor: "#3498db",
    padding: 15,
    alignItems: "center",
    borderRadius: 8,
    margin: 20,
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  voucherItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  closeButton: { marginTop: 10, alignItems: "center" },
  closeButtonText: { color: "#e74c3c" },
  voucherButton: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    padding: 10, 
    borderWidth: 1, 
    borderRadius: 5, 
    borderColor: "#3498db" 
  },
  voucherText: { fontSize: 14, color: "#3498db" },
  voucherCode: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#27ae60", 
    textTransform: "uppercase", 
    marginBottom: 5 
  },
});

export default CheckoutScreen;

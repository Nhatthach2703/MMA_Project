import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useCart } from "../context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const CartScreen = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigation = useNavigation();

  // State để lưu trạng thái checkbox cho mỗi sản phẩm
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (id: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id], // Đảo trạng thái checkbox
    }));
  };

  const renderItem = ({
    item,
  }: {
    item: {
      id: number;
      name: string;
      image: string;
      price: number;
      stock: number;
      quantity: number;
    };
  }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("DetailCandle", { item })}
    >
      <View style={styles.cartItem}>
        {/* Checkbox */}
        <TouchableOpacity
          onPress={() => toggleCheck(item.id)}
          style={styles.checkbox}
        >
          <Ionicons
            name={checkedItems[item.id] ? "checkbox" : "square-outline"}
            size={24}
            color={checkedItems[item.id] ? "#007bff" : "#6c757d"}
          />
        </TouchableOpacity>

        {/* Hình ảnh sản phẩm */}
        <View style={styles.imageContainer}>
          <Image
            resizeMode="contain"
            source={{ uri: item.image }}
            style={styles.productImage}
          />
        </View>

        {/* Thông tin sản phẩm */}
        <View style={styles.productDetail}>
          <View style={styles.productHeader}>
            <Text style={styles.productName}>{item.name}</Text>
            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
          <Text style={styles.productDescription}>Mô tả sản phẩm</Text>
          <View style={styles.PriceQuantityContainer}>
            <Text style={styles.productPrice}>
              Giá: {item.price.toLocaleString()} VND
            </Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (item.quantity > 1)
                    updateQuantity(item.id, item.quantity - 1);
                }}
              >
                <Ionicons
                  name="remove-circle-outline"
                  size={24}
                  color="#007bff"
                />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                onPress={() => {
                  if (item.quantity < item.stock)
                    updateQuantity(item.id, item.quantity + 1);
                }}
              >
                <Ionicons name="add-circle-outline" size={24} color="#007bff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => {
    return checkedItems[item.id] ? sum + item.price * item.quantity : sum;
  }, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#343a40" />
        </TouchableOpacity>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống!</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Tổng cộng:</Text>
            <Text style={styles.totalPrice}>
              {totalPrice.toLocaleString()} VND
            </Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => {
              const selectedProducts = cart.filter(
                (item) => checkedItems[item.id]
              );
              navigation.navigate("CheckoutScreen", { selectedProducts });
            }}
          >
            <Text style={styles.checkoutText}>Thanh toán</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfdfd",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    elevation: 3,
  },
  backButton: {
    marginRight: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#343a40",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
  },
  listContainer: {
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBlockColor: "#dee2e6",
    marginBottom: 10,
    paddingVertical: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  imageContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  productDetail: {
    flex: 1,
    justifyContent: "space-between",
    padding: 10,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#343a40",
    marginBottom: 5,
    flex: 1,
  },
  productDescription: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    color: "#d9534f",
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    color: "#343a40",
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  PriceQuantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#dee2e6",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#343a40",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d9534f",
  },
  checkoutButton: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  checkoutText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
});

export default CartScreen;

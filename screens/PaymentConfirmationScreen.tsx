import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const PaymentConfirmationScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { totalAmount } = route.params as { totalAmount: string };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Đặt hàng thành công!</Text>
            <Text style={styles.subHeader}>Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi</Text>

            <View style={styles.orderDetailsContainer}>
                <Text style={styles.orderText}>📦 Đơn hàng sẽ được giao trong <Text style={styles.boldText}>3-5 ngày làm việc</Text></Text>
                <Text style={styles.orderText}>🆔 Mã đơn hàng: <Text style={styles.boldText}>123456</Text></Text>
                <Text style={styles.orderText}>📅 Ngày đặt hàng: <Text style={styles.boldText}>01/01/2025</Text></Text>
                <Text style={styles.orderTotal}>💰 Tổng cộng: <Text style={styles.boldText}>{totalAmount}</Text></Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} 
                // onPress={() => navigation.navigate("Home")}
                >
                    <Text style={styles.buttonText}>Trang chủ</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} 
                    // onPress={() => navigation.navigate("OrderStatus")}
                    >
                    <Text style={styles.buttonText}>Trạng thái đơn</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CartScreen")}>
                    <Text style={styles.buttonText}>Giỏ hàng</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fdfdfd", padding: 20 },
    header: { fontSize: 24, fontWeight: "bold", color: "#007bff", marginBottom: 10 },
    subHeader: { fontSize: 18, color: "#343a40", marginBottom: 30, textAlign: "center" },
    buttonContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 10 },
    button: { backgroundColor: "#007bff", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, marginHorizontal: 5, flex: 1, alignItems: "center" },
    buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
    orderDetailsContainer: { backgroundColor: "#f8f9fa", padding: 15, borderRadius: 10, width: "100%", marginBottom: 20 },
    orderText: { fontSize: 16, color: "#333", marginBottom: 5 },
    orderTotal: { fontSize: 18, color: "#007bff", fontWeight: "bold", marginTop: 10 },
    boldText: { fontWeight: "bold" },
});

export { PaymentConfirmationScreen };

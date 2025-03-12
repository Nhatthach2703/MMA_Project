import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Nhập dữ liệu từ products.json
import candleData from "../data/products.json";

// Định nghĩa type cho một sản phẩm nến
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
  productId: string;
  manufacturer: string;
  safetyInstructions: string;
}

const CandleList = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: Candle }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("DetailCandle", { item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name || "No name"}</Text>
        <Text style={styles.price}>
          {item.price ? `${item.price.toLocaleString()} VND` : "No price"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách sản phẩm</Text>
        <View style={{ width: 24 }} /> {/* Placeholder cho căn giữa */}
      </View>

      <FlatList<Candle>
        data={candleData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginLeft: -24,
  },
  listContainer: {
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF0000",
  },
});

export default CandleList;

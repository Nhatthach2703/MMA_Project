import React, { useState, useEffect } from "react"; // Thêm useEffect
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "./config";
interface UserData {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  avatar?: string;
  address?: string;
}

interface LoginProps {
  onLoginSuccess: (userData: UserData) => void;
  navigation: any;
  route: any; // Thêm route để nhận params
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, navigation, route }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Lấy email từ route.params khi chuyển từ Register
  useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email);
    }
  }, [route.params?.email]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email là bắt buộc");
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Định dạng email không hợp lệ");
      valid = false;
    }

    if (!password) {
      setPasswordError("Mật khẩu là bắt buộc");
      valid = false;
    }

    if (!valid) return;

    try {
      console.log("Gửi yêu cầu đăng nhập:", { email, password });
      const response = await fetch(`${Config.API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Thông tin đăng nhập không chính xác"
        );
      }

      const data: UserData = await response.json();
      await AsyncStorage.setItem("userData", JSON.stringify(data));
      onLoginSuccess(data);

      navigation.replace("Main");
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi khi đăng nhập");
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate("Register");
  };

  const handleCancel = () => {
    setEmail("");
    setPassword("");
    setEmailError("");
    setPasswordError("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={{
          uri: "https://png.pngtree.com/png-vector/20240721/ourlarge/pngtree-home-scented-candle-cartoon-png-image_13027879.png",
        }}
      />
      <View style={styles.inputContainer}>
        <Ionicons
          name="mail-outline"
          size={24}
          color="#6c757d"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#6c757d"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={24}
          color="#6c757d"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          placeholderTextColor="#6c757d"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={24}
            color="#6c757d"
          />
        </TouchableOpacity>
      </View>
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.button, styles.buttonLogin]}
        >
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCancel}
          style={[styles.button, styles.buttonCancel]}
        >
          <Text style={styles.buttonText}>Huỷ</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleNavigateToRegister}>
        <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.link}>Quên mật khẩu?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    width: "100%",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    flex: 1,
    height: 40,
  },
  icon: {
    marginRight: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  button: {
    flex: 1,
    alignContent: "center",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  buttonLogin: {
    backgroundColor: "#007bff",
  },
  buttonCancel: {
    backgroundColor: "red",
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    color: "#007bff",
    marginTop: 16,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 10,
  },
});

export default Login;

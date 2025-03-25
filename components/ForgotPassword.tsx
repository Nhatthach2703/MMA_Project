import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Config from "./config";

interface ForgotPasswordProps {
  navigation: any;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [step, setStep] = useState(1);

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleForgotPassword = async () => {
    let valid = true;
    setEmailError("");
    setPhoneError("");
    setPasswordError("");
  
    if (!email) {
      setEmailError("Email là bắt buộc");
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Định dạng email không hợp lệ");
      valid = false;
    }
  
    if (!phone) {
      setPhoneError("Số điện thoại là bắt buộc");
      valid = false;
    } else if (!validatePhone(phone)) {
      setPhoneError("Số điện thoại phải có 10 chữ số");
      valid = false;
    }
  
    if (!otp) {
      Alert.alert("Lỗi", "Vui lòng nhập mã OTP");
      valid = false;
    }
  
    if (!newPassword) {
      setPasswordError("Mật khẩu mới là bắt buộc");
      valid = false;
    } else if (newPassword.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
      valid = false;
    }
  
    if (!valid) return;
  
    try {
      const response = await fetch(
        `${Config.API_BASE_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, phone, otp, newPassword }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Thông tin không chính xác");
      }
  
      const data = await response.json();
      Alert.alert("Thành công", data.message, [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi khi đặt lại mật khẩu");
    }
  };
  
  const handleRequestOTP = async () => {
    try {
      const response = await fetch(`${Config.API_BASE_URL}/api/auth/sendOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, phone }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể gửi mã OTP");
      }
  
      Alert.alert("Thành công", "Mã OTP đã được gửi!", [{ text: "OK" }]);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi khi gửi OTP");
    }
  };
  
  const [otp, setOtp] = useState<string>("");

  const handleVerifyOTP = async () => {
    try {
      const response = await fetch(`${Config.API_BASE_URL}/api/auth/verifyOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, phone, otp }),
      });
  
      const responseData = await response.json(); // Lấy dữ liệu phản hồi
  
      console.log("Response data:", responseData); // Debug phản hồi từ server
  
      if (!response.ok) {
        throw new Error(responseData.message || "OTP không hợp lệ");
      }
  
      Alert.alert("Thành công", "OTP hợp lệ. Nhập mật khẩu mới!", [
        { text: "OK", onPress: () => setStep(2) },
      ]);
    } catch (error) {
      console.error("OTP verification error:", error); // Debug lỗi
      Alert.alert("Lỗi", "OTP không chính xác");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên Mật Khẩu</Text>
      {step === 1 ? (
        <>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={24} color="#6c757d" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={24} color="#6c757d" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="key-outline" size={24} color="#6c757d" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nhập mã OTP"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
            />
          </View>

          <TouchableOpacity style={styles.otpButton} onPress={handleRequestOTP}>
            <Text style={styles.otpButtonText}>Gửi mã OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
            <Text style={styles.buttonText}>Xác nhận OTP</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="#6c757d" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu mới"
              secureTextEntry={!showPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#6c757d" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
            <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Quay lại đăng nhập</Text>
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
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
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
  otpButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    width: "100%",
    alignItems: "center",
  },
  otpButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  
});

export default ForgotPassword;

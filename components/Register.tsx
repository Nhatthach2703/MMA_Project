import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from './config';
interface UserData {
  name: string;
  email: string;
  phone: string;
  dob: string;
  avatar?: string;
}

interface RegisterProps {
  navigation: any;
}

const Register: React.FC<RegisterProps> = ({ navigation }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !phone || !dob || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const userData = { name, email, phone, dob, password };

    try {
      console.log('Gửi yêu cầu đăng ký:', userData);
      const response = await fetch(`${Config.API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      console.log('Phản hồi từ server:', { status: response.status });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Dữ liệu lỗi:', errorData);
        throw new Error(errorData.message || 'Đăng ký không thành công');
      }

      const data: UserData = await response.json();
      console.log('Dữ liệu trả về:', data);

      await AsyncStorage.setItem('userData', JSON.stringify(data));
      console.log('Đã lưu userData vào AsyncStorage');

      Alert.alert('Thành công', 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
      // Chuyển hướng về Login và truyền email
      navigation.replace('Login', { email });
    } catch (error: any) {
      console.error('Lỗi khi đăng ký:', error);
      Alert.alert('Lỗi', error.message || 'Đã xảy ra lỗi khi đăng ký');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Ký</Text>
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={{
          uri: "https://png.pngtree.com/png-vector/20240721/ourlarge/pngtree-home-scented-candle-cartoon-png-image_13027879.png",
        }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Họ và tên"
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          Deportivo
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Số điện thoại"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Ngày sinh (DD/MM/YYYY)"
          value={dob}
          onChangeText={setDob}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Mật khẩu"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconContainer}
        >
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={24}
            color="#6c757d"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  inputField: {
    flex: 1,
    padding: 10,
  },
  iconContainer: {
    padding: 10,
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
});

export default Register;
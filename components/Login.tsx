import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  name: string;
  email: string;
  phone: string;
  dob: string;
  avatar?: string;
}

interface LoginProps {
  onLoginSuccess: (userData: UserData) => void;
  navigation: any;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    try {
      console.log('Gửi yêu cầu đăng nhập:', { email, password });
      const response = await fetch('http://192.168.1.94:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Phản hồi từ server:', { status: response.status });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Dữ liệu lỗi:', errorData);
        throw new Error(errorData.message || 'Thông tin đăng nhập không chính xác');
      }

      const data: UserData = await response.json();
      console.log('Dữ liệu trả về:', data);

      await AsyncStorage.setItem('userData', JSON.stringify(data));
      console.log('Đã lưu userData vào AsyncStorage');

      onLoginSuccess(data);
      navigation.replace('Main'); // Chuyển đến Main thay vì Home
      console.log('Đã chuyển hướng đến Main');
    } catch (error: any) {
      console.error('Lỗi khi đăng nhập:', error);
      Alert.alert('Lỗi', error.message || 'Đã xảy ra lỗi khi đăng nhập');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Đăng nhập" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});

export default Login;
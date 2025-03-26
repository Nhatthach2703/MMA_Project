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
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [dobError, setDobError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/; // Kiểm tra số điện thoại 10 chữ số
    return phoneRegex.test(phone);
  };

  const validateDob = (dob: string) => {
    const dobRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return dobRegex.test(dob);
  };

  const handleRegister = async () => {
    let valid = true;
    setNameError('');
    setEmailError('');
    setPhoneError('');
    setDobError('');
    setPasswordError('');

    if (!name) {
      setNameError('Họ và tên là bắt buộc');
      valid = false;
    }

    if (!email) {
      setEmailError('Email là bắt buộc');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Định dạng email không hợp lệ');
      valid = false;
    }

    if (!phone) {
      setPhoneError('Số điện thoại là bắt buộc');
      valid = false;
    } else if (!validatePhone(phone)) {
      setPhoneError('Số điện thoại phải có 10 chữ số');
      valid = false;
    }

    if (!dob) {
      setDobError('Ngày sinh là bắt buộc');
      valid = false;
    } else if (!validateDob(dob)) {
      setDobError('Định dạng ngày sinh phải là DD/MM/YYYY');
      valid = false;
    }

    if (!password) {
      setPasswordError('Mật khẩu là bắt buộc');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      valid = false;
    }

    if (!valid) return;

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng ký không thành công');
      }

      const data: UserData = await response.json();
      await AsyncStorage.setItem('userData', JSON.stringify(data));
      
      Alert.alert('Thành công', 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
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
        <Ionicons name="person-outline" size={24} color="#6c757d" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          value={name}
          onChangeText={setName}
        />
      </View>
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
      
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
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      
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
      {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
      
      <View style={styles.inputContainer}>
        <Ionicons name="calendar-outline" size={24} color="#6c757d" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ngày sinh (DD/MM/YYYY)"
          value={dob}
          onChangeText={setDob}
        />
      </View>
      {dobError ? <Text style={styles.errorText}>{dobError}</Text> : null}
      
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={24} color="#6c757d" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#6c757d" />
        </TouchableOpacity>
      </View>
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.buttonLogin]} onPress={handleRegister}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
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
  input: {
    flex: 1,
    height: 40,
  },
  icon: {
    marginRight: 8,
  },
  button: {
    // backgroundColor: "#007bff",
    // padding: 12,
    // borderRadius: 8,
    // marginTop: 10,
    // width: "100%",
    flex: 1,
    alignContent: "center",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  buttonLogin: {
    backgroundColor: "#007bff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  buttonCancel: {
    backgroundColor: "red",
  },
});

export default Register;
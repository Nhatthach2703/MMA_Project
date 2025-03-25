import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View,KeyboardAvoidingView  } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import Config from './config';
import { useNavigation } from "@react-navigation/native";

interface UserData {
  _id?: string; // Thêm _id để lưu ID người dùng
  name: string;
  email: string;
  phone: string;
  dob: string;
  avatar?: string;
  address?: string;
  password?: string;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation(); 
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
    dob: "",
    avatar: "",
    address: "",
    password:"",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);


  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Lấy dữ liệu từ AsyncStorage
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const parsedData: UserData = JSON.parse(storedData);
        setUserData(parsedData);

        // Gọi API với ID từ AsyncStorage để đảm bảo dữ liệu mới nhất
        if (parsedData._id) {
          const response = await fetch(`${Config.API_BASE_URL}/api/auth/${parsedData._id}`);
          if (!response.ok) {
            throw new Error("Lỗi khi tải dữ liệu người dùng");
          }
          const data = await response.json();
          setUserData(data);
          await AsyncStorage.setItem("userData", JSON.stringify(data)); // Cập nhật lại AsyncStorage
        }
      } else {
        console.warn("Không tìm thấy dữ liệu người dùng trong AsyncStorage");
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu người dùng:", error);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      // Sử dụng _id từ userData để gọi API
      const userId = userData._id;
      if (!userId) {
        throw new Error("Không tìm thấy ID người dùng");
      }

      const response = await fetch(`${Config.API_BASE_URL}/api/auth/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi cập nhật thông tin");
      }

      // Cập nhật lại AsyncStorage
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      alert("Thông tin đã được cập nhật!");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert("Đã xảy ra lỗi khi cập nhật thông tin");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setUserData({ ...userData, avatar: result.assets[0].uri });
    }
  };


  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");


const handleChangePassword = async () => {
  try {
    const userId = userData._id;
    if (!userId) {
      alert("Lỗi: Không tìm thấy ID người dùng!");
      return;
    }

    const response = await fetch(`${Config.API_BASE_URL}/api/auth/change-password/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    if (!response.ok) {
      throw new Error("Lỗi khi đổi mật khẩu");
    }

    alert("Mật khẩu đã được cập nhật!");
    setIsPasswordModalVisible(false);
    setCurrentPassword("");
    setNewPassword("");
  } catch (error) {
    alert("Mật khẩu hiện tại không đúng hoặc có lỗi xảy ra.");
  }
};




  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hồ Sơ Cá Nhân</Text>
      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        <Image
          source={{ uri: userData.avatar || "https://via.placeholder.com/100" }}
          style={styles.avatar}
        />
        <Ionicons name="camera" size={24} color="#6c757d" style={styles.cameraIcon} />
      </TouchableOpacity>

      {/* Name */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Họ và tên"
          value={userData.name}
          onChangeText={(text) => setUserData({ ...userData, name: text })}
          editable={isEditing}
        />
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Email"
          value={userData.email}
          keyboardType="email-address"
          editable={false} // Email không chỉnh sửa được
        />
      </View>

      {/* Phone */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Số điện thoại"
          value={userData.phone}
          onChangeText={(text) => setUserData({ ...userData, phone: text })}
          keyboardType="phone-pad"
          editable={isEditing}
        />
      </View>

      {/* Date of Birth */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Ngày sinh (DD/MM/YYYY)"
          value={userData.dob}
          onChangeText={(text) => setUserData({ ...userData, dob: text })}
          editable={isEditing}
        />
      </View>
        {/* Address */}
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.inputField}
                placeholder="Địa chỉ"
                value={userData.address}
                onChangeText={(text) => setUserData({ ...userData, address: text })}
                editable={isEditing}
            />
        </View>
      {/* Address */}
      {isPasswordModalVisible && (
  <View style={styles.overlay}>
    <KeyboardAvoidingView behavior="padding" style={styles.passwordModal}>
      <Text style={styles.modalTitle}>Đổi mật khẩu</Text>

      {/* Mật khẩu hiện tại */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Mật khẩu hiện tại"
          secureTextEntry={!showCurrentPassword}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
          <Ionicons name={showCurrentPassword ? "eye" : "eye-off"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Mật khẩu mới */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Mật khẩu mới"
          secureTextEntry={!showNewPassword}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
          <Ionicons name={showNewPassword ? "eye" : "eye-off"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={styles.modalButtonContainer}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => setIsPasswordModalVisible(false)}
        >
          <Text style={styles.buttonText}>Hủy</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.saveButton1} 
          onPress={handleChangePassword}
        >
          <Text style={styles.buttonText}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  </View>
)}





      {/* Buttons */}
      <View style={styles.buttonContainer}>
      <TouchableOpacity 
  style={[styles.button, styles.changePasswordButton]} 
  onPress={() => setIsPasswordModalVisible(true)}
>
  <Text style={styles.buttonText}>Đổi mật khẩu</Text>
</TouchableOpacity>


        <TouchableOpacity style={[styles.button, styles.backButton]}  onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Quay lại</Text>
        </TouchableOpacity>
        {isEditing ? (
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
            <Text style={styles.buttonText}>Lưu</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => setIsEditing(true)}>
            <Text style={styles.buttonText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        )}
      </View>
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
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 15,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#808080",
  },
  editButton: {
    backgroundColor: "#007bff",
  },
  saveButton: {
    backgroundColor: "#008000",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Làm mờ nền
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  
  passwordModal: {
    width: "100%",
    height:"100%", // Tăng chiều rộng modal
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  
  inputField1: {
    width: "100%",
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  
  cancelButton: {
    backgroundColor: "#808080",
    flex: 1,
    marginRight: 10,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  
  saveButton1: {
    backgroundColor: "green",
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  changePasswordButton: {
    backgroundColor: "orange", // Màu nền của nút
  },
  
});

export default ProfileScreen;
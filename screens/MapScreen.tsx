import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Alert, TouchableOpacity, Button } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const SHOP_LOCATION = {
  latitude: 16.0718,
  longitude: 108.2144,
  address: '112 Hải Phòng, Thạc Gián, Thanh Khê, Đà Nẵng',
};

const MapScreen: React.FC = () => {
  const [inputAddress, setInputAddress] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const navigation = useNavigation();

  const getCoordinatesFromAddress = async (address: string): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
        { headers: { "User-Agent": "MyMapApp/1.0 (contact@example.com)" } }
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy tọa độ cho địa chỉ này.');
        return null;
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi tìm tọa độ.');
      console.error(error);
      return null;
    }
  };

  const handleNavigate = async () => {
    if (!inputAddress.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ.');
      return;
    }
    const coordinates = await getCoordinatesFromAddress(inputAddress.trim());
    if (coordinates) {
      setUserLocation(coordinates);
      setRouteCoordinates([coordinates, SHOP_LOCATION]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: SHOP_LOCATION.latitude,
            longitude: SHOP_LOCATION.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={SHOP_LOCATION} title="Shop" description={SHOP_LOCATION.address} />
          {userLocation && <Marker coordinate={userLocation} title="Vị trí của bạn" pinColor="blue" />}
          {routeCoordinates.length > 1 && <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="blue" />}
        </MapView>
      </View>

      <View style={styles.infoContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập địa chỉ của bạn"
          value={inputAddress}
          onChangeText={setInputAddress}
        />
        <TouchableOpacity style={styles.button} onPress={handleNavigate}>
          <Text style={styles.buttonText}>🚀 Chỉ đường</Text>
        </TouchableOpacity>
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  mapContainer: {
    flex: 1,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MapScreen;
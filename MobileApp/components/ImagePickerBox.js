import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerBox({ imageUri, onImageSelected }) {
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { alert('Permission to access gallery is required.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled) onImageSelected(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) { alert('Camera permission is required.'); return; }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled) onImageSelected(result.assets[0].uri);
  };

  return (
    <View style={styles.wrapper}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>🖼️</Text>
          <Text style={styles.placeholderText}>No image selected</Text>
        </View>
      )}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.btn} onPress={pickImage}>
          <Text style={styles.btnText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={takePhoto}>
          <Text style={styles.btnText}>Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', alignItems: 'center' },
  image: { width: 280, height: 280, borderRadius: 16, marginBottom: 16 },
  placeholder: {
    width: 280, height: 280, borderRadius: 16,
    backgroundColor: '#1E1E2E', borderWidth: 2,
    borderColor: '#2E2E4E', borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  placeholderIcon: { fontSize: 48, marginBottom: 8 },
  placeholderText: { color: '#6060A0', fontSize: 14 },
  buttons: { flexDirection: 'row', gap: 12 },
  btn: { backgroundColor: '#6C63FF', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 12 },
  btnSecondary: { backgroundColor: '#3D3A6B' },
  btnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
});

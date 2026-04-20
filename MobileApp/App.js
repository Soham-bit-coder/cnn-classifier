import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  Alert, SafeAreaView, ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ImagePickerBox from './components/ImagePickerBox';
import ResultCard from './components/ResultCard';

const API_URL = 'http://192.168.29.11:8000';

export default function App() {
  const [imageUri, setImageUri] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageSelected = async (uri) => {
    setImageUri(uri);
    setResult(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', { uri, name: 'image.jpg', type: 'image/jpeg' });

      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      Alert.alert('Error', 'Could not connect to the server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>CIFAR-10 Classifier</Text>
        <Text style={styles.subtitle}>Pick an image to classify</Text>
        <ImagePickerBox imageUri={imageUri} onImageSelected={handleImageSelected} />
        {loading && <ActivityIndicator size="large" color="#6C63FF" style={styles.loader} />}
        {result && !loading && <ResultCard result={result} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F0F1A' },
  container: { alignItems: 'center', padding: 24, paddingTop: 48 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#9090A0', marginBottom: 32 },
  loader: { marginTop: 32 },
});

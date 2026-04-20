import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EMOJI = {
  airplane: '✈️', automobile: '🚗', bird: '🐦', cat: '🐱',
  deer: '🦌', dog: '🐶', frog: '🐸', horse: '🐴', ship: '🚢', truck: '🚛',
};

export default function ResultCard({ result }) {
  const { predicted_class, confidence, top5 } = result;

  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{EMOJI[predicted_class] || '🔍'}</Text>
      <Text style={styles.label}>{predicted_class.toUpperCase()}</Text>
      <Text style={styles.confidence}>{(confidence * 100).toFixed(1)}% confidence</Text>
      <View style={styles.divider} />
      <Text style={styles.top5Title}>Top 5 Predictions</Text>
      {top5.map((item, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.rowLabel}>{EMOJI[item.class] || '•'} {item.class}</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${(item.score * 100).toFixed(0)}%` }]} />
          </View>
          <Text style={styles.rowScore}>{(item.score * 100).toFixed(1)}%</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 24, width: '100%', backgroundColor: '#1E1E2E', borderRadius: 20, padding: 24, alignItems: 'center' },
  emoji: { fontSize: 52, marginBottom: 8 },
  label: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', letterSpacing: 2 },
  confidence: { fontSize: 14, color: '#6C63FF', marginTop: 4, marginBottom: 16 },
  divider: { width: '100%', height: 1, backgroundColor: '#2E2E4E', marginBottom: 16 },
  top5Title: { color: '#9090A0', fontSize: 12, marginBottom: 12, alignSelf: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 8 },
  rowLabel: { color: '#CCCCDD', fontSize: 13, width: 110 },
  barBg: { flex: 1, height: 6, backgroundColor: '#2E2E4E', borderRadius: 4, marginHorizontal: 8 },
  barFill: { height: 6, backgroundColor: '#6C63FF', borderRadius: 4 },
  rowScore: { color: '#9090A0', fontSize: 12, width: 40, textAlign: 'right' },
});

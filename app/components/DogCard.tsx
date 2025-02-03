import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Dog } from '../types';

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: (dogId: string) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = 8;
const CARDS_PER_ROW = 5; // Updated to 5 cards per row
const CARD_WIDTH = (SCREEN_WIDTH - 40 - (CARDS_PER_ROW * CARD_MARGIN * 2)) / CARDS_PER_ROW;

export const DogCard: React.FC<DogCardProps> = ({ dog, isFavorite, onToggleFavorite }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: dog.img }} style={styles.dogImage} resizeMode="cover" />
      <View style={styles.cardContent}>
        <Text style={styles.dogName}>{dog.name}</Text>
        <Text style={styles.dogBreed}>{dog.breed}</Text>
        <View style={styles.dogInfoContainer}>
          <Text style={styles.dogInfo}>Age: {dog.age} years</Text>
          <Text style={styles.dogInfo}>ZIP: {dog.zip_code}</Text>
        </View>
        <TouchableOpacity
          style={[styles.favoriteToggle, isFavorite && styles.favoriteToggleActive]}
          onPress={() => onToggleFavorite(dog.id)}
        >
          <Text style={[styles.favoriteToggleText, isFavorite && styles.favoriteToggleTextActive]}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
card: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dogImage: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
    backgroundColor: '#f0f0f0',
  },
  cardContent: {
    padding: 8,
    position: 'relative',
  },
  dogName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  dogBreed: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dogInfoContainer: {
    marginBottom: 8,
  },
  dogInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  favoriteToggle: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 6,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteToggleActive: {
    backgroundColor: '#FFE5EC',
  },
  favoriteToggleText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 14,
  },
  favoriteToggleTextActive: {
    color: '#FF3B70',
  },
});

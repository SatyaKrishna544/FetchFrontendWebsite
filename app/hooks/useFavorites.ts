import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const loadFavorites = async () => {
    try {
      console.log('Loading favorites from storage...');
      const storedFavorites = await AsyncStorage.getItem("favorites");
      console.log('Stored favorites:', storedFavorites);
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        console.log('Parsed favorites:', parsedFavorites);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (dogId: string) => {
    try {
      const updatedFavorites = favorites.includes(dogId)
        ? favorites.filter(id => id !== dogId)
        : [...favorites, dogId];

      console.log('Updating favorites:', updatedFavorites);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error updating favorites:', error);
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  return {
    favorites,
    toggleFavorite,
    loadFavorites // Export this so we can manually reload favorites
  };
};
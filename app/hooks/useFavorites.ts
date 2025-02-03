// 📁 app/hooks/useFavorites.ts
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
// 📁 app/hooks/useFavorites.ts
import { create } from 'zustand';

interface FavoritesStore {
  favorites: string[];
  setFavorites: (favorites: string[]) => void;
}

const useFavoritesStore = create<FavoritesStore>((set) => ({
  favorites: [],
  setFavorites: (favorites) => set({ favorites }),
}));

export const useFavorites = () => {
  const { favorites, setFavorites } = useFavoritesStore();

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      setFavorites(parsedFavorites);
      return parsedFavorites;
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  };

  const toggleFavorite = async (dogId: string) => {
    try {
      const updatedFavorites = favorites.includes(dogId)
        ? favorites.filter(id => id !== dogId)
        : [...favorites, dogId];

      setFavorites(updatedFavorites);
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return !favorites.includes(dogId);
    } catch (error) {
      console.error('Error updating favorites:', error);
      Alert.alert('Error', 'Failed to update favorites');
      return false;
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return {
    favorites,
    toggleFavorite,
    loadFavorites,
  };
};

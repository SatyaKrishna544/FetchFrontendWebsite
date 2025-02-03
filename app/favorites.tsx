// 📁 app/favorites.tsx
import React, { useState, useEffect } from 'react';
import { ScrollView, View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from './components/Header';
import { DogCard } from './components/DogCard';
import { useAuth } from './providers/auth';
import { fetchDogDetails } from './api';
import { Dog } from './types';

export default function FavoritesPage() {
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated]);

  // Load favorites and fetch dog details
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        console.log('Loading favorites...');
        const storedFavorites = await AsyncStorage.getItem("favorites");
        console.log('Stored favorites:', storedFavorites);
        
        const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];
        console.log('Parsed favorite IDs:', favoriteIds);

        if (favoriteIds.length > 0) {
          console.log('Fetching dog details for favorites...');
          const dogs = await fetchDogDetails(favoriteIds);
          console.log('Fetched dog details:', dogs);
          setFavoriteDogs(dogs || []);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const toggleFavorite = async (dogId: string): Promise<void> => {
    try {
      // Get current favorites
      const storedFavorites = await AsyncStorage.getItem("favorites");
      let favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];
      
      // Remove the dog
      favoriteIds = favoriteIds.filter((id: string) => id !== dogId);
      setFavoriteDogs(prevDogs => prevDogs.filter(dog => dog.id !== dogId));
      
      // Update storage
      await AsyncStorage.setItem("favorites", JSON.stringify(favoriteIds));
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header showLogout={false} />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6A4C93" />
        </View>
      ) : (
        <View style={styles.contentContainer}>
          {favoriteDogs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No favorite dogs yet! 🐾
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Go back to the home page to find your perfect companion
              </Text>
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {favoriteDogs.map((dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF3E0",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 400,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: 16,
    marginHorizontal: -8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 400,
  },
  emptyStateText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A4C93',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
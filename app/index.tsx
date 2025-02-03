// 📁 app/index.tsx
import React, { useEffect } from 'react';
import { ScrollView, View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './providers/auth';
import { DogCard } from './components/DogCard';
import { FilterControls } from './components/FilterControls';
import { Pagination } from './components/Pagination';
import { useDogSearch } from './hooks/useDogSearch';
import { useFavorites } from './hooks/useFavorites';
import { CARD_WIDTH, PAGE_SIZE } from './constants';
import { fetchBreeds } from './api';
import { Dog } from './types';

export default function IndexPage() {
    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();
    
    const {
      breeds,
      selectedBreed,
      setSelectedBreed,
      dogs,
      isLoading,
      currentPage,
      totalDogs,
      sortOption,
      setSortOption,
      ageRange,
      setAgeRange,
      performSearch
    } = useDogSearch();
  
    const { favorites, toggleFavorite } = useFavorites();
  
    // Initial search when breeds are loaded
    useEffect(() => {
      if (breeds.length > 0) {
        performSearch(selectedBreed, 0, sortOption);
      }
    }, [breeds]); // Only depend on breeds array
  

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Top Navigation Bar with Logout Button */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>← Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🐶 Welcome to Happy Tails!</Text>
        <Text style={styles.subtitle}>Find your perfect furry friend ❤️</Text>
      </View>

      {/* Filter Controls */}
      <FilterControls
        breeds={breeds}
        selectedBreed={selectedBreed}
        sortOption={sortOption}
        ageRange={ageRange}
        favoritesCount={favorites.length}
        onBreedChange={(value) => {
          setSelectedBreed(value);
          performSearch(value, 0, sortOption);
        }}
        onSortChange={(type, value) => {
            setSortOption(value);
            performSearch(selectedBreed, 0, value);
        }}
        onAgeChange={(value) => {
          setAgeRange(value);
          performSearch(selectedBreed, 0, sortOption);
        }}
        onSearch={() => performSearch(selectedBreed, 0, sortOption)}
      />

      {/* Loading State */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6A4C93" />
        </View>
      ) : (
        <>
          {/* Dog Grid */}
          {dogs.length > 0 ? (
            <View style={styles.gridContainer}>
            {dogs.map((dog: Dog) => (  // Add ': Dog' here
              <DogCard
                key={dog.id}
                dog={dog}
                isFavorite={favorites.includes(dog.id)}
                onToggleFavorite={toggleFavorite}
                cardWidth={CARD_WIDTH}
              />
            ))}
          </View>
          ) : (
            <View style={styles.noDogsContainer}>
              <Text style={styles.noDogsText}>No dogs found matching your criteria.</Text>
            </View>
          )}

          {/* Pagination */}
          {dogs.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalDogs / PAGE_SIZE)}
              onPageChange={(page) => performSearch(selectedBreed, page * PAGE_SIZE, sortOption)}
            />
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF3E0",
    padding: 16,
  },
  topBar: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 0,
  },
  logoutButton: {
    backgroundColor: "#FF5A5F",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  logoutText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6A4C93",
  },
  subtitle: {
    fontSize: 16,
    color: "#6A4C93",
    marginBottom: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: -8,
  },
  noDogsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  noDogsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
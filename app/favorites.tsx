import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, ActivityIndicator, StyleSheet, Modal, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Header } from './components/Header';
import { Pagination } from './components/Pagination';
import { useAuth } from './providers/auth';
import { fetchDogDetails, matchDog } from './api';
import { Dog } from './types';
import { useFavorites } from './hooks/useFavorites';
import { DogCard } from './components/DogCard';
import { CARD_MARGIN, CARD_WIDTH, PAGE_SIZE } from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FavoritesPage() {
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const { isAuthenticated } = useAuth();
  const { loadFavorites, toggleFavorite } = useFavorites();
  const router = useRouter();


  const loadFavoriteDogs = async () => {
    try {
      setIsLoading(true);
      const storedFavorites = await AsyncStorage.getItem("favorites");
      const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];
      
      if (favoriteIds.length > 0) {
        const dogs = await fetchDogDetails(favoriteIds);
        setFavoriteDogs(dogs || []);
      } else {
        setFavoriteDogs([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simplify the useEffect to only load data
  useEffect(() => {
    loadFavoriteDogs();
  }, []); 

  const handleToggleFavorite = async (dogId: string): Promise<void> => {
    await toggleFavorite(dogId);
    await loadFavoriteDogs();
  };

  const handleMatch = async () => {
    if (favoriteDogs.length === 0) {
      Alert.alert("No Favorites", "Please add some favorite dogs first!");
      return;
    }

    try {
      setIsLoading(true);
      const favoriteIds = favoriteDogs.map(dog => dog.id);
      const match = await matchDog(favoriteIds);
      
      if (match?.match) {
        const matchedDogDetails = await fetchDogDetails([match.match]);
        if (matchedDogDetails && matchedDogDetails.length > 0) {
          setMatchedDog(matchedDogDetails[0]);
          setModalVisible(true);
        }
      }
    } catch (error) {
      console.error('Error finding match:', error);
      Alert.alert("Error", "Failed to find a match.");
    } finally {
      setIsLoading(false);
    }
  };

  const goToHome = () => router.replace("/");

  // Calculate pagination
  const totalPages = Math.ceil(favoriteDogs.length / PAGE_SIZE);
  const startIndex = currentPage * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentDogs = favoriteDogs.slice(startIndex, endIndex);

  return (
    <ScrollView style={styles.container}>
      <Header showLogout={false} />
      
      {/* Favorites Count and Match Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={goToHome}
          style={styles.favoritesButton}
        >
          Total Favorites ({favoriteDogs.length})
        </Button>
        
        <View style={styles.navigationButtons}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </TouchableOpacity>
        
        <Button
          mode="contained"
          onPress={handleMatch}
          style={styles.matchButton}
          disabled={favoriteDogs.length === 0}
        >
          Find a Match
        </Button>
      </View>
      </View>
      
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
              <Button
                mode="contained"
                onPress={goToHome}
                style={styles.returnButton}
              >
                Find Dogs
              </Button>
            </View>
          ) : (
            <>
              <View style={styles.gridContainer}>
              {currentDogs.map((dog: Dog) => (  // Add ': Dog' here
                <DogCard
                  key={dog.id}
                  dog={dog}
                  isFavorite={true}
                  onToggleFavorite={handleToggleFavorite}
                  cardWidth={CARD_WIDTH}
                  showRemoveButton={true}
                />
              ))}
            </View>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </View>
      )}

      {/* Match Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your Perfect Match! 🎉</Text>
            {matchedDog && (
              <>
                <Card style={styles.matchCard}>
                  <Card.Cover source={{ uri: matchedDog.img }} style={styles.matchDogImage} />
                  <Card.Content>
                    <Text style={styles.dogName}>{matchedDog.name}</Text>
                    <Text style={styles.dogBreed}>{matchedDog.breed}</Text>
                    <Text style={styles.dogInfo}>Age: {matchedDog.age} years</Text>
                    <Text style={styles.dogInfo}>ZIP: {matchedDog.zip_code}</Text>
                  </Card.Content>
                </Card>
              </>
            )}
            <Button
              mode="contained"
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF3E0",
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
  favoritesButton: {
    backgroundColor: "#6A4C93",
  },
  matchButton: {
    backgroundColor: "#FF3B70",
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
    marginHorizontal: -CARD_MARGIN,
  },
  card: {
    margin: CARD_MARGIN,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  dogImage: {
    height: CARD_WIDTH * 0.75,
  },
  cardContent: {
    padding: 8,
  },
  dogName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  dogBreed: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dogInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  removeButton: {
    marginTop: 8,
    backgroundColor: '#FF3B70',
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
    marginBottom: 24,
  },
  returnButton: {
    backgroundColor: '#6A4C93',
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A4C93',
    textAlign: 'center',
    marginBottom: 16,
  },
  matchCard: {
    marginVertical: 16,
  },
  matchDogImage: {
    height: 250,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#6A4C93',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  backButton: {
    backgroundColor: '#6A4C93',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, Alert, ActivityIndicator, TouchableOpacity, Modal, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { fetchDogDetails, matchDog } from "./api";
import { Dog } from "./types";
import { Card, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons"; // Import icons

const PAGE_SIZE = 15; // Define how many favorites per page


export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const dogsPerPage = 15;

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        const storedFavorites = await AsyncStorage.getItem("favorites");
        const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];

        if (favoriteIds.length > 0) {
          setFavorites(favoriteIds);
          const dogs = await fetchDogDetails("", favoriteIds);
          setFavoriteDogs(dogs);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load favorite dogs.");
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleUnfavorite = async (dogId: string) => {
    const updatedFavorites = favorites.filter((id) => id !== dogId);
    setFavorites(updatedFavorites);
    setFavoriteDogs(favoriteDogs.filter((dog) => dog.id !== dogId));
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleMatch = async () => {
    if (favorites.length === 0) {
      Alert.alert("No Favorites", "Please add some favorite dogs first!");
      return;
    }

    try {
      const match = await matchDog("", favorites);
      if (match?.match) {
        const matchedDogDetails = favoriteDogs.find((dog) => dog.id === match.match);
        if (matchedDogDetails) {
          setMatchedDog(matchedDogDetails);
          setModalVisible(true);
        } else {
          Alert.alert("Match Found!", `Dog ID: ${match.match} (Details not available)`);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to find a match.");
    }
  };

  const totalPages = Math.ceil(favoriteDogs.length / PAGE_SIZE);
  const indexOfLastDog = currentPage * PAGE_SIZE;
  const indexOfFirstDog = indexOfLastDog - PAGE_SIZE;
  const currentDogs = favoriteDogs.slice(indexOfFirstDog, indexOfLastDog);


  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🐶 Your Favorite Dogs</Text>
        <Text style={styles.subtitle}>Review your furry friends ❤️</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#6A4C93" style={styles.loading} />
      ) : favoriteDogs.length > 0 ? (
        <View style={styles.gridContainer}>
          {currentDogs.map((dog) => (
            <Card key={dog.id} style={styles.card}>
              <Image source={{ uri: dog.img }} style={styles.dogImage} resizeMode="cover" />
              <View style={styles.cardContent}>
                <Text style={styles.dogName}>{dog.name} - {dog.breed}</Text>
                <Text style={styles.dogInfo}>Age: {dog.age} years</Text>
                <Text style={styles.dogInfo}>Location: {dog.zip_code}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleUnfavorite(dog.id)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>
      ) : (
        <Text style={styles.noFavoritesText}>No favorite dogs selected.</Text>
      )}

      {/* Pagination with Dots and Arrows */}
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
          onPress={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <MaterialIcons name="chevron-left" size={24} color={currentPage === 1 ? "#ccc" : "#000"} />
        </TouchableOpacity>

        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNum = index + 1;
          const isCurrent = pageNum === currentPage;
          const showPage =
            pageNum <= 3 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1;

          if (!showPage) return null;

          return (
            <TouchableOpacity
              key={index}
              style={[styles.pageNumber, isCurrent && styles.currentPage]}
              onPress={() => setCurrentPage(pageNum)}
            >
              <Text style={styles.pageNumberText}>{pageNum}</Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.pageButton, currentPage >= totalPages && styles.pageButtonDisabled]}
          onPress={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <MaterialIcons name="chevron-right" size={24} color={currentPage >= totalPages ? "#ccc" : "#000"} />
        </TouchableOpacity>
      </View>

      <Button onPress={handleMatch} disabled={favoriteDogs.length === 0} style={styles.matchButton}>
        Find a Match
      </Button>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Matched Dog!</Text>
            {matchedDog && (
              <>
                <Image source={{ uri: matchedDog.img }} style={styles.dogImage} />
                <Text style={styles.dogName}>{matchedDog.name} - {matchedDog.breed}</Text>
                <Text style={styles.dogInfo}>Age: {matchedDog.age} years</Text>
                <Text style={styles.dogInfo}>Zip: {matchedDog.zip_code}</Text>
              </>
            )}
            <Button onPress={() => setModalVisible(false)} style={styles.modalButton}>
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
    padding: 16,
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: -8,
  },
  card: {
    width: 160,
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dogImage: {
    width: '100%',
    height: 120,
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
    marginBottom: 4,
  },
  dogInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  removeButton: {
    backgroundColor: '#FF3B70',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  removeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  pageButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  pageButtonDisabled: {
    backgroundColor: '#ccc',
  },
  pageButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  pageText: {
    fontSize: 14,
    color: '#666',
  },
  noFavoritesText: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginTop: 20,
  },
  matchButton: {
    marginTop: 20,
    backgroundColor: "#6A4C93",
    paddingVertical: 8,
    borderRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  modalButton: {
    marginTop: 12,
    backgroundColor: "#6A4C93",
    paddingVertical: 8,
    borderRadius: 6,
  },
  loading: {
    marginTop: 20,
  },
  pageNumber: { 
    padding: 8, 
    marginHorizontal: 3, 
    borderRadius: 5, 
    backgroundColor: "#ddd" 
  },
  currentPage: { 
    backgroundColor: "#007AFF" 
  },
  pageNumberText: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#fff" 
  },
});
